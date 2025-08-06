const nodemailer = require("nodemailer");
const { customAlphabet } = require("nanoid");

const alphabet = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const nanoid = customAlphabet(alphabet, 6);

const emailSend = async (email) => {
  const code = nanoid();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: `${process.env.EMAIL}`,
      pass: `${process.env.PASSWORD}`,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: `${email}`,
    subject: "Verification code",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="text-align: center; color: #333;">Email Verification</h2>
          <p style="font-size: 16px; color: #555;">
            Hello, <br><br>
            Please use the following code to verify your email address:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; background-color: #007BFF; color: white; font-size: 28px; padding: 12px 24px; border-radius: 6px; letter-spacing: 5px;">
              ${code}
            </span>
          </div>
          <p style="font-size: 14px; color: #888;">
            This code will expire in 5 minutes. If you didn't request this code, please ignore this email.
          </p>
          <p style="font-size: 14px; color: #555; margin-top: 30px;">
            Thank you,<br>
            The Team
          </p>
        </div>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);

  return info.accepted
    ? { ok: true, code }
    : { ok: false, message: "Mail failed to send, try again" };
};

module.exports = emailSend;
