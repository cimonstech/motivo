import { Resend } from "resend";
import { escapeHtml, isValidEmail } from "@/lib/security";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!isValidEmail(email)) {
    return Response.json({ success: false }, { status: 400 });
  }

  const safeEmail = escapeHtml(email.trim());

  try {
    await resend.emails.send({
      from:    "Motivo Intake <hello@thisismotivo.com>",
      to:      ["motivodps@gmail.com"],
      subject: `New lead: ${email}`,
      html: `
        <div style="font-family:-apple-system,sans-serif;padding:32px;background:#F5F5F0;min-height:100vh;">
          <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid rgba(8,8,8,0.08);">

            <!-- Header -->
            <div style="background:#080808;padding:24px 32px;">
              <div style="font-size:18px;font-weight:700;color:#F5F5F0;letter-spacing:-0.3px;">
                MOTIVO
              </div>
              <div style="font-size:10px;color:rgba(245,245,240,0.35);letter-spacing:2px;margin-top:2px;text-transform:uppercase;">
                New Lead Captured
              </div>
            </div>

            <!-- Red bar -->
            <div style="height:3px;background:#ED1C24;"></div>

            <!-- Body -->
            <div style="padding:28px 32px;">
              <p style="margin:0 0 6px;font-size:10px;font-weight:600;color:rgba(8,8,8,0.4);
                         text-transform:uppercase;letter-spacing:1.5px;">
                Email Address
              </p>
              <p style="margin:0 0 24px;font-size:20px;font-weight:600;color:#080808;letter-spacing:-0.3px;">
                ${safeEmail}
              </p>

              <p style="margin:0 0 20px;font-size:13px;color:rgba(8,8,8,0.5);line-height:1.6;">
                This person started a conversation on the Motivo contact page
                and provided their email address. They may or may not have
                proceeded to WhatsApp.
              </p>

              <!-- Reply button -->
              <table cellspacing="0" cellpadding="0">
                <tr>
                  <td style="border-radius:100px;background:#ED1C24;">
                    <a href="mailto:${safeEmail}"
                      style="display:inline-block;padding:10px 24px;font-size:13px;
                             font-weight:600;color:#ffffff;text-decoration:none;">
                      Email them →
                    </a>
                  </td>
                  <td width="10"></td>
                  <td style="border-radius:100px;border:1px solid rgba(8,8,8,0.15);">
                    <a href="https://wa.me/233549467175"
                      style="display:inline-block;padding:10px 24px;font-size:13px;
                             font-weight:500;color:#080808;text-decoration:none;">
                      Open WhatsApp
                    </a>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Footer -->
            <div style="padding:16px 32px;border-top:1px solid rgba(8,8,8,0.06);text-align:center;">
              <p style="margin:0;font-size:11px;color:rgba(8,8,8,0.3);">
                Motivo Studio · thisismotivo.com/contact
              </p>
            </div>

          </div>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Notify email error:", error);
    return Response.json({ success: false }, { status: 500 });
  }
}

