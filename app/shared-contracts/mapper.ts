import { z } from 'zod';
import { endpoints } from './generated-api';

export const getEndpoint = (alias: string) => {
  const endpoint = endpoints.find((e: any) => e.alias === alias);
  if (!endpoint) throw new Error(`Endpoint ${alias} not found`);
  return endpoint as any;
};

export const mapToTsRest = (alias: string) => {
  const e = getEndpoint(alias);
  
  const tsRestEndpoint: any = {
    method: e.method.toUpperCase(),
    path: e.path.replace(/{/g, ':').replace(/}/g, ''),
    responses: {
      200: e.response,
      201: e.response,
      204: z.void(),
    },
  };

  // Map errors
  if (e.errors) {
    for (const err of e.errors) {
      tsRestEndpoint.responses[err.status] = err.schema;
    }
  }

  // Map parameters
  if (e.parameters) {
    const queryParams: any = {};
    const pathParams: any = {};
    
    for (const p of e.parameters) {
      if (p.type === 'Query') {
        queryParams[p.name] = p.schema;
      } else if (p.type === 'Path') {
        pathParams[p.name] = p.schema;
      } else if (p.type === 'Body') {
        tsRestEndpoint.body = p.schema;
      }
    }

    if (Object.keys(queryParams).length > 0) {
      tsRestEndpoint.query = z.object(queryParams);
    }
    if (Object.keys(pathParams).length > 0) {
      tsRestEndpoint.pathParams = z.object(pathParams);
    }
  }

  return tsRestEndpoint;
};
