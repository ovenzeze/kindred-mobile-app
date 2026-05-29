const fs = require('fs');
let content = fs.readFileSync('app/app.vue', 'utf8');

content = content.replace('<template>', '<template>\n  <VitePwaManifest />');
fs.writeFileSync('app/app.vue', content);
