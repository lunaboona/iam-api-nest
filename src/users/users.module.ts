import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { OperationsModule } from 'src/operations/operations.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), OperationsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
