import { StoredUser } from './../types/storedUser.interface';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export class RolesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const loggedUser: StoredUser = context.switchToHttp().getRequest()?.user;
    if (!loggedUser) {
      return;
    }

    return !!loggedUser?.role;
  }
}
