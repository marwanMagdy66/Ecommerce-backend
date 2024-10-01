import nodemailer from "nodemailer";
export const sendEmail = async ({ to, subject, html,attachments=[] }) => {
  // sender
  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 587,
    service: "Gmail",
    secure: true,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  //reciver
  const info=await transporter.sendMail({
    from:`"Ecommerce Application " <${process.env.USER}> `,
    to: to,
    subject: subject,
    html:html,
    attachments
    
  })
  if(info.rejected.length>0) return false;
  return true;
};
