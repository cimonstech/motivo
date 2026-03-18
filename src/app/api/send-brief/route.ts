import { Resend } from "resend";
import { escapeHtml, isValidEmail, sanitizeString } from "@/lib/security";

const resend = new Resend(process.env.RESEND_API_KEY);

const R2_BASE   = (process.env.NEXT_PUBLIC_R2_BASE_URL ?? "").replace(/\/+$/, "");
const LOGO_WHITE = R2_BASE ? `${R2_BASE}/email/logo-white.svg` : "https://thisismotivo.com/logo.svg";
const LOGO_DARK  = R2_BASE ? `${R2_BASE}/email/logo-dark.png` : "https://thisismotivo.com/logo-dark.svg";

const MAX_MESSAGES = 50;
const MAX_MESSAGE_LEN = 2000;
const MAX_SUMMARY_LEN = 2000;

interface BriefRequest {
  userEmail: string;
  messages:  { role: "user" | "assistant"; content: string }[];
  summary:   string;
}

export async function POST(req: Request) {
  if (!process.env.RESEND_API_KEY) {
    return Response.json(
      { success: false, error: "Service temporarily unavailable" },
      { status: 500 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const { userEmail, messages, summary }: BriefRequest = body;

  if (!isValidEmail(userEmail)) {
    return Response.json(
      { success: false, error: "Valid email required" },
      { status: 400 },
    );
  }

  if (!Array.isArray(messages) || messages.length > MAX_MESSAGES) {
    return Response.json(
      { success: false, error: "Invalid messages" },
      { status: 400 },
    );
  }

  const sanitizedMessages = messages
    .filter((m): m is { role: "user" | "assistant"; content: string } =>
      m && typeof m === "object" && (m.role === "user" || m.role === "assistant") && typeof m.content === "string"
    )
    .map((m) => ({ role: m.role, content: sanitizeString(m.content, MAX_MESSAGE_LEN) }));

  const sanitizedSummary = sanitizeString(summary, MAX_SUMMARY_LEN) || "Client project brief submitted via Motivo AI intake.";

  const transcript = sanitizedMessages
    .map((m) => `${m.role === "user" ? "Client" : "Motivo AI"}: ${m.content}`)
    .join("\n\n");

  const clientMessages = sanitizedMessages
    .filter((m) => m.role === "user")
    .map((m) => m.content);

  const safeEmail = escapeHtml(userEmail.trim());

  try {
    await Promise.all([
      resend.emails.send({
        from:    "Motivo Studio <hello@thisismotivo.com>",
        to:      [userEmail],
        subject: "Your project brief - Motivo Studio",
        html:    userEmailHtml(
          escapeHtml(sanitizedSummary),
          clientMessages.map((m) => escapeHtml(m)),
        ),
      }),
      resend.emails.send({
        from:    "Motivo Intake <hello@thisismotivo.com>",
        to:      ["motivodps@gmail.com"],
        replyTo: userEmail,
        subject: `New brief from ${userEmail}`,
        html:    motivoEmailHtml(
          safeEmail,
          escapeHtml(transcript),
          escapeHtml(sanitizedSummary),
        ),
      }),
    ]);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Resend error:", error);
    return Response.json({ success: false }, { status: 500 });
  }
}

// ── CLIENT EMAIL ─────────────────────────────────────────────────

function userEmailHtml(summary: string, clientMessages: string[]): string {
  const messageItems = clientMessages
    .map((m) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0f0ec;">
          <p style="margin:0; font-size:14px; color:#444; line-height:1.6; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
            ${m}
          </p>
        </td>
      </tr>
    `)
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your project brief - Motivo Studio</title>
</head>
<body style="margin:0;padding:0;background-color:#EFEFEA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#EFEFEA;padding:48px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" style="max-width:560px;width:100%;">

          <!-- ── HEADER ── -->
          <tr>
            <td style="background:#080808;border-radius:16px 16px 0 0;padding:32px 40px;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <img
                      src="${LOGO_WHITE}"
                      alt="Motivo Studio"
                      width="120"
                      style="display:block;height:auto;max-height:32px;object-fit:contain;"
                    />
                  </td>
                  <td align="right">
                    <span style="font-size:10px;color:rgba(245,245,240,0.35);letter-spacing:2px;text-transform:uppercase;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                      Project Brief
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── RED ACCENT BAR ── -->
          <tr>
            <td style="background:#ED1C24;height:3px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- ── HERO ── -->
          <tr>
            <td style="background:#ffffff;padding:40px 40px 32px;">
              <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#080808;letter-spacing:-0.5px;line-height:1.15;">
                Brief received.<br />We'll be in touch.
              </h1>
              <p style="margin:0;font-size:14px;color:rgba(8,8,8,0.5);line-height:1.6;">
                Thank you for reaching out to Motivo Studio. Here's a summary
                of what you shared with us.
              </p>
            </td>
          </tr>

          <!-- ── SUMMARY BOX ── -->
          <tr>
            <td style="background:#ffffff;padding:0 40px 32px;">
              <table width="100%" cellspacing="0" cellpadding="0"
                style="background:#EFEFEA;border-radius:10px;border-left:3px solid #ED1C24;overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 8px;font-size:10px;font-weight:600;color:rgba(8,8,8,0.4);text-transform:uppercase;letter-spacing:1.5px;">
                      Brief Summary
                    </p>
                    <p style="margin:0;font-size:14px;color:#080808;line-height:1.7;">
                      ${summary}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── DIVIDER ── -->
          <tr>
            <td style="background:#ffffff;padding:0 40px;">
              <div style="height:1px;background:#F0F0EC;font-size:0;line-height:0;">&nbsp;</div>
            </td>
          </tr>

          <!-- ── WHAT YOU SHARED ── -->
          <tr>
            <td style="background:#ffffff;padding:28px 40px 32px;">
              <p style="margin:0 0 16px;font-size:10px;font-weight:600;color:rgba(8,8,8,0.4);text-transform:uppercase;letter-spacing:1.5px;">
                What you told us
              </p>
              <table width="100%" cellspacing="0" cellpadding="0">
                ${messageItems}
              </table>
            </td>
          </tr>

          <!-- ── DIVIDER ── -->
          <tr>
            <td style="background:#ffffff;padding:0 40px;">
              <div style="height:1px;background:#F0F0EC;font-size:0;line-height:0;">&nbsp;</div>
            </td>
          </tr>

          <!-- ── NEXT STEPS ── -->
          <tr>
            <td style="background:#ffffff;padding:28px 40px 40px;border-radius:0 0 16px 16px;">
              <p style="margin:0 0 20px;font-size:14px;color:rgba(8,8,8,0.55);line-height:1.7;">
                Our team will review your brief and reach out within
                <strong style="color:#080808;font-weight:600;">24-48 hours</strong>.
                Prefer to speak sooner? WhatsApp us directly.
              </p>
              <table cellspacing="0" cellpadding="0">
                <tr>
                  <td style="border-radius:100px;background:#ED1C24;">
                    <a
                      href="https://wa.me/233549467175"
                      style="display:inline-block;padding:12px 28px;font-size:13px;font-weight:600;
                             color:#ffffff;text-decoration:none;letter-spacing:0.2px;
                             font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"
                    >
                      WhatsApp us directly →
                    </a>
                  </td>
                  <td width="12">&nbsp;</td>
                  <td style="border-radius:100px;border:1px solid rgba(8,8,8,0.15);">
                    <a
                      href="https://thisismotivo.com/work"
                      style="display:inline-block;padding:12px 28px;font-size:13px;font-weight:500;
                             color:#080808;text-decoration:none;letter-spacing:0.2px;
                             font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"
                    >
                      See our work
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="padding:24px 0;" align="center">
              <img
                src="${LOGO_DARK}"
                alt="Motivo"
                width="72"
                style="display:block;margin:0 auto 12px;height:auto;opacity:0.3;"
              />
              <p style="margin:0 0 4px;font-size:11px;color:rgba(8,8,8,0.35);line-height:1.6;">
                Motivo Studio · Accra, Ghana
              </p>
              <p style="margin:0;font-size:11px;line-height:1.6;">
                <a href="https://thisismotivo.com" style="color:#ED1C24;text-decoration:none;">
                  thisismotivo.com
                </a>
                &nbsp;·&nbsp;
                <a href="mailto:hello@thisismotivo.com" style="color:rgba(8,8,8,0.35);text-decoration:none;">
                  hello@thisismotivo.com
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`.trim();
}

// ── MOTIVO INTERNAL EMAIL ────────────────────────────────────────

function motivoEmailHtml(
  safeEmail:  string,
  transcript: string,
  summary:    string,
): string {
  const safeTranscript = transcript
    .replace(/&/g,  "&amp;")
    .replace(/</g,  "&lt;")
    .replace(/>/g,  "&gt;")
    .replace(/\n/g, "<br />");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New project brief</title>
</head>
<body style="margin:0;padding:0;background-color:#EFEFEA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#EFEFEA;padding:48px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" style="max-width:560px;width:100%;">

          <!-- ── HEADER ── -->
          <tr>
            <td style="background:#080808;border-radius:16px 16px 0 0;padding:28px 40px;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <img
                      src="${LOGO_WHITE}"
                      alt="Motivo Studio"
                      width="100"
                      style="display:block;height:auto;max-height:28px;object-fit:contain;"
                    />
                  </td>
                  <td align="right">
                    <span style="display:inline-block;background:#ED1C24;color:#ffffff;
                                 font-size:10px;font-weight:600;letter-spacing:1px;
                                 text-transform:uppercase;padding:4px 10px;border-radius:100px;
                                 font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                      New Brief
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── RED ACCENT BAR ── -->
          <tr>
            <td style="background:#ED1C24;height:3px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- ── FROM + REPLY CTA ── -->
          <tr>
            <td style="background:#ffffff;padding:32px 40px 28px;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;font-size:10px;font-weight:600;
                               color:rgba(8,8,8,0.4);text-transform:uppercase;letter-spacing:1.5px;">
                      From
                    </p>
                    <p style="margin:0;font-size:18px;font-weight:600;color:#080808;letter-spacing:-0.3px;">
                      ${safeEmail}
                    </p>
                  </td>
                  <td align="right" valign="middle">
                    <table cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="border-radius:100px;background:#ED1C24;">
                          <a
                            href="mailto:${safeEmail}"
                            style="display:inline-block;padding:10px 22px;font-size:12px;
                                   font-weight:600;color:#ffffff;text-decoration:none;
                                   font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"
                          >
                            Reply →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── DIVIDER ── -->
          <tr>
            <td style="background:#ffffff;padding:0 40px;">
              <div style="height:1px;background:#F0F0EC;">&nbsp;</div>
            </td>
          </tr>

          <!-- ── AI SUMMARY ── -->
          <tr>
            <td style="background:#ffffff;padding:28px 40px;">
              <p style="margin:0 0 12px;font-size:10px;font-weight:600;
                         color:rgba(8,8,8,0.4);text-transform:uppercase;letter-spacing:1.5px;">
                AI Summary
              </p>
              <table width="100%" cellspacing="0" cellpadding="0"
                style="background:#EFEFEA;border-radius:10px;border-left:3px solid #ED1C24;">
                <tr>
                  <td style="padding:18px 22px;">
                    <p style="margin:0;font-size:14px;color:#080808;line-height:1.7;">
                      ${summary}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── DIVIDER ── -->
          <tr>
            <td style="background:#ffffff;padding:0 40px;">
              <div style="height:1px;background:#F0F0EC;">&nbsp;</div>
            </td>
          </tr>

          <!-- ── FULL TRANSCRIPT ── -->
          <tr>
            <td style="background:#ffffff;padding:28px 40px 40px;border-radius:0 0 16px 16px;">
              <p style="margin:0 0 14px;font-size:10px;font-weight:600;
                         color:rgba(8,8,8,0.4);text-transform:uppercase;letter-spacing:1.5px;">
                Full Conversation
              </p>
              <table width="100%" cellspacing="0" cellpadding="0"
                style="background:#EFEFEA;border-radius:10px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0;font-size:12px;color:rgba(8,8,8,0.65);
                               line-height:1.9;font-family:monospace;white-space:pre-wrap;">
                      ${safeTranscript}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="padding:24px 0;" align="center">
              <p style="margin:0;font-size:11px;color:rgba(8,8,8,0.3);line-height:1.6;">
                Sent via Motivo Studio AI intake ·
                <a href="https://thisismotivo.com/contact"
                   style="color:rgba(8,8,8,0.3);text-decoration:underline;">
                  thisismotivo.com/contact
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`.trim();
}
