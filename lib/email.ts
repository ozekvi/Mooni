import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  code: string,
  userName?: string
) {
  const html = getVerificationEmailHTML(code, userName);

  return resend.emails.send({
    from: process.env.EMAIL_FROM || "Mooni Services <noreply@mooni.gg>",
    to: email,
    subject: "✨ Verify your Mooni account",
    html,
  });
}

function getVerificationEmailHTML(code: string, userName?: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify your Mooni account</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:wght@300;400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background-color:#09030f;font-family:'Raleway',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#09030f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          
          <!-- Header with Moon -->
          <tr>
            <td align="center" style="padding:40px 0 20px;">
              <div style="position:relative;display:inline-block;">
                <!-- Moon SVG -->
                <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="moonGrad" cx="40%" cy="40%" r="60%">
                      <stop offset="0%" stop-color="#e9d5ff"/>
                      <stop offset="50%" stop-color="#c084fc"/>
                      <stop offset="100%" stop-color="#7c22d4"/>
                    </radialGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <circle cx="55" cy="50" r="40" fill="url(#moonGrad)" filter="url(#glow)"/>
                  <circle cx="68" cy="43" r="32" fill="#09030f"/>
                </svg>
              </div>
              <div style="font-family:'Cinzel',serif;font-size:28px;font-weight:700;color:#c084fc;letter-spacing:4px;margin-top:16px;">MOONI</div>
              <div style="font-family:'Raleway',sans-serif;font-size:13px;color:#7c3aed;letter-spacing:6px;text-transform:uppercase;margin-top:4px;">Services</div>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent,#7c22d4,#c084fc,#7c22d4,transparent);"></div>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="padding:0 20px;">
              <div style="background:linear-gradient(135deg,#1a0a2e 0%,#0f051a 50%,#09030f 100%);border:1px solid #3b0764;border-radius:16px;padding:48px 40px;margin:30px 0;box-shadow:0 0 60px rgba(124,34,212,0.2);">
                
                <!-- Greeting -->
                <p style="font-family:'Cinzel',serif;font-size:22px;color:#e9d5ff;margin:0 0 8px;font-weight:600;">
                  Welcome${userName ? `, ${userName}` : ""}!
                </p>
                <p style="font-family:'Raleway',sans-serif;font-size:15px;color:#a78bfa;margin:0 0 32px;line-height:1.6;">
                  You're one step away from accessing exclusive Rise of Kingdoms services. 
                  Enter the verification code below to activate your account.
                </p>

                <!-- Code Box -->
                <div style="text-align:center;margin:32px 0;">
                  <div style="display:inline-block;background:linear-gradient(135deg,#1e003d,#3b0764);border:2px solid #7c22d4;border-radius:12px;padding:20px 40px;box-shadow:0 0 30px rgba(168,85,247,0.3),inset 0 0 20px rgba(124,34,212,0.1);">
                    <div style="font-family:'Cinzel',serif;font-size:11px;color:#7c3aed;letter-spacing:4px;text-transform:uppercase;margin-bottom:8px;">Verification Code</div>
                    <div style="font-family:'Cinzel',serif;font-size:42px;font-weight:700;letter-spacing:12px;color:#c084fc;text-shadow:0 0 20px rgba(192,132,252,0.8);">${code}</div>
                  </div>
                </div>

                <!-- Expiry -->
                <p style="font-family:'Raleway',sans-serif;font-size:13px;color:#6d28d9;text-align:center;margin:16px 0 32px;">
                  ⏱ This code expires in <strong style="color:#a78bfa;">15 minutes</strong>
                </p>

                <!-- Divider -->
                <div style="height:1px;background:linear-gradient(90deg,transparent,#3b0764,transparent);margin:24px 0;"></div>

                <!-- Security note -->
                <div style="background:rgba(124,34,212,0.1);border-left:3px solid #7c22d4;border-radius:0 8px 8px 0;padding:12px 16px;">
                  <p style="font-family:'Raleway',sans-serif;font-size:12px;color:#7c3aed;margin:0;line-height:1.5;">
                    🔒 If you didn't create a Mooni account, you can safely ignore this email. 
                    Never share this code with anyone.
                  </p>
                </div>
              </div>
            </td>
          </tr>

          <!-- Stars decoration -->
          <tr>
            <td align="center" style="padding:10px 0;">
              <span style="color:#4c1d95;font-size:18px;letter-spacing:8px;">✦ ✦ ✦</span>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:20px 40px 40px;">
              <p style="font-family:'Raleway',sans-serif;font-size:12px;color:#3b0764;margin:0;line-height:1.8;">
                © 2025 Mooni Services. Rise of Kingdoms Power.<br/>
                <span style="color:#4c1d95;">Need help? Join our <a href="https://discord.gg/mooni" style="color:#7c22d4;text-decoration:none;">Discord server</a></span>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
