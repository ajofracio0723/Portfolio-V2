import { sendContactEmail, validateContactPayload } from "../server/contactEmail.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const validated = validateContactPayload(req.body || {});
    if (!validated.ok) {
      return res.status(400).json({ success: false, message: validated.error });
    }

    const result = await sendContactEmail(validated.data, process.env);
    return res.status(200).json({ success: true, id: result.id });
  } catch (error) {
    console.error("[api/contact]", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send message",
    });
  }
}
