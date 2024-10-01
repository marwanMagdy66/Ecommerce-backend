import { Cart } from "../../../DB/models/cart.js";
import { Coupon } from "../../../DB/models/coupon.model.js";
import { Order } from "../../../DB/models/order.model.js";
import { Product } from "../../../DB/models/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import createInvoice from "../../utils/pdfInvoice.js";
import path from "path";
import { fileURLToPath } from "url";
import { sendEmail } from "../../utils/sendEmails.js";
import { clearCart, updateStock } from "./order.service.js";
import Stripe from "stripe";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const createOrder = asyncHandler(async (req, res, next) => {
  //data
  const { payment, address, phone, coupon } = req.body;
  //check coupon
  let checkCoupon;
  if (coupon) {
    checkCoupon = await Coupon.findOne({
      name: coupon,
      expiredAt: { $gt: Date.now() },
    });
  }
  if (!checkCoupon) {
    return next(new Error("Invalid coupon", { cause: 400 }));
  }

  //get products from cart
  const cart = await Cart.findOne({ userId: req.user._id });
  const products = cart.products;
  if (products.length < 1)
    return next(new Error("Cart is empty", { cause: 400 }));

  //check products
  let orderPorducts = [];
  let orderPrice = 0;

  for (let i = 0; i < products.length; i++) {
    const product = await Product.findById(products[i].productId);
    if (!product) {
      return next(new Error("Product not found", { cause: 400 }));
    }
    if (!product.inStock(products[i].quantity))
      return next(new Error("Product is out of stock", { cause: 400 }));
    orderPorducts.push({
      name: product.name,
      productId: product._id,
      quantity: products[i].quantity,
      itemPrice: product.finalPrice,
      totalPrice: product.finalPrice * products[i].quantity,
    });

    orderPrice += product.finalPrice * products[i].quantity;
  }
  // create order in DB
  const order = await Order.create({
    userId: req.user._id,
    address,
    phone,
    payment,
    prodcuts: orderPorducts,
    price: orderPrice,
    coupon: {
      id: checkCoupon?._id,
      name: checkCoupon?.name,
      discount: checkCoupon?.discount,
    },
  });

  //create invoice
  const user = req.user;
  const invoice = {
    shipping: {
      name: user.userName,
      address: order.address,
      country: "Egypt",
    },
    items: order.prodcuts,
    subtotal: order.price, //before discount
    paid: order.finalPrice, //after discount
    invoice_nr: order._id,
  };

  const pdfPath = path.join(__dirname, `./../../tempInvoices/${order._id}.pdf`);
  createInvoice(invoice, pdfPath);
  console.log("done");

  //upload cloudinary
  const { secure_url, public_id } = await cloudinary.uploader.upload(pdfPath, {
    folder: `${process.env.CLOUD_FOLDER_NAME}/order/invoices`,
  });

  //add invoice in DB  "file" url,id
  order.invoice = { url: secure_url, id: public_id };
  await order.save();
  //send email to user "invoice"
  const isSent = await sendEmail({
    to: user.email,
    subject: "order Invoice",
    attachments: [{ path: secure_url, contentType: "application/pdf" }],
  });
  if (!isSent) return next(new Error("something went wrong!"));
  //update stock
  updateStock(order.prodcuts, true);

  //clear cart
  clearCart(user._id);
  if (payment === "visa") {
    //STRIPE  gatway
    const stripe = new Stripe(process.env.STRIPE_KEY);
    //coupon stripe
    let couponExisted;
    if (order.coupon.name !== undefined) {
      couponExisted = await stripe.coupons.create({
        percent_off: order.coupon.discount,
        duration: "once",
      });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      // success_url:,
      // cancel_url:,
      line_items: order.prodcuts.map((product) => {
        return {
          price_data: {
            currency: "egp",
            product_data: { name: product.name },
            unit_amount: product.itemPrice * 100,
          },
          quantity: product.quantity,
        };
      }),
      discounts: couponExisted ? [{ coupon: couponExisted.id }] : [],
    });
    return res.json({
      success: true,
      results: { url:session.url },
    });
  }
  //response
  return res.json({
    success: true,
    message: "order created successfully",
    order: { order },
  });
});

export const cancelOrder = asyncHandler(async (req, res, next) => {
  //check order
  const order = await Order.findById(req.params.id);
  if (!order) return next(new Error("order not found!"));
  // check status
  if (
    order.status === "delivered" ||
    order.status === "shipped" ||
    order.status === "canceled"
  )
    return next(new Error("can not cancel the order!"));

  // cancel order
  order.status = "canceled";
  await order.save();

  //  update stock
  updateStock(order.prodcuts, false);

  //response
  return res.json({ success: true, message: "order canceled successfully" });
});
