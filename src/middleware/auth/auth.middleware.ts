// src/middleware/auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['auth-user'];

    if (!token || typeof token !== 'string') {
      return res.status(401).json({ message: 'Access refused : missing Token .' });
    }

    try {
      const decoded = verify(token, 'my_super_secret_key');
      const { userId } = decoded as { userId: number };

      if (!userId) {
        return res.status(401).json({ message: ' invalid Token : missing userId .' });
      }


      (req as any).user = { id: userId };
      next();
    } catch (err) {
      return res.status(401).json({ message: 'invalid or expired token.' });
    }
  }
}
