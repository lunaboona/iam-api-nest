import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto);
  }

  @Post('default')
  createDefaultAccounts() {
    return this.accountsService.createDefaultAccounts();
  }

  @Get()
  findAll() {
    return this.accountsService.findAll();
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.accountsService.findOne(code);
  }
}
