import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(public service: AuthenticationService) { }

  canActivate(): boolean {
    return this.service.isAuthenticated();
  }

}
