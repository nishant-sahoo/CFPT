module.exports.ITERATIONS = 10;

module.exports.ADMINLIST = [
  "arkbalakumar@gmail.com",
  "nishantsahoo02@gmail.com",
  "mahadevusudheer274@gmail.com",
];

module.exports.ROLES = {
  ADMIN: "Admin",
  USER: "User",
};

module.exports.SENDEMAIL = (token) => {
  return {
    VERIFICATION: {
      subject: "Verify your email address",
      content: `
        <p>Hello,</p>
        <p>Please click on the following link to verify your email address:</p>
        <a href="${process.env.APP_URL}/auth/verify-email/${token}">Verify Email</a>

      `,
    },
    FORGOTPASS: {
      subject: "Forgot Password Request",
      content: `
        <p>Hello,</p>
        <p>Please click on the following link to change your password:</p>
        <a href="${process.env.CLIENT_URL}/forgot-password/?value=${token}">Change Password</a>

      `,
    },
  };
};

module.exports.validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};
