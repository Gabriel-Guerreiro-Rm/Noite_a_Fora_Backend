import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Request,
  Patch,
  Delete,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { ClientAuthGuard } from 'src/auth/guards/client-auth.guard';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('register')
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @UseGuards(ClientAuthGuard)
  @Get('me')
  findOne(@Request() req) {
    const clientId = req.user.sub;
    return this.clientService.findOne(clientId);
  }

  @UseGuards(ClientAuthGuard)
  @Patch('me')
  update(@Request() req, @Body() updateClientDto: UpdateClientDto) {
    const clientId = req.user.sub;
    return this.clientService.update(clientId, updateClientDto);
  }

  @UseGuards(ClientAuthGuard)
  @Delete('me')
  remove(@Request() req) {
    const clientId = req.user.sub;
    return this.clientService.remove(clientId);
  }
}