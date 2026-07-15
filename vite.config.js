import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import {
  sendContactEmail,
  validateContactPayload,
} from "./server/contactEmail.js";

function contactApiPlugin(env) {
  return {
    name: "contact-api",
    configureServer(server) {
      server.middlewares.use("/api/contact", async (req, res, next) => {
        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          res.end();
          return;
        }
        if (req.method !== "POST") {
          return next();
        }

        try {
          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          const raw = Buffer.concat(chunks).toString("utf8");
          const body = raw ? JSON.parse(raw) : {};

          const validated = validateContactPayload(body);
          if (!validated.ok) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ success: false, message: validated.error }));
            return;
          }

          const result = await sendContactEmail(validated.data, env);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ success: true, id: result.id }));
        } catch (error) {
          console.error("[vite /api/contact]", error);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              success: false,
              message: error.message || "Failed to send message",
            })
          );
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), contactApiPlugin(env)],
    base: "./",
  };
});
