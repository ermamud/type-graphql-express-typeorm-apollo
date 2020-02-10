import { MiddlewareFn } from 'type-graphql';
import { IExpressContext } from '../interfaces/express-context.interface';
import fs from 'fs';
import { verify } from 'jsonwebtoken';
import { Container } from 'typedi';
import { UserService } from '../../services/user.service';

export function AuthMiddleware(
  onlyAdmin?: boolean
): MiddlewareFn<IExpressContext> {
  return async ({ context }, next) => {
    const authHeader = context.req.headers['authorization'] || '';
    const authParts = authHeader.split(' ');

    if (authParts.length !== 2) {
      throw new Error('Authorization token not valid.');
    }

    try {
      const token = authParts[1];
      const publicKey = fs.readFileSync('./assets/jwtRS256.key.pub', 'utf8');

      const payload = verify(token, publicKey, { algorithms: ['RS256'] }) as {
        userId: string;
      };

      if (!payload.userId) {
        throw new Error('Authorization token not valid.');
      }

      // inject ser service manually
      const userService = Container.get(UserService);
      const user = await userService.findById(payload.userId);
      if (!user) {
        throw new Error('Authorization token not valid.');
      }

      if (onlyAdmin && !user.isAdmin) {
        throw new Error('User does not have access to the requested resource.');
      }

      context.authUser = user;
    } catch (error) {
      console.log(error);

      throw new Error(error.message);
    }

    return next();
  };
}
