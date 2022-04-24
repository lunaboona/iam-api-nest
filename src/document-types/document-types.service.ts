import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';
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
    const documentType = new DocumentType();
    documentType.name = createDocumentTypeDto.name;
    documentType.mask = createDocumentTypeDto.mask;

    return await this.documentTypesRepository.save(documentType);
  }

  public async findAll(): Promise<DocumentType[]> {
    return await this.documentTypesRepository.find();
  }

  public async findOne(id: string): Promise<DocumentType> {
    return await this.documentTypesRepository.findOne(id);
  }

  public async update(
    id: string,
    updateDocumentTypeDto: UpdateDocumentTypeDto,
  ): Promise<UpdateResult> {
    const documentType = await this.documentTypesRepository.findOne(id);
    if (!documentType) {
      throw new NotFoundException();
    }

    documentType.name = updateDocumentTypeDto.name;
    documentType.mask = updateDocumentTypeDto.mask;

    return await this.documentTypesRepository.update(id, documentType);
  }

  public async remove(id: string): Promise<void> {
    const documentType = await this.documentTypesRepository.findOne(id);
    if (!documentType) {
      throw new NotFoundException();
    }
    await this.documentTypesRepository.delete(documentType);
    return;
  }
}
