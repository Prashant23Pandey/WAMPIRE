/**
 * EMAIL 2: REGISTRATION CONFIRMATION TEMPLATE
 *
 * Requirements:
 * - Participant name
 * - Event name
 * - Registration confirmation badge & status
 * - College name
 * - Domain
 * - Project name
 * - Team size
 * - Team member details
 * - Registration ID
 * - Professional responsive HTML styling
 */
export const renderRegistrationConfirmationEmail = ({
  participantName,
  eventName = 'WAMPIRE 2026',
  registrationId,
  collegeName,
  domain,
  projectName,
  teamSize = 1,
  teamMembers = [],
}) => {
  const subject = 'Your Wampire Hackathon Registration is Confirmed!';

  const formattedRegId = registrationId
    ? `WAM-REG-${registrationId.toString().slice(-8).toUpperCase()}`
    : 'WAM-REG-PENDING';

  // Format team members table rows
  const memberRows =
    teamMembers && teamMembers.length > 0
      ? teamMembers
          .map(
            (m, idx) => `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 12px; font-size: 13px; color: #0f172a; font-weight: 600;">${m.name}</td>
              <td style="padding: 10px 12px; font-size: 12px; color: #64748b; font-family: monospace;">${m.email}</td>
              <td style="padding: 10px 12px; font-size: 11px; text-transform: uppercase; color: #2563eb; font-weight: 700;">${m.role || 'Member'}</td>
            </tr>
          `
          )
          .join('')
      : '';

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
      max-width: 600px;
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
      color: rgba(255, 255, 255, 0.85);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin: 2px 0 0 0;
    }
    .content {
      padding: 36px;
    }
    .badge-success {
      display: inline-block;
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      color: #065f46;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      padding: 6px 14px;
      border-radius: 9999px;
      margin-bottom: 16px;
    }
    .greeting {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 12px 0;
      letter-spacing: -0.5px;
    }
    .intro-text {
      font-size: 14px;
      color: #475569;
      line-height: 1.6;
      margin: 0 0 28px 0;
    }
    .detail-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      overflow: hidden;
      margin-bottom: 24px;
    }
    .detail-row {
      padding: 12px 18px;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      justify-content: space-between;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .detail-value {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      text-align: right;
    }
    .table-container {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
    }
    .table-header {
      background: #f1f5f9;
      font-size: 11px;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      text-align: left;
      padding: 8px 12px;
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
              <p class="brand-sub">${eventName}</p>
            </td>
          </tr>
        </table>
      </div>

      <!-- Content -->
      <div class="content">
        <div class="badge-success">✓ Registration Confirmed</div>
        
        <h2 class="greeting">Welcome Aboard, ${participantName}!</h2>
        <p class="intro-text">
          Congratulations! Your official registration for <strong>${eventName}</strong> has been successfully received and locked in. Below are your confirmed participation details:
        </p>

        <!-- Details Table -->
        <div class="detail-card">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase;">Registration ID</td>
              <td style="padding: 12px 16px; font-size: 13px; color: #2563eb; font-weight: 800; font-family: monospace; text-align: right;">${formattedRegId}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase;">Event Name</td>
              <td style="padding: 12px 16px; font-size: 13px; color: #0f172a; font-weight: 700; text-align: right;">${eventName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase;">College / University</td>
              <td style="padding: 12px 16px; font-size: 13px; color: #0f172a; font-weight: 700; text-align: right;">${collegeName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase;">Selected Domain</td>
              <td style="padding: 12px 16px; font-size: 13px; color: #7c3aed; font-weight: 800; text-align: right;">${domain}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase;">Project Name</td>
              <td style="padding: 12px 16px; font-size: 13px; color: #0f172a; font-weight: 700; text-align: right;">${projectName}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase;">Squad Size</td>
              <td style="padding: 12px 16px; font-size: 13px; color: #0f172a; font-weight: 700; text-align: right;">${teamSize} ${teamSize > 1 ? 'Hackers' : 'Hacker (Solo)'}</td>
            </tr>
          </table>
        </div>

        <!-- Team Members Section (if squad size > 1) -->
        ${
          teamMembers && teamMembers.length > 0
            ? `
          <div style="margin-bottom: 24px;">
            <div style="font-size: 13px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
              Team Squad Members:
            </div>
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
              <table width="100%" cellpadding="0" cellspacing="0" class="table-container">
                <thead>
                  <tr>
                    <th class="table-header">Name</th>
                    <th class="table-header">Email</th>
                    <th class="table-header">Role</th>
                  </tr>
                </thead>
                <tbody>
                  ${memberRows}
                </tbody>
              </table>
            </div>
          </div>
        `
            : ''
        }

        <!-- Next Steps -->
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
          <div style="font-size: 13px; font-weight: 700; color: #1e40af; margin-bottom: 6px;">Next Steps for Hackers:</div>
          <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #3b82f6; line-height: 1.6;">
            <li>Access your participant dashboard on the Wampire Portal.</li>
            <li>Coordinate with your squad to refine project architecture and tech stacks.</li>
            <li>Check your email for sprint schedules and live evaluation links.</li>
          </ul>
        </div>

        <p class="intro-text" style="margin-bottom: 0;">
          For any updates or team modifications, contact the coordination committee at <a href="mailto:support@wampire.org" style="color: #2563eb; text-decoration: none; font-weight: 600;">support@wampire.org</a>.
        </p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p class="footer-text">
          © 2026 Wampire Organizing Committee. All rights reserved.<br>
          Official confirmation dispatch.
        </p>
      </div>

    </div>
  </div>
</body>
</html>
  `;

  const text = `
Wampire - Registration Confirmed
====================================

Hello ${participantName},

Your registration for ${eventName} is officially confirmed!

CONFIRMATION DETAILS:
- Registration ID: ${formattedRegId}
- Event: ${eventName}
- College: ${collegeName}
- Domain: ${domain}
- Project: ${projectName}
- Team Size: ${teamSize}
${
  teamMembers && teamMembers.length > 0
    ? `\nTeam Squad Members:\n` +
      teamMembers.map((m) => `  * ${m.name} (${m.email}) - ${m.role || 'Member'}`).join('\n')
    : ''
}

Best regards,
Wampire Organizing Committee
support@wampire.org
  `.trim();

  return { subject, html, text };
};

export default renderRegistrationConfirmationEmail;

