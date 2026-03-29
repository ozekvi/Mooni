import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  code: string,
  userName?: string
) {
  const html = getVerificationEmailHTML(code, userName);

  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM || "Mooni Services <noreply@mooni.gg>",
    to: email,
    subject: "🌙 Подтвердите ваш аккаунт Mooni Services",
    html,
  });

  return result;
}

function getVerificationEmailHTML(code: string, userName?: string): string {
  const digits = code.split("").map(d => `
    <td style="padding: 0 4px;">
      <div style="
        width: 44px; height: 56px;
        display: inline-flex; align-items: center; justify-content: center;
        background: linear-gradient(145deg, rgba(88,28,135,0.6), rgba(59,7,100,0.8));
        border: 2px solid rgba(168,85,247,0.6);
        border-radius: 12px;
        font-family: 'Courier New', monospace;
        font-size: 28px; font-weight: 900;
        color: #e9d5ff;
        text-shadow: 0 0 20px rgba(192,132,252,0.8);
        box-shadow: 0 0 20px rgba(168,85,247,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
      ">${d}</div>
    </td>
  `).join("");

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Подтвердите email — Mooni Services</title>
</head>
<body style="margin:0; padding:0; background-color:#09030f; font-family:'Segoe UI', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#09030f; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:580px; width:100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 0 30px;">
              <!-- Moon SVG -->
              <div style="margin-bottom: 16px;">
                <svg width="90" height="90" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="moonFill" cx="38%" cy="38%" r="65%">
                      <stop offset="0%" stop-color="#f3e8ff"/>
                      <stop offset="30%" stop-color="#d8b4fe"/>
                      <stop offset="65%" stop-color="#a855f7"/>
                      <stop offset="100%" stop-color="#6b21a8"/>
                    </radialGradient>
                    <filter id="moonGlow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="5" result="blur"/>
                      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                  </defs>
                  <circle cx="105" cy="100" r="78" fill="url(#moonFill)" filter="url(#moonGlow)"/>
                  <circle cx="138" cy="88" r="66" fill="#09030f"/>
                  <circle cx="75" cy="85" r="8" fill="rgba(0,0,0,0.25)" opacity="0.5"/>
                  <circle cx="60" cy="115" r="5" fill="rgba(0,0,0,0.2)" opacity="0.4"/>
                  <circle cx="90" cy="130" r="6" fill="rgba(0,0,0,0.2)" opacity="0.35"/>
                </svg>
              </div>
              <div style="font-size:28px; font-weight:800; color:#c084fc; letter-spacing:5px; margin-bottom:4px;">MOONI</div>
              <div style="font-size:12px; color:#7c3aed; letter-spacing:6px; text-transform:uppercase;">Services</div>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 30px;">
              <div style="height:1px; background:linear-gradient(90deg, transparent, #7c22d4, #c084fc, #7c22d4, transparent);"></div>
            </td>
          </tr>

          <!-- Main card -->
          <tr>
            <td style="padding: 8px 20px 0;">
              <div style="
                background: linear-gradient(145deg, #1a0a2e 0%, #0f051a 60%, #09030f 100%);
                border: 1px solid rgba(59,7,100,0.7);
                border-radius: 20px;
                padding: 44px 40px;
                margin: 24px 0;
                box-shadow: 0 0 60px rgba(124,34,212,0.15), 0 20px 50px rgba(0,0,0,0.5);
              ">
                <!-- Stars decoration -->
                <div style="text-align:center; margin-bottom:24px;">
                  <span style="color:#4c1d95; font-size:14px; letter-spacing:8px;">✦ ✦ ✦</span>
                </div>

                <!-- Greeting -->
                <h1 style="
                  font-size:24px; font-weight:700; margin:0 0 12px;
                  background:linear-gradient(135deg, #f3e8ff, #c084fc);
                  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
                  background-clip:text;
                ">
                  ${userName ? `Добро пожаловать, ${userName}!` : "Добро пожаловать!"}
                </h1>

                <p style="font-size:16px; color:#a78bfa; line-height:1.7; margin:0 0 32px;">
                  Спасибо за регистрацию в <strong style="color:#c084fc;">Mooni Services</strong> — 
                  вашем надёжном источнике премиум услуг в Rise of Kingdoms.<br/><br/>
                  Для активации аккаунта введите этот код подтверждения:
                </p>

                <!-- Code display -->
                <div style="text-align:center; margin: 36px 0;">
                  <p style="
                    font-size:11px; color:#6d28d9; letter-spacing:4px;
                    text-transform:uppercase; margin:0 0 16px; font-weight:600;
                  ">КОД ПОДТВЕРЖДЕНИЯ</p>
                  
                  <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                    <tr>${digits}</tr>
                  </table>

                  <!-- Alternative plain text code -->
                  <div style="
                    margin-top: 20px;
                    font-size: 32px; font-weight: 900; letter-spacing: 10px;
                    color: #c084fc;
                    font-family: 'Courier New', monospace;
                    text-shadow: 0 0 30px rgba(192,132,252,0.5);
                  ">${code}</div>
                </div>

                <!-- Timer -->
                <div style="
                  background: rgba(124,34,212,0.12);
                  border: 1px solid rgba(124,34,212,0.3);
                  border-radius: 12px;
                  padding: 14px 20px;
                  text-align: center;
                  margin: 28px 0;
                ">
                  <span style="font-size:14px; color:#a78bfa;">
                    ⏱ Код действителен <strong style="color:#c084fc;">15 минут</strong>
                  </span>
                </div>

                <!-- Divider -->
                <div style="height:1px; background:linear-gradient(90deg,transparent,rgba(59,7,100,0.8),transparent); margin:28px 0;"></div>

                <!-- Security note -->
                <div style="
                  background: rgba(59,7,100,0.2);
                  border-left: 3px solid rgba(124,34,212,0.6);
                  border-radius: 0 10px 10px 0;
                  padding: 14px 18px;
                ">
                  <p style="font-size:13px; color:#7c3aed; margin:0; line-height:1.6;">
                    🔒 Если вы не создавали аккаунт на Mooni Services — просто проигнорируйте это письмо. 
                    Никогда не передавайте этот код третьим лицам.
                  </p>
                </div>
              </div>
            </td>
          </tr>

          <!-- Features reminder -->
          <tr>
            <td style="padding: 0 20px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="33%" style="text-align:center; padding:16px 10px;">
                    <div style="font-size:24px; margin-bottom:6px;">⚔️</div>
                    <div style="font-size:12px; color:#6d28d9; font-weight:600;">Прокачка</div>
                  </td>
                  <td width="33%" style="text-align:center; padding:16px 10px;">
                    <div style="font-size:24px; margin-bottom:6px;">💎</div>
                    <div style="font-size:12px; color:#6d28d9; font-weight:600;">Гемы</div>
                  </td>
                  <td width="33%" style="text-align:center; padding:16px 10px;">
                    <div style="font-size:24px; margin-bottom:6px;">🏰</div>
                    <div style="font-size:12px; color:#6d28d9; font-weight:600;">Альянс</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Stars decoration -->
          <tr>
            <td align="center" style="padding: 10px 0;">
              <span style="color:#3b0764; font-size:16px; letter-spacing:8px;">✦ ✦ ✦</span>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 20px 40px 40px;">
              <p style="font-size:12px; color:#3b0764; margin:0; line-height:1.8;">
                © ${new Date().getFullYear()} Mooni Services · Rise of Kingdoms<br/>
                <a href="https://discord.gg/mooni" style="color:#4c1d95; text-decoration:none;">Наш Discord сервер</a>
                &nbsp;·&nbsp;
                <span style="color:#3b0764;">mooni.services</span>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
