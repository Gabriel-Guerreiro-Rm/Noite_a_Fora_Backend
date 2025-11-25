import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientModule } from 'src/client/client.module';
import { JwtModule } from '@nestjs/jwt';
import { ClientAuthGuard } from './guards/client-auth.guard';

@Module({
  imports: [
    ClientModule,
    JwtModule.register({
      global: true,
      secret: 'OUTRO_SEGREDO_SUPER_SECRETO_PARA_TESTES',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ClientAuthGuard],
  exports: [ClientAuthGuard],
})
export class AuthModule {}