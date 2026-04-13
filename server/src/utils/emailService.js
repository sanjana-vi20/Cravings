import sendEmail from "../config/email.js";

export const sentOTPEmail = async (to, otp) => {
  const subject = "OTP to reset your Cravings Password";
  const message = `<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
      <tr>
        <td align="center">

          <!-- Email Card -->
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px; background-color:#ffffff; border-radius:8px; padding:20px; box-shadow:0 4px 10px rgba(0,0,0,0.08);">

            <!-- Header -->
            <tr>
              <td align="center" style="padding-bottom:15px;">
                <h2 style="margin:0; color:#842A3B;">OTP Verification</h2>
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td style="color:#333333; font-size:14px; line-height:1.6;">
                <p style="margin:0 0 10px 0;">Hello,</p>
                <p style="margin:0 0 15px 0;">
                  Use the following One-Time Password (OTP) to complete your verification.
                  This OTP is valid for <strong>5 minutes</strong>.
                </p>
              </td>
            </tr>

            <!-- OTP Box -->
            <tr>
              <td align="center" style="padding:20px 0;">
                <div style="
                  display:inline-block;
                  padding:12px 24px;
                  font-size:24px;
                  letter-spacing:4px;
                  color:#842A3B;
                  background-color:#F5DAA7;
                  border-radius:6px;
                  font-weight:bold;
                ">
                  ${otp}
                </div>
              </td>
            </tr>

            <!-- Footer Text -->
            <tr>
              <td style="color:#555555; font-size:13px; line-height:1.5;">
                <p style="margin:0;">
                  If you did not request this OTP, please ignore this email.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="padding-top:20px; font-size:12px; color:#888888;">
                <p style="margin:0;">© ${new Date().getFullYear()} Cravings India Pvt. Ltd. All rights reserved.</p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>`;

  await sendEmail(to , subject , message);
};
