import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { CreateReceivableTitleDto } from './dto/create-receivable-title.dto';
import { UpdateReceivableTitleDto } from './dto/update-payment-title.dto';
import { ReceivableTitle } from './entities/receivable-title.entity';

@Injectable()
export class ReceivableTitlesService {
  constructor(
    @InjectRepository(ReceivableTitle)
    private receivableTitlesRepository: Repository<ReceivableTitle>,
  ) {}

  public async create(
    dto: CreateReceivableTitleDto,
    queryRunner: QueryRunner = null
  ): Promise<ReceivableTitle> {
    const receivableTitle = new ReceivableTitle();
    receivableTitle.fillFields(dto);

    return await queryRunner.manager.save(receivableTitle);
  }

  public async findAll(): Promise<ReceivableTitle[]> {
    return await this.receivableTitlesRepository.find();
  }

  public async findOne(id: string): Promise<ReceivableTitle> {
    if (!id) {
      throw new NotFoundException('Receivable title does not exist');
    }
    return await this.receivableTitlesRepository.findOne(id);
  }

  public async update(id: string, dto: UpdateReceivableTitleDto): Promise<ReceivableTitle> {
    let receivableTitle = await this.receivableTitlesRepository.findOne(id);
    if (!receivableTitle) {
      throw new NotFoundException('Receivable title does not exist');
    }

    receivableTitle.openValue = dto.openValue;
    receivableTitle.status = dto.status;

    return await this.receivableTitlesRepository.save(receivableTitle);
  }
}
