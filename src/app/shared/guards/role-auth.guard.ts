import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';

export const roleauthGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const user = userService.getUser();
  if (!user) {
    return router.navigate(['login-form']).then(() => false);
  }

  const userRoles = userService.getUserRoles();
  if (!userRoles) {
    return router.navigate(['login-form']).then(() => false);
  }

  const requiredRoles = route.data['roles'] as string;

  if (userRoles.trim() === "truefalsefalse") {
    if (requiredRoles.trim() === "truefalsefalse") {
        return true;
    }
    if (requiredRoles.trim() === "truetruefalse" || requiredRoles.trim() === "truetruetrue") {
      router.navigate(['unauthorized']).then(() => false);
        return false;
    }
}

if (userRoles.trim() === "truetruefalse") {
    if (requiredRoles.trim() === "truefalsefalse" || requiredRoles.trim() === "truetruefalse") {
        return true;
    }
    if (requiredRoles.trim() === "truetruetrue") {
      router.navigate(['unauthorized']).then(() => false);
        return false;
    }
}

if (userRoles .trim()=== "truetruetrue") {
    return true;
}

router.navigate(['unauthorized']).then(() => false);
        return false;

};

