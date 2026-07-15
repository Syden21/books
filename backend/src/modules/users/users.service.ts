import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';
import {
  IUserService,
  SearchUserParams,
} from './interfaces/user-service.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const saltRounds = this.configService.get<number>('BCRYPT_SALT_ROUNDS', 10);

    if (!data.passwordHash) {
      throw new ConflictException('Password is required');
    }

    const hashedPassword = await bcrypt.hash(
      data.passwordHash as string,
      saltRounds,
    );

    const userData: Partial<User> = {
      email: data.email,
      passwordHash: hashedPassword,
      name: data.name,
      contactPhone: data.contactPhone || undefined,
      role: data.role || UserRole.CLIENT,
    };

    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { _id: id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async findAll(params: SearchUserParams): Promise<User[]> {
    const { limit = 10, offset = 0, email, name, contactPhone } = params;

    const where: any = {};

    if (email) {
      where.email = Like(`%${email}%`);
    }
    if (name) {
      where.name = Like(`%${name}%`);
    }
    if (contactPhone) {
      where.contactPhone = Like(`%${contactPhone}%`);
    }

    return this.usersRepository.find({
      where,
      take: limit,
      skip: offset,
      order: { _id: 'ASC' },
    });
  }

  async validatePassword(email: string, password: string): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
