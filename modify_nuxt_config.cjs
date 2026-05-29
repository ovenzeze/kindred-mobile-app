const fs = require('fs');
let content = fs.readFileSync('nuxt.config.ts', 'utf8');

const replacement = "head: {\n" +
"      title: 'Kindred',\n" +
"      viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',\n" +
"      meta: [\n" +
"        { name: 'theme-color', content: '#fff7ed' },\n" +
"        { name: 'apple-mobile-web-app-capable', content: 'yes' },\n" +
"        { name: 'apple-mobile-web-app-title', content: 'Kindred' },\n" +
"        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }\n" +
"      ],\n" +
"      link: [\n" +
"        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }\n" +
"      ]\n" +
"    }";

content = content.replace(/head:\s*\{[\s\S]*?meta:\s*\[[\s\S]*?\]\n\s*\}/, replacement);
fs.writeFileSync('nuxt.config.ts', content);
