const fs = require('fs');
let content = fs.readFileSync('nuxt.config.ts', 'utf8');

const replacement = "link: [\n" +
"        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },\n" +
"        { rel: 'manifest', href: '/manifest.webmanifest' }\n" +
"      ]";

content = content.replace(/link:\s*\[[\s\S]*?\]/, replacement);
fs.writeFileSync('nuxt.config.ts', content);
