import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OperationsService } from 'src/operations/operations.service';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private operationsService: OperationsService,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUserByEmail = await this.getByEmail(createUserDto.email);
    if (existingUserByEmail) {
      throw new BadRequestException('Email is taken');
    }

    const existingUserByUsername = await this.getByUsername(
      createUserDto.username,
    );
    if (existingUserByUsername) {
      throw new BadRequestException('Username is taken');
    }
    const user = new User();
    user.id = createUserDto.id;
    user.name = createUserDto.name;
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.passwordHash = createUserDto.passwordHash;
    user.active = createUserDto.active;

    const result = await this.usersRepository.save(user);
    return result;
  }

  public async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  public async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  public async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }

    const existingUserByEmail = await this.getByEmail(updateUserDto.email);
    if (existingUserByEmail && existingUserByEmail.id !== user.id) {
      throw new BadRequestException('Email is taken');
    }

    const existingUserByUsername = await this.getByUsername(
      updateUserDto.username,
    );
    if (existingUserByUsername && existingUserByUsername.id !== user.id) {
      throw new BadRequestException('Username is taken');
    }

    user.name = updateUserDto.name;
    user.username = updateUserDto.username;
    user.email = updateUserDto.email;
    user.passwordHash = updateUserDto.passwordHash;
    user.active = updateUserDto.active;

    return await this.usersRepository.update(id, user);
  }

  public async remove(id: string): Promise<void> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    await this.usersRepository.delete(user);
    return;
  }

  public async grant(id: string, operationId: string): Promise<User> {
    const operation = await this.operationsService.findOne(operationId);
    const user = await this.usersRepository.findOne(id, {
      relations: ['operations'],
    });

    if (user.operations.filter((o) => o.id === operationId).length > 0) {
      throw new BadRequestException(
        'User has already been granted access to this operation',
      );
    }

    user.operations.push(operation);
    return await this.usersRepository.save(user);
  }

  public async revoke(id: string, operationId: string): Promise<User> {
    const user = await this.usersRepository.findOne(id, {
      relations: ['operations'],
    });

    const prevLength = user.operations.length;
    user.operations = user.operations.filter((o) => o.id !== operationId);

    if (prevLength === user.operations.length) {
      throw new BadRequestException(
        'User does not have access to this operation',
      );
    }

    return await this.usersRepository.save(user);
  }

  public async getByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({ email });
  }

  public async getByUsername(username: string): Promise<User> {
    return await this.usersRepository.findOne({ username });
  }
}
