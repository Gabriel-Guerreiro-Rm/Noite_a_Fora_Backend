import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
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
}