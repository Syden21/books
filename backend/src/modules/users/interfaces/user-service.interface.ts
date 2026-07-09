import { User } from '../entities/user.entity';

export interface SearchUserParams {
  limit?: number;
  offset?: number;
  email?: string;
  name?: string;
  contactPhone?: string;
}

export interface IUserService {
  create(data: Partial<User>): Promise<User>;
  findById(id: number): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findAll(params: SearchUserParams): Promise<User[]>;
}
