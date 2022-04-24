import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { OperationsModule } from './operations/operations.module';
import { ModulesModule } from './modules/modules.module';
import { MovementTypesModule } from './movement-types/movement-types.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UsersModule,
    OperationsModule,
    ModulesModule,
    MovementTypesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
