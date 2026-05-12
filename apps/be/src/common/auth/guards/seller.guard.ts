import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class SellerGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (user && user.isSeller) {
            return true;
        }

        throw new ForbiddenException('Access denied: Sellers only');
    }
}
