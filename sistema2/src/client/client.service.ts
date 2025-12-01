import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async create(createClientDto: CreateClientDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createClientDto.password, salt);

    return this.prisma.client.create({
      data: {
        email: createClientDto.email,
        name: createClientDto.name,
        password: hashedPassword,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.client.findUnique({
      where: { email },
    });
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });
    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }
    return client;
  }

  async findAll() {
    return this.prisma.client.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    if (updateClientDto.password) {
      const salt = await bcrypt.genSalt();
      updateClientDto.password = await bcrypt.hash(
        updateClientDto.password,
        salt,
      );
    }
    return this.prisma.client.update({
      where: { id },
      data: updateClientDto,
    });
  }

  async remove(id: string) {
    await this.prisma.client.delete({
      where: { id },
    });
    return { message: 'Cliente excluído com sucesso' };
  }
}