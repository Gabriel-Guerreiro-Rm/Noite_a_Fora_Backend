import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientModule } from 'src/client/client.module';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { ClientAuthGuard } from './guards/client-auth.guard';
import { SubscriptionGuard } from './guards/subscription.guard';

@Module({
  imports: [
    ClientModule,
    HttpModule,
    JwtModule.register({
      global: true,
      secret: 'OUTRO_SEGREDO_SUPER_SECRETO_PARA_TESTES',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ClientAuthGuard, SubscriptionGuard],
  exports: [ClientAuthGuard, SubscriptionGuard],
})
export class AuthModule {}