interface WelcomeEmailParams {
  name: string;
  email: string;
  password: string;
}

export function getWelcomeEmailTemplate({
  name,
  email,
  password,
}: WelcomeEmailParams): { subject: string; html: string } {
  return {
    subject: "Welcome to PhysioFix - Your Account Details",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#3b82f6,#6366f1,#8b5cf6);padding:40px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">PhysioFix</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;font-weight:500;">Expert Physiotherapy Care</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 32px;">
              <h2 style="margin:0 0 16px;color:#0f172a;font-size:22px;font-weight:700;">Welcome, ${name}! 🎉</h2>
              <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.7;">
                Your account has been created successfully. You can now log in to your patient portal to track your recovery, view assigned exercises, and manage your consultations.
              </p>

              <!-- Credentials Card -->
              <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin-bottom:24px;">
                <p style="margin:0 0 12px;color:#1e293b;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Your Login Credentials</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:8px 0;color:#64748b;font-size:14px;font-weight:500;width:80px;">Email</td>
                    <td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:600;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;color:#64748b;font-size:14px;font-weight:500;">Password</td>
                    <td style="padding:8px 0;">
                      <code style="background-color:#eef2ff;color:#4f46e5;padding:4px 12px;border-radius:8px;font-size:14px;font-weight:700;letter-spacing:0.5px;">${password}</code>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Instructions -->
              <div style="background-color:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:20px;margin-bottom:24px;">
                <p style="margin:0 0 12px;color:#1e40af;font-size:14px;font-weight:600;">📋 How to Log In:</p>
                <ol style="margin:0;padding-left:20px;color:#334155;font-size:14px;line-height:2;">
                  <li>Visit <a href="https://physiofix.net/login" style="color:#3b82f6;font-weight:600;">physiofix.net/login</a></li>
                  <li>Enter your email and the password above</li>
                  <li>Access your personal patient dashboard</li>
                </ol>
              </div>

              <p style="margin:0 0 8px;color:#64748b;font-size:13px;line-height:1.6;">
                <strong>Important:</strong> We recommend changing your password after your first login for added security. You can do this from your profile settings.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;background-color:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0 0 4px;color:#94a3b8;font-size:12px;">
                PhysioFix | JP Nagar 8th Phase, Bangalore
              </p>
              <p style="margin:0;color:#94a3b8;font-size:12px;">
                Questions? Reply to this email or call <a href="tel:+918151912525" style="color:#3b82f6;text-decoration:none;">+91-8151912525</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };
}

interface AdminNotificationParams {
  patientName: string;
  phone: string;
  email: string;
  notes?: string;
}

export function getAdminNotificationTemplate({
  patientName,
  phone,
  email,
  notes,
}: AdminNotificationParams): { subject: string; html: string } {
  return {
    subject: `New Consultation Request - ${patientName}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#3b82f6,#6366f1);padding:32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">📋 New Consultation Request</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">A new patient has booked a consultation</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <!-- Patient Details -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:12px 16px;background-color:#f8fafc;border-radius:12px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;color:#64748b;font-size:13px;font-weight:500;width:100px;">Patient Name</td>
                        <td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600;">${patientName}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#64748b;font-size:13px;font-weight:500;">Phone</td>
                        <td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600;"><a href="tel:${phone}" style="color:#3b82f6;text-decoration:none;">${phone}</a></td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#64748b;font-size:13px;font-weight:500;">Email</td>
                        <td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600;"><a href="mailto:${email}" style="color:#3b82f6;text-decoration:none;">${email}</a></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${notes ? `
              <!-- Pain/Injury Description -->
              <div style="margin-bottom:24px;">
                <p style="margin:0 0 8px;color:#1e293b;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Pain / Injury / Recovery Goal</p>
                <div style="background-color:#fefce8;border:1px solid #fde68a;border-radius:12px;padding:16px;">
                  <p style="margin:0;color:#713f12;font-size:14px;line-height:1.7;white-space:pre-wrap;">${notes}</p>
                </div>
              </div>
              ` : `
              <div style="margin-bottom:24px;">
                <p style="margin:0 0 8px;color:#1e293b;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Pain / Injury / Recovery Goal</p>
                <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;">
                  <p style="margin:0;color:#94a3b8;font-size:14px;font-style:italic;">No description provided</p>
                </div>
              </div>
              `}

              <!-- Action -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://physiofix.net/dashboard/consultations" style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#6366f1);color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:10px;font-size:14px;font-weight:600;">View in Dashboard →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background-color:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;color:#94a3b8;font-size:12px;">
                This is an automated notification from PhysioFix
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };
}
