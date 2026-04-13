import nodemailer from "nodemailer";
// import dotenv from 'dotenv'
// dotenv.config();

const sendEmail = async (to, subject, message) => {
  try {

    console.log("sending Email");
    
    const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSCODE,
    },
  });

  const mailOption = {
    from:process.env.GMAIL_USER,
    to,
    subject,
    html:message,
  }
    console.log("3 ,2 ,1");


  const res = await transporter.sendMail(mailOption);
  console.log(res);
  } catch (error) {
    console.log(error);
    
  }
};

// sendEmail("vishwakarmasunita963@gmail.com" , "test Email" ," <p style ='color:red;'>TEST Message </p>")

export default sendEmail;
