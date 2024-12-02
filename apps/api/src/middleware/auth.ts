import { expressjwt } from 'express-jwt';
import { Request } from 'express';
import { verifyAccessToken } from '@monorepo/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const requireAuth = expressjwt({
  secret: JWT_SECRET,
  algorithms: ['HS256'],
  getToken: function fromHeaderOrCookie(req: Request) {
    if (req.headers.authorization?.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    return req.cookies?.accessToken;
  }
});