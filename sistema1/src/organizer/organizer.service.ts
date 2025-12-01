import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrganizerDto } from './dto/create-organizer.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrganizerService {
  constructor(private prisma: PrismaService) {}

  async create(createOrganizerDto: CreateOrganizerDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createOrganizerDto.password, salt);

    try {
      return await this.prisma.organizer.create({
        data: {
          ...createOrganizerDto,
          password: hashedPassword,
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(
          'Já existe um organizador cadastrado com esse e-mail.',
        );
      }
      throw e;
    }
  }

  async findAll() {
    return this.prisma.organizer.findMany();
  }

  async findOne(id: string) {
    return this.prisma.organizer.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.organizer.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateOrganizerDto: any) {
    return this.prisma.organizer.update({
      where: { id },
      data: updateOrganizerDto,
    });
  }

  async remove(id: string) {
    return this.prisma.organizer.delete({
      where: { id },
    });
  }
}