import {
  Resolver,
  Query,
  Mutation,
  Arg,
  UseMiddleware,
  FieldResolver,
  Root
} from 'type-graphql';
import { User } from '../data/entity/User';
import { JwtReponse } from '../shared/types/jwt-reponse.type';
import { AuthMiddleware } from '../shared/middlewares/auth.middleware';
import { Category } from '../data/entity/Category';
import { UserService } from '../services/user.service';
import { CategoryService } from '../services/category.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly categoryService: CategoryService
  ) {}

  // Queries

  @Query(() => [User])
  @UseMiddleware(AuthMiddleware(true))
  async users() {
    return await this.userService.getAll();
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(AuthMiddleware(true))
  async user(
    @Arg('userId', { nullable: false }) userId: string
  ): Promise<User | undefined> {
    return await this.userService.findById(userId);
  }

  // Mutations

  @Mutation(() => User)
  async registerUser(
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Arg('isAdmin') isAdmin: boolean,
    @Arg('imageId', { nullable: true }) imageId?: string
  ): Promise<User> {
    return await this.userService.register(
      firstName,
      lastName,
      email,
      password,
      isAdmin,
      imageId
    );
  }

  @Mutation(() => JwtReponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<JwtReponse> {
    return await this.userService.login(email, password);
  }

  // Fields Resolvers

  @FieldResolver(() => [Category])
  categories(@Root() user: User): Promise<Category[]> {
    return this.categoryService.find({ userId: user.userId });
  }
}
