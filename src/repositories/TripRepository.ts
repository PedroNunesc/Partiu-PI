import { AppDataSource } from '../config/data-source';
import { Trip } from '../models/Trip';
import { Repository } from 'typeorm';

export class TripRepository {
  private repository: Repository<Trip>;

  constructor() {
    this.repository = AppDataSource.getRepository(Trip);
  }

  async findAllWithUser(): Promise<Trip[]> {
    return this.repository.find({
      relations: ['user'],
      order: { id: 'ASC' }
    });
  }

  async findByIdWithUser(id: number): Promise<Trip | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['user']
    });
  }

  async findById(id: number): Promise<Trip | null> {
    return this.repository.findOneBy({ id });
  }

  async createAndSave(data: Partial<Trip>): Promise<Trip> {
    const trip = this.repository.create(data);
    return this.repository.save(trip);
  }

  async save(trip: Trip): Promise<Trip> {
    return this.repository.save(trip);
  }

  async removePost(trip: Trip): Promise<Trip> {
    return this.repository.remove(trip);
  }
}