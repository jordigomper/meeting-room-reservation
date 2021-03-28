import { Request } from 'express';

export function extractArray(req: Request): string[] {
  return req.query.usersID
    ? req.query.usersID.toString().split(',')
    : [];
}
