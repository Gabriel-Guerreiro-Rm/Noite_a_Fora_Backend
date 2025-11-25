import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientService } from 'src/client/client.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private clientService: ClientService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pass: string) {
    const client = await this.clientService.findByEmail(email);

    if (!client) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isMatch = await bcrypt.compare(pass, client.password);

    if (!isMatch) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: client.id, email: client.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}   