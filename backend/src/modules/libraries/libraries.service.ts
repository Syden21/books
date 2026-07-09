import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Library } from './entities/library.entity';
import { CreateLibraryDto } from './dto/create-library.dto';

@Injectable()
export class LibrariesService {
  constructor(
    @InjectRepository(Library)
    private librariesRepository: Repository<Library>,
  ) {}

  async create(data: CreateLibraryDto): Promise<Library> {
    const library = this.librariesRepository.create(data);
    return this.librariesRepository.save(library);
  }

  async findById(id: number): Promise<Library> {
    return this.librariesRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Library[]> {
    return this.librariesRepository.find();
  }
}
