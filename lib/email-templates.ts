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
                PhysioFix | 30, Sai Krupa Complex, JP Nagar 8th Phase, Bengaluru 560076
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

// ─── Appointment Confirmation (Patient) ──────────────────────────────

interface AppointmentConfirmationParams {
  patientName: string;
  date: string;
  time: string;
  type: string;
  notes?: string;
}

export function getAppointmentConfirmationTemplate({
  patientName,
  date,
  time,
  type,
  notes,
}: AppointmentConfirmationParams): { subject: string; html: string } {
  const formattedDate = new Date(date).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    subject: "PhysioFix - Appointment Confirmed",
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
            <td style="background:linear-gradient(135deg,#0284c7,#0ea5e9);padding:40px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">PhysioFix</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;font-weight:500;">Expert Physiotherapy Care</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 32px;">
              <h2 style="margin:0 0 16px;color:#0f172a;font-size:22px;font-weight:700;">Appointment Confirmed ✅</h2>
              <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.7;">
                Hi ${patientName}, your appointment has been successfully scheduled. Here are the details:
              </p>

              <!-- Appointment Details Card -->
              <div style="background-color:#f0f9ff;border:1px solid #bae6fd;border-radius:12px;padding:24px;margin-bottom:24px;">
                <p style="margin:0 0 16px;color:#0369a1;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">📅 Appointment Details</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:8px 0;color:#64748b;font-size:14px;font-weight:500;width:100px;">Date</td>
                    <td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:600;">${formattedDate}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;color:#64748b;font-size:14px;font-weight:500;">Time</td>
                    <td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:600;">${time}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;color:#64748b;font-size:14px;font-weight:500;">Type</td>
                    <td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:600;">${type}</td>
                  </tr>
                </table>
              </div>

              ${
                notes
                  ? `
              <!-- Notes -->
              <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px;">
                <p style="margin:0 0 8px;color:#1e293b;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Notes</p>
                <p style="margin:0;color:#475569;font-size:14px;line-height:1.7;white-space:pre-wrap;">${notes}</p>
              </div>
              `
                  : ""
              }

              <p style="margin:0;color:#64748b;font-size:13px;line-height:1.6;">
                Please arrive 10 minutes before your scheduled time. If you need to reschedule or cancel, contact us as soon as possible.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;background-color:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0 0 4px;color:#94a3b8;font-size:12px;">
                PhysioFix | 30, Sai Krupa Complex, JP Nagar 8th Phase, Bengaluru 560076
              </p>
              <p style="margin:0;color:#94a3b8;font-size:12px;">
                Questions? Reply to this email or call <a href="tel:+918151912525" style="color:#0284c7;text-decoration:none;">+91-8151912525</a>
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

// ─── Appointment Admin Notification ──────────────────────────────────

interface AppointmentAdminParams {
  patientName: string;
  patientEmail: string;
  date: string;
  time: string;
  type: string;
}

export function getAppointmentAdminTemplate({
  patientName,
  patientEmail,
  date,
  time,
  type,
}: AppointmentAdminParams): { subject: string; html: string } {
  const formattedDate = new Date(date).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    subject: `New Appointment - ${patientName}`,
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
            <td style="background:linear-gradient(135deg,#0284c7,#0ea5e9);padding:32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">📅 New Appointment Booked</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">A new appointment has been scheduled</p>
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
                        <td style="padding:6px 0;color:#64748b;font-size:13px;font-weight:500;width:120px;">Patient</td>
                        <td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600;">${patientName}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#64748b;font-size:13px;font-weight:500;">Email</td>
                        <td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600;"><a href="mailto:${patientEmail}" style="color:#0284c7;text-decoration:none;">${patientEmail}</a></td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#64748b;font-size:13px;font-weight:500;">Date</td>
                        <td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600;">${formattedDate}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#64748b;font-size:13px;font-weight:500;">Time</td>
                        <td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600;">${time}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#64748b;font-size:13px;font-weight:500;">Type</td>
                        <td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600;">${type}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Action -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://physiofix.net/dashboard/appointments" style="display:inline-block;background:linear-gradient(135deg,#0284c7,#0ea5e9);color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:10px;font-size:14px;font-weight:600;">View in Dashboard →</a>
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

// ─── Forgot Password Email ──────────────────────────────────

interface ResetPasswordEmailParams {
  name: string;
  resetLink: string;
}

export function getResetPasswordTemplate({
  name,
  resetLink,
}: ResetPasswordEmailParams): { subject: string; html: string } {
  return {
    subject: "PhysioFix - Reset Your Password",
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
              <h2 style="margin:0 0 16px;color:#0f172a;font-size:22px;font-weight:700;">Reset Your Password 🔐</h2>
              <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.7;">
                Hi ${name}, we received a request to reset the password for your PhysioFix account. Click the button below to set a new password.
              </p>

              <!-- Reset Button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <a href="${resetLink}" style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#6366f1);color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:12px;font-size:16px;font-weight:600;letter-spacing:0.3px;">Reset Password →</a>
                  </td>
                </tr>
              </table>

              <!-- Info Box -->
              <div style="background-color:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:20px;margin-bottom:24px;">
                <p style="margin:0;color:#9a3412;font-size:13px;line-height:1.7;">
                  <strong>⏱ This link expires in 1 hour.</strong> If you didn&apos;t request a password reset, you can safely ignore this email — your password will remain unchanged.
                </p>
              </div>

              <p style="margin:0;color:#64748b;font-size:13px;line-height:1.6;">
                If the button above doesn&apos;t work, copy and paste this link into your browser:
              </p>
              <p style="margin:8px 0 0;color:#3b82f6;font-size:12px;word-break:break-all;line-height:1.5;">
                ${resetLink}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;background-color:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0 0 4px;color:#94a3b8;font-size:12px;">
                PhysioFix | 30, Sai Krupa Complex, JP Nagar 8th Phase, Bengaluru 560076
              </p>
              <p style="margin:0;color:#94a3b8;font-size:12px;">
                Questions? Reply to this email or call <a href="tel:+918****2525" style="color:#3b82f6;text-decoration:none;">+91-8151912525</a>
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

// ─── Consultation Summary (Patient) ──────────────────────────────────

interface ConsultationSummaryParams {
  patientName: string;
  diagnosis: string;
  treatment: string;
  followUpDate?: string;
}

export function getConsultationSummaryTemplate({
  patientName,
  diagnosis,
  treatment,
  followUpDate,
}: ConsultationSummaryParams): { subject: string; html: string } {
  const formattedFollowUp = followUpDate
    ? new Date(followUpDate).toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return {
    subject: "PhysioFix - Consultation Summary",
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
            <td style="background:linear-gradient(135deg,#0284c7,#0ea5e9);padding:40px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">PhysioFix</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;font-weight:500;">Consultation Summary</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 32px;">
              <h2 style="margin:0 0 16px;color:#0f172a;font-size:22px;font-weight:700;">Your Consultation Summary 📋</h2>
              <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.7;">
                Hi ${patientName}, your consultation has been recorded. Here is a summary of your visit:
              </p>

              <!-- Diagnosis Card -->
              <div style="margin-bottom:20px;">
                <p style="margin:0 0 8px;color:#1e293b;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Diagnosis</p>
                <div style="background-color:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:16px;">
                  <p style="margin:0;color:#7f1d1d;font-size:14px;line-height:1.7;white-space:pre-wrap;">${diagnosis}</p>
                </div>
              </div>

              <!-- Treatment Plan Card -->
              <div style="margin-bottom:20px;">
                <p style="margin:0 0 8px;color:#1e293b;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Treatment Plan</p>
                <div style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;">
                  <p style="margin:0;color:#14532d;font-size:14px;line-height:1.7;white-space:pre-wrap;">${treatment}</p>
                </div>
              </div>

              ${
                formattedFollowUp
                  ? `
              <!-- Follow-up Card -->
              <div style="margin-bottom:24px;">
                <p style="margin:0 0 8px;color:#1e293b;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Follow-up Date</p>
                <div style="background-color:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:16px;">
                  <p style="margin:0;color:#1e40af;font-size:14px;font-weight:600;">📅 ${formattedFollowUp}</p>
                </div>
              </div>
              `
                  : ""
              }

              <!-- Encouragement -->
              <div style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin-bottom:8px;">
                <p style="margin:0;color:#166534;font-size:14px;line-height:1.7;text-align:center;">
                  💪 Stay consistent with your treatment plan, and you'll be on the road to recovery in no time!
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;background-color:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0 0 4px;color:#94a3b8;font-size:12px;">
                PhysioFix | 30, Sai Krupa Complex, JP Nagar 8th Phase, Bengaluru 560076
              </p>
              <p style="margin:0;color:#94a3b8;font-size:12px;">
                Questions? Reply to this email or call <a href="tel:+918151912525" style="color:#0284c7;text-decoration:none;">+91-8151912525</a>
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

// ─── Consultation Admin Notification ─────────────────────────────────

interface ConsultationAdminParams {
  patientName: string;
  diagnosis: string;
  treatment: string;
}

export function getConsultationAdminTemplate({
  patientName,
  diagnosis,
  treatment,
}: ConsultationAdminParams): { subject: string; html: string } {
  return {
    subject: `Consultation Recorded - ${patientName}`,
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
            <td style="background:linear-gradient(135deg,#0284c7,#0ea5e9);padding:32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">📋 Consultation Recorded</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">A consultation has been completed</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <!-- Patient & Details -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:12px 16px;background-color:#f8fafc;border-radius:12px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;color:#64748b;font-size:13px;font-weight:500;width:100px;">Patient</td>
                        <td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600;">${patientName}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Diagnosis -->
              <div style="margin-bottom:16px;">
                <p style="margin:0 0 6px;color:#1e293b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Diagnosis</p>
                <div style="background-color:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:14px;">
                  <p style="margin:0;color:#7f1d1d;font-size:14px;line-height:1.6;white-space:pre-wrap;">${diagnosis}</p>
                </div>
              </div>

              <!-- Treatment -->
              <div style="margin-bottom:24px;">
                <p style="margin:0 0 6px;color:#1e293b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Treatment</p>
                <div style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:14px;">
                  <p style="margin:0;color:#14532d;font-size:14px;line-height:1.6;white-space:pre-wrap;">${treatment}</p>
                </div>
              </div>

              <!-- Action -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://physiofix.net/dashboard/consultations" style="display:inline-block;background:linear-gradient(135deg,#0284c7,#0ea5e9);color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:10px;font-size:14px;font-weight:600;">View in Dashboard →</a>
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
