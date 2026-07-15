/**
 * Shared Resend contact-email sender (used by Vercel /api and Vite dev middleware).
 * Free tier: https://resend.com — 3,000 emails/month, 100/day.
 *
 * Without a verified domain, Resend only delivers to your account email
 * and you must use: from = "… <onboarding@resend.dev>"
 */

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function validateContactPayload(body = {}) {
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const message = String(body.message || "").trim();

  if (!name || name.length > 120) {
    return { ok: false, error: "Please enter a valid name." };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (!message || message.length > 5000) {
    return { ok: false, error: "Please enter a message (max 5000 characters)." };
  }
  // Honeypot
  if (body.honey) {
    return { ok: false, error: "Spam detected." };
  }

  return { ok: true, data: { name, email, message } };
}

export async function sendContactEmail({ name, email, message }, env = process.env) {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing RESEND_API_KEY. Add it to .env locally and to Vercel project env vars."
    );
  }

  const to = env.CONTACT_TO_EMAIL || "abejayofracio@gmail.com";
  const from =
    env.RESEND_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `Portfolio contact from ${name}`,
      html: `
        <div style="font-family:ui-sans-serif,system-ui,sans-serif;line-height:1.5;color:#111">
          <h2 style="margin:0 0 12px">New portfolio message</h2>
          <p style="margin:0 0 8px"><strong>Name:</strong> ${safeName}</p>
          <p style="margin:0 0 8px"><strong>Email:</strong> ${safeEmail}</p>
          <p style="margin:16px 0 8px"><strong>Message:</strong></p>
          <div style="padding:12px 14px;background:#f4f4f5;border-radius:8px">${safeMessage}</div>
        </div>
      `,
      text: `New portfolio message\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail =
      data?.message ||
      data?.error?.message ||
      (typeof data?.error === "string" ? data.error : null) ||
      `Resend error (${response.status})`;
    throw new Error(detail);
  }

  return data;
}
