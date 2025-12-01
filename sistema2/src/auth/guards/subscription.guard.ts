import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.status !== 'ACTIVE') {
      throw new ForbiddenException('Assinatura inativa. Pague o plano para continuar.');
    }

    return true;
  }
}