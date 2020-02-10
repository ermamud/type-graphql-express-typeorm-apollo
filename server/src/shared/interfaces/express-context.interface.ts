import { Request, Response } from 'express';
import { User } from '../../data/entity/User';

export interface IExpressContext {
  req: Request;
  res: Response;
  authUser: User;
}
