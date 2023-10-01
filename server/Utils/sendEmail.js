const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, token, subject, content) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_HOST,
      //   port: "587",
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: subject,
      html: content,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}.`);
  } catch (error) {
    console.error(error);
  }
};

module.exports = sendVerificationEmail;
