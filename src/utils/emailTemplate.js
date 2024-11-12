class EmailTemplate {
    static verificationEmailTemplate = (code) => `
      <p>Hello,</p>
      <p>Welcome! We're thrilled to have you join our community.<p>
      <p>Please use the code below to verify your email:</p>
      <p>${code}</p>
      <p>Cheering you on,<p>
      <p>The Dev Team<p>
    `;
  
    static forgetPasswordEmailTemplate = (code) => `
      <p>Hello,</p>
      <p>Please use the below mentioned code to verify reset your password:</p>
      <p>${code}</p>
    `;
  }
  
  module.exports = EmailTemplate;
  