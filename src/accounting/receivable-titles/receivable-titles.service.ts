import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReceivableTitleDto } from './dto/create-receivable-title.dto';
import { UpdateReceivableTitleDto } from './dto/update-payment-title.dto';
import { ReceivableTitle } from './entities/receivable-title.entity';

@Injectable()
export class ReceivableTitlesService {
  constructor(
    @InjectRepository(ReceivableTitle)
    private receivableTitlesRepository: Repository<ReceivableTitle>,
  ) {}

  public async create(createReceivableTitleDto: CreateReceivableTitleDto): Promise<ReceivableTitle> {
    let receivableTitle = new ReceivableTitle();
    receivableTitle = { ...receivableTitle, ...createReceivableTitleDto };

    return await this.receivableTitlesRepository.save(receivableTitle);
  }

  public async findAll(): Promise<ReceivableTitle[]> {
    return await this.receivableTitlesRepository.find();
  }

  public async findOne(id: string): Promise<ReceivableTitle> {
    if (!id) {
      throw new NotFoundException();
    }
    return await this.receivableTitlesRepository.findOne(id);
  }

  public async update(id: string, dto: UpdateReceivableTitleDto): Promise<ReceivableTitle> {
    let receivableTitle = await this.receivableTitlesRepository.findOne(id);
    if (!receivableTitle) {
      throw new NotFoundException();
    }

    receivableTitle = {
      ...receivableTitle,
      ...dto
    };

    return await this.receivableTitlesRepository.save(receivableTitle);
  }
}
