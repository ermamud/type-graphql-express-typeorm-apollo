import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import fs from 'fs';
import moment from 'moment';
import validator from 'validator';
import crypto from 'crypto';
import { sign } from 'jsonwebtoken';
import { JwtReponse } from '../shared/types/jwt-reponse.type';
import { User } from '../data/entity/User';
import { BaseService } from './base.service';

@Service()
export class UserService implements BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  /**
   * Register new User
   *
   * @async
   * @param  {string} firstName
   * @param  {string} lastName
   * @param  {string} email
   * @param  {string} password
   * @param  {boolean} isAdmin
   * @param  {string} imageId?
   * @returns Promise<User>
   */
  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    isAdmin: boolean,
    imageId?: string
  ): Promise<User> {
    // email validation
    if (!validator.isEmail(email)) {
      throw new Error('Invalid Email.');
    }

    // email duplicate validation
    const existUser = await this.userRepository.count({ email });
    if (existUser >= 1) {
      throw new Error('Email already exists for another user.');
    }

    try {
      const user = new User();
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.isAdmin = isAdmin;
      if (!!imageId) {
        user.imageId = imageId;
      }
      // creating the salt for the password
      user.passwordSalt = crypto.randomBytes(16).toString('hex');
      user.passswordHash = crypto
        .pbkdf2Sync(password, user.passwordSalt, 1000, 64, 'sha512')
        .toString('hex');

      return await this.userRepository.save(user);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * Login user
   *
   * @async
   * @param  {string} email
   * @param  {string} password
   * @returns Promise<JwtReponse>
   */
  async login(email: string, password: string): Promise<JwtReponse> {
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      throw new Error('User and password combination does not exists.');
    }

    // compare passwords
    const newHash = crypto
      .pbkdf2Sync(password, user.passwordSalt, 1000, 64, 'sha512')
      .toString('hex');

    if (newHash !== user.passswordHash) {
      throw new Error('User and password combination does not exists.');
    }

    const privateKey = fs.readFileSync('./assets/jwtRS256.key', 'utf8');

    return {
      accessToken: sign({ userId: user.userId }, privateKey, {
        expiresIn: '1h',
        algorithm: 'RS256'
      }),
      expiresIn: moment()
        .add(1, 'hour')
        .toDate()
    };
  }

  async getAll(): Promise<User[]> {
    return (await this.userRepository.find()) || [];
  }

  async findById(id: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ userId: id });
  }

  async find(where: any): Promise<User[]> {
    return (await this.userRepository.find({ where, cache: 1000 })) || [];
  }
}
