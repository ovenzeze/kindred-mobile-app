const fs = require('fs');
let content = fs.readFileSync('nuxt.config.ts', 'utf8');

const devOptions = "devOptions: {\n      enabled: true,\n      type: 'module',\n    },\n    manifest: {";

content = content.replace(/manifest:\s*\{/, devOptions);
fs.writeFileSync('nuxt.config.ts', content);
