import { AppDataSource } from '../config/data-source';
import { Item } from '../models/Item';
import { Repository } from 'typeorm';

export class ItemRepository {
  private repository: Repository<Item>;

  constructor() {
    this.repository = AppDataSource.getRepository(Item);
  }

  async findAllWithUser(): Promise<Item[]> {
    return this.repository.find({
      relations: ['user'],
      order: { id: 'ASC' }
    });
  }

  async findByIdWithUser(id: number): Promise<Item | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['user']
    });
  }

  async findById(id: number): Promise<Item | null> {
    return this.repository.findOneBy({ id });
  }

  async createAndSave(data: Partial<Item>): Promise<Item> {
    const item = this.repository.create(data);
    return this.repository.save(item);
  }

  async save(trip: Item): Promise<Item> {
    return this.repository.save(trip);
  }

  async removePost(item: Item): Promise<Item> {
    return this.repository.remove(item);
  }
}
