/**
 * EMAIL 1: OTP VERIFICATION TEMPLATE
 *
 * Requirements:
 * - Wampire branding
 * - Six-digit OTP in high-contrast monospace container
 * - 10-minute expiry notice
 * - Security warning (never share code)
 * - Professional responsive HTML styling
 */
export const renderOtpVerificationEmail = ({ fullName, otp }) => {
  const subject = 'Verify Your Wampire Account';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f8fafc;
      padding: 40px 16px;
    }
    .card {
      max-width: 540px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 20px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
      padding: 32px 36px;
      text-align: left;
    }
    .logo-container {
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }
    .logo-badge {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.35);
      border-radius: 10px;
      width: 38px;
      height: 38px;
      line-height: 38px;
      text-align: center;
      color: #ffffff;
      font-weight: 800;
      font-size: 18px;
    }
    .brand-title {
      color: #ffffff;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .brand-sub {
      color: rgba(255, 255, 255, 0.8);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin: 2px 0 0 0;
    }
    .content {
      padding: 36px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 12px 0;
    }
    .intro-text {
      font-size: 14px;
      color: #475569;
      line-height: 1.6;
      margin: 0 0 28px 0;
    }
    .otp-box {
      background: #eff6ff;
      border: 2px dashed #93c5fd;
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      margin: 0 0 24px 0;
    }
    .otp-label {
      font-size: 11px;
      font-weight: 700;
      color: #1d4ed8;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin: 0 0 8px 0;
    }
    .otp-code {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
      font-size: 38px;
      font-weight: 800;
      color: #1e40af;
      letter-spacing: 10px;
      margin: 0;
    }
    .expiry-tag {
      display: inline-block;
      margin-top: 10px;
      font-size: 12px;
      color: #64748b;
      font-weight: 600;
    }
    .warning-box {
      background: #fffbeb;
      border-left: 4px solid #f59e0b;
      border-radius: 8px;
      padding: 14px 16px;
      margin: 0 0 28px 0;
    }
    .warning-title {
      font-size: 12px;
      font-weight: 700;
      color: #b45309;
      margin: 0 0 4px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .warning-desc {
      font-size: 12px;
      color: #78350f;
      line-height: 1.5;
      margin: 0;
    }
    .footer {
      border-top: 1px solid #f1f5f9;
      padding: 24px 36px;
      background: #fafafa;
      text-align: center;
    }
    .footer-text {
      font-size: 11px;
      color: #94a3b8;
      line-height: 1.5;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      
      <!-- Header -->
      <div class="header">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td class="logo-badge">C</td>
            <td style="padding-left: 12px;">
              <h1 class="brand-title">Wampire</h1>
              <p class="brand-sub">Hackathon Portal</p>
            </td>
          </tr>
        </table>
      </div>

      <!-- Main Body -->
      <div class="content">
        <h2 class="greeting">Hello, ${fullName || 'Hacker'}!</h2>
        <p class="intro-text">
          Thank you for joining the <strong>WAMPIRE</strong> technology community. To complete your account registration or verification, please enter the six-digit verification code below:
        </p>

        <!-- OTP Display Box -->
        <div class="otp-box">
          <div class="otp-label">Your Verification Code</div>
          <div class="otp-code">${otp}</div>
          <div class="expiry-tag">⏱️ This code will expire in <strong>10 minutes</strong></div>
        </div>

        <!-- Security Warning -->
        <div class="warning-box">
          <div class="warning-title">⚠️ Security Notice</div>
          <p class="warning-desc">
            Never share this verification code with anyone. Representatives of Wampire will never ask for your password or OTP. If you did not initiate this request, you can safely disregard this email.
          </p>
        </div>

        <p class="intro-text" style="margin-bottom: 0;">
          Need assistance? Feel free to reach out to our team at <a href="mailto:contact@wampire.org" style="color: #2563eb; text-decoration: none; font-weight: 600;">contact@wampire.org</a>.
        </p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p class="footer-text">
          © 2026 Wampire Hackathon Committee. All rights reserved.<br>
          Automated security dispatch. Please do not reply directly to this email.
        </p>
      </div>

    </div>
  </div>
</body>
</html>
  `;

  const text = `
Wampire - Email Verification
================================

Hello ${fullName || 'Hacker'},

Your Wampire verification code is: ${otp}

This code will expire in exactly 10 minutes.

SECURITY NOTICE:
Never share this OTP with anyone. The Wampire team will never ask for your code.
If you did not request this, you can safely ignore this email.

Best regards,
Wampire Organizing Committee
contact@wampire.org
  `.trim();

  return { subject, html, text };
};

export default renderOtpVerificationEmail;

