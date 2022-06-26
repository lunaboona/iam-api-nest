import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReceivableTitleMovementDto } from './dto/create-receivable-title-movement.dto';
import { ReceivableTitleMovement } from './entities/receivable-title-movement.entity';

@Injectable()
export class ReceivableTitleMovementsService {
  constructor(
    @InjectRepository(ReceivableTitleMovement)
    private receivableTitleMovementsRepository: Repository<ReceivableTitleMovement>,
  ) {}

  public async create(createReceivableTitleMovementDto: CreateReceivableTitleMovementDto): Promise<ReceivableTitleMovement> {
    let receivableTitleMovement = new ReceivableTitleMovement();
    receivableTitleMovement = { ...receivableTitleMovement, ...createReceivableTitleMovementDto };

    return await this.receivableTitleMovementsRepository.save(receivableTitleMovement);
  }

  public async findAll(): Promise<ReceivableTitleMovement[]> {
    return await this.receivableTitleMovementsRepository.find();
  }

  public async findOne(id: string): Promise<ReceivableTitleMovement> {
    return await this.receivableTitleMovementsRepository.findOne(id);
  }
}
