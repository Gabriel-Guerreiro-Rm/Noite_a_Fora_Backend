import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrganizerDto } from './dto/create-organizer.dto';
import { UpdateOrganizerDto } from './dto/update-organizer.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OrganizerService {
  constructor(private prisma: PrismaService) {}

  async create(createOrganizerDto: CreateOrganizerDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createOrganizerDto.password, salt);

    return this.prisma.organizer.create({
      data: {
        email: createOrganizerDto.email,
        name: createOrganizerDto.name,
        password: hashedPassword,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.organizer.findUnique({
      where: { email },
    });
  }

  async findOne(id: string) {
    const organizer = await this.prisma.organizer.findUnique({
      where: { id },
    });
    if (!organizer) {
      throw new NotFoundException('Organizador não encontrado');
    }
    return organizer;
  }

  async update(id: string, updateOrganizerDto: UpdateOrganizerDto) {
    if (updateOrganizerDto.password) {
      const salt = await bcrypt.genSalt();
      updateOrganizerDto.password = await bcrypt.hash(
        updateOrganizerDto.password,
        salt,
      );
    }
    return this.prisma.organizer.update({
      where: { id },
      data: updateOrganizerDto,
    });
  }

  async remove(id: string) {
    await this.prisma.organizer.delete({
      where: { id },
    });
    return { message: 'Organizador excluído com sucesso' };
  }
}