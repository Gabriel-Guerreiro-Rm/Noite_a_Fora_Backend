import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientService } from 'src/client/client.service';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private clientService: ClientService,
    private jwtService: JwtService,
    private httpService: HttpService,
  ) {}

  private readonly SISTEMA3_URL = 'http://localhost:3002';

  async login(email: string, pass: string) {
    const client = await this.clientService.findByEmail(email);

    if (!client) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isMatch = await bcrypt.compare(pass, client.password);

    if (!isMatch) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const subscriptionStatus = await this.checkSubscription(client.id);

    if (subscriptionStatus.status !== 'ACTIVE') {
      const paywallPayload = {
        sub: client.id,
        email: client.email,
        status: subscriptionStatus.status,
      };
      return {
        access_token: await this.jwtService.signAsync(paywallPayload),
      };
    }

    const payload = { sub: client.id, email: client.email, status: 'ACTIVE' };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  private async checkSubscription(clientId: string): Promise<{ status: string }> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.SISTEMA3_URL}/subscription/status/${clientId}`),
      );
      return response.data;
    } catch (e) {
      console.error('Falha ao conectar com Sistema 3 (Paywall):', e.message);
      return { status: 'INACTIVE' };
    }
  }
}