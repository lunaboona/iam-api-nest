import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { DocumentType } from './entities/document-type.entity';

@Injectable()
export class DocumentTypesService {
  constructor(
    @InjectRepository(DocumentType)
    private documentTypesRepository: Repository<DocumentType>,
  ) {}

  public async create(
    createDocumentTypeDto: CreateDocumentTypeDto,
  ): Promise<DocumentType> {
    let documentType = new DocumentType();
    documentType = { ...documentType, ...createDocumentTypeDto, active: true };

    return await this.documentTypesRepository.save(documentType);
  }

  public async findAll(): Promise<DocumentType[]> {
    return await this.documentTypesRepository.find();
  }

  public async findOne(id: string): Promise<DocumentType> {
    return await this.documentTypesRepository.findOne(id);
  }

  public async setAsActive(id: string): Promise<DocumentType> {
    return this.setActiveState(id, true);
  }

  public async setAsInactive(id: string): Promise<DocumentType> {
    return this.setActiveState(id, false);
  }

  private async setActiveState(
    id: string,
    state: boolean,
  ): Promise<DocumentType> {
    const documentType = await this.documentTypesRepository.findOne(id);
    if (!documentType) {
      throw new NotFoundException();
    }

    documentType.active = state;

    return await this.documentTypesRepository.save(documentType);
  }
}
