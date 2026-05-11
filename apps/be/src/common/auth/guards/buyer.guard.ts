import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class BuyerGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (user && user.isBuyer) {
            return true;
        }

        throw new ForbiddenException('Access denied: Buyers only');
    }
}
