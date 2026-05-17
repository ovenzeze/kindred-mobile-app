import fs from 'node:fs';
import path from 'node:path';

const openapi = JSON.parse(fs.readFileSync('openapi.json', 'utf8'));

const tags = openapi.tags || [];
const tagMap = new Map();

for (const tag of tags) {
  tagMap.set(tag.name, []);
}

for (const [pathUrl, methods] of Object.entries(openapi.paths)) {
  for (const [method, op] of Object.entries(methods as any)) {
    const tag = op.tags?.[0] || 'default';
    if (!tagMap.has(tag)) tagMap.set(tag, []);
    tagMap.get(tag).push({ pathUrl, method, op });
  }
}

const outputDir = 'app/shared-contracts';
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const indexImports = [];
const indexContracts = [];

for (const [tag, items] of tagMap.entries()) {
  let code = "import { initContract } from '@ts-rest/core';\nimport { z } from 'zod';\n\nconst c = initContract();\n\n";
  code += `export const ${tag}Contract = c.router({\n`;

  for (const { pathUrl, method, op } of items) {
    const operationId = op.operationId || `${tag}_${method}_${pathUrl.replace(/\\//g, '_')}`;
    const name = operationId.includes('.') ? operationId.split('.')[1] : operationId;

    code += `  ${name}: {\n`;
    code += `    method: '${method.toUpperCase()}',\n`;
    code += `    path: '${pathUrl.replace(/{/g, ':').replace(/}/g, '')}',\n`;

    // Handle parameters (query, path)
    const queryParams = (op.parameters || []).filter((p: any) => p.in === 'query');
    if (queryParams.length > 0) {
      code += `    query: z.object({\n`;
      for (const p of queryParams) {
        code += `      ${p.name}: z.any().optional(), // ${p.description || ''}\n`;
      }
      code += `    }),\n`;
    }

    const pathParams = (op.parameters || []).filter((p: any) => p.in === 'path');
    if (pathParams.length > 0) {
       // ts-rest handles path params in the path string usually, but we can define them
    }

    // Handle requestBody
    if (op.requestBody) {
      code += `    body: z.any(),\n`;
    }

    // Handle responses
    code += `    responses: {\n`;
    for (const [status, resp] of Object.entries(op.responses as any)) {
      if (status === 'default') continue;
      code += `      ${status}: z.any(),\n`;
    }
    code += `    },\n`;

    code += `    summary: '${(op.summary || op.description || '').replace(/'/g, "\\'")}',\n`;
    code += `  },\n`;
  }

  code += "});\n";

  fs.writeFileSync(path.join(outputDir, `${tag}.ts`), code);
  indexImports.push(`import { ${tag}Contract } from './${tag}';`);
  indexContracts.push(`  ${tag}: ${tag}Contract,`);
}

let indexCode = "import { initContract } from '@ts-rest/core';\n";
indexCode += indexImports.join('\n') + "\n\n";
indexCode += "const c = initContract();\n\n";
indexCode += "export const appContract = c.router({\n";
indexCode += indexContracts.join('\n') + "\n";
indexCode += "});\n\n";
indexCode += "export type AppContract = typeof appContract;\n";

fs.writeFileSync(path.join(outputDir, 'index.ts'), indexCode);

console.log('✅ Generated ts-rest contracts from OpenAPI');
