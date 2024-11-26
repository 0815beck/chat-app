import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  loggedIn$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.loggedIn$ = authService.loggedIn$;
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }
}
