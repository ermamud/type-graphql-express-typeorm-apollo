export interface BaseService<T> {
  getAll(): Promise<T[]>;
  findById(id: string): Promise<T | undefined>;
  find(where: any): Promise<T[]>;
}
