import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { Image } from '../data/entity/Image';
import { BaseService } from './base.service';

@Service()
export class ImageService implements BaseService<Image> {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>
  ) {}

  /**
   * Create new Image
   *
   * @async
   * @param  {string} fileName
   * @param  {string} mimeType
   * @param  {string} content
   * @returns Promise<Image>
   */
  async create(
    fileName: string,
    mimeType: string,
    content: string
  ): Promise<Image> {
    const image = new Image();
    image.name = fileName;
    image.mimeType = mimeType;
    image.image = content;

    return await this.imageRepository.save(image);
  }

  async getAll(): Promise<Image[]> {
    return (await this.imageRepository.find()) || [];
  }

  async findById(id: string): Promise<Image | undefined> {
    return await this.imageRepository.findOne({ imageId: id });
  }

  async find(where: any): Promise<Image[]> {
    return (await this.imageRepository.find({ where, cache: 1000 })) || [];
  }
}
