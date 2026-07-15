/**
 * Map project TechStack labels to logo files in /public.
 * Falls back to null when no brand asset exists.
 */
const TECH_LOGO_MAP = {
  // Frontend
  HTML: "html.svg",
  HTML5: "html.svg",
  CSS: "css.svg",
  CSS3: "css.svg",
  JavaScript: "javascript.svg",
  Javascript: "javascript.svg",
  TypeScript: "typescript.svg",
  React: "reactjs.svg",
  ReactJS: "reactjs.svg",
  "Next.js": "nextjs.svg",
  "nuxt.js": "nuxt.svg",
  Tailwind: "tailwind.svg",
  "Tailwind CSS": "tailwind.svg",
  TailwindCSS: "tailwind.svg",
  Bootstrap: "bootstrap.svg",
  "Material UI": "MUI.svg",
  MUI: "MUI.svg",
  Vite: "vite.svg",
  "Radix UI": "radixui.svg",
  "shadcn/ui": "shadcnui.svg",
  "Shadcn/ui": "shadcnui.svg",
  "React Hook Form": "reacthookform.svg",
  "Framer Motion": "framer.svg",
  Framer: "framer.svg",
  "Lucide React": "lucide.svg",
  Lucide: "lucide.svg",
  "React Router": "reactrouter.svg",
  "TanStack Query": "reactquery.svg",
  "next-themes": "nextjs.svg",

  // Backend / data
  "Node.js": "nodejs.svg",
  "Express.js": "express.svg",
  Express: "express.svg",
  Supabase: "supabase.svg",
  Firebase: "firebase.svg",
  PostgreSQL: "postgresql.svg",
  GraphQL: "graphql.svg",
  MongoDB: "mongodb.svg",
  AWS: "aws.svg",
  "VB.NET": "vbnet.svg",

  // Blockchain
  Solidity: "solidity.svg",
  MetaMask: "metamask.svg",
  Ethereum: "ethereum.svg",
  Web3: "web3dotjs.svg",
  "Web3.js": "web3dotjs.svg",
  Blockchain: "ethereum.svg",
  QR: "qrcode.svg",
  "QR Code": "qrcode.svg",

  // Tools / platforms
  Vite: "vite.svg",
  Vercel: "vercel.svg",
  Figma: "figma.svg",
  Canva: "canva.svg",
  Storybook: "storybook.svg",
  "Github/Git": "github.svg",
  Github: "github.svg",
  GitHub: "github.svg",
  "VS Code": "vscode.svg",
  Cursor: "cursor.png",
  Windsurf: "windsurf.svg",
  Zod: "zod.svg",
  Wix: "wix.svg",
  SweetAlert2: "SweetAlert.svg",

  // CRM / automation / AI
  GoHighLevel: "gohighlevel.png",
  Zapier: "zapier.png",
  Make: "make.svg",
  Stripe: "stripe.png",
  Slack: "slack.png",
  Cloudflare: "cloudflare.png",
  Claude: "claude.png",
  ChatGPT: "chatgpt.svg",
  Lovable: "lovable.png",
  Bolt: "bolt.svg",

  // Agency / ops
  LeadConnector: "gohighlevel.png",
  Calendly: "calendly.svg",
  "Google Calendar": "googlecalendar.svg",
  GoDaddy: "godaddy.svg",
};

export function resolveTechLogo(tech) {
  if (!tech) return null;
  const direct = TECH_LOGO_MAP[tech];
  if (direct) return `/${direct}`;

  // Case-insensitive fallback
  const key = Object.keys(TECH_LOGO_MAP).find(
    (k) => k.toLowerCase() === String(tech).toLowerCase()
  );
  return key ? `/${TECH_LOGO_MAP[key]}` : null;
}

export default TECH_LOGO_MAP;
