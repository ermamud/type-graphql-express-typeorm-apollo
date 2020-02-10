import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { Category } from '../data/entity/Category';
import { BaseService } from './base.service';
import { Upload } from '../shared/interfaces/upload.interface';
import { User } from '../data/entity/User';
import { ImageService } from './image.service';

@Service()
export class CategoryService implements BaseService<Category> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly imageService: ImageService
  ) {}

  /**
   * Create new Category
   *
   * @async
   * @param  {string} name
   * @param  {string} imageId
   * @param  {string} userId
   * @returns Promise<Category>
   */
  async create(
    name: string,
    imageId: string,
    userId: string
  ): Promise<Category> {
    const category = new Category();
    category.name = name;
    category.imageId = imageId;
    category.userId = userId;

    return await this.categoryRepository.save(category);
  }
  /**
   * Process for creating new Image and Category
   *
   * @async
   * @param  {string} name
   * @param  {Upload} file
   * @param  {User} authUser
   * @returns Promise<Category | null>
   */
  async createCategoryWithImage(
    name: string,
    file: Upload,
    authUser: User
  ): Promise<Category | null> {
    var chunks: Buffer[] = [];

    return new Promise(async (resolve, reject) =>
      file
        .createReadStream()
        .on('data', data => {
          chunks.push(data);
        })
        .on('error', () => reject(null))
        .on('close', async () => {
          try {
            const base64 = Buffer.concat(chunks).toString('base64');

            // creating the image
            const image = await this.imageService.create(
              file.filename,
              file.mimetype,
              base64
            );

            // creating the category
            const category = await this.create(
              name,
              image.imageId,
              authUser.userId
            );

            resolve(category);
          } catch (e) {
            reject(null);
          }
        })
    );
  }

  /**
   * Get All Categories
   *
   * @async
   * @returns Promise
   */
  async getAll(): Promise<Category[]> {
    return this.categoryRepository.find() || [];
  }

  /**
   * Get Category by Id
   *
   * @async
   * @param  {string} id
   * @returns Promise<Category | undefined>
   */
  async findById(id: string): Promise<Category | undefined> {
    return await this.categoryRepository.findOne({ categoryId: id });
  }

  async find(where: any): Promise<Category[]> {
    return (await this.categoryRepository.find({ where, cache: 1000 })) || [];
  }
}
