import {
  Resolver,
  Query,
  Arg,
  Mutation,
  UseMiddleware,
  Ctx,
  FieldResolver,
  Root
} from 'type-graphql';
import { Category } from '../data/entity/Category';
import { AuthMiddleware } from '../shared/middlewares/auth.middleware';
import { ObjectUploadScalar } from '../shared/scalars/upload.scalar';
import { Upload } from '../shared/interfaces/upload.interface';
import { IExpressContext } from '../shared/interfaces/express-context.interface';
import { CategoryService } from '../services/category.service';
import { UserService } from '../services/user.service';
import { User } from '../data/entity/User';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly userService: UserService
  ) {}

  // Queries

  @Query(() => [Category])
  @UseMiddleware(AuthMiddleware())
  async categories(): Promise<Category[]> {
    return this.categoryService.getAll();
  }

  @Query(() => Category, { nullable: true })
  @UseMiddleware(AuthMiddleware())
  async category(
    @Arg('categoryId', { nullable: false }) categoryId: string
  ): Promise<Category | undefined> {
    return await this.categoryService.findById(categoryId);
  }

  // Mutations

  @Mutation(() => Category, { nullable: true })
  @UseMiddleware(AuthMiddleware())
  async createCategory(
    @Arg('name') name: string,
    @Arg('file', () => ObjectUploadScalar) file: Upload,
    @Ctx() context: IExpressContext
  ): Promise<Category | null> {
    return await this.categoryService.createCategoryWithImage(
      name,
      file,
      context.authUser
    );
  }

  // Field Resolvers

  @FieldResolver(() => User, { nullable: true })
  createdBy(@Root() category: Category): Promise<User | undefined> {
    return this.userService.findById(category.userId);
  }
}
