import { Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    const token = req.headers['auth-user'];
    if (!token) {
      return res.status(401).json({ message: 'unauthorized access' });
    }

    try {
      const decoded = jwt.verify(token, 'my_super_secret_key');
      if (typeof decoded === 'string' || !('id' in decoded)) {
        return res.status(401).json({ message: 'unauthorized access' });
      }

      req.userId = decoded.id;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token error', error: err.message });
    }
  }
}
