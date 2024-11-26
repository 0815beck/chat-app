import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { ChatService } from '../services/chat.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private chatService: ChatService,
    private router: Router
  ) {}

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required
    ])
  });

  onSubmit() {
    const loginData = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    }
    this.userService.loginUser(loginData).subscribe({
      next: response => {
        const { id, userName, email, token } = response;
        this.authService.setActiveUser({ id, userName, email });
        this.authService.setToken(token);
        this.authService.setLoggedIn(true);
        //the next two will happen asynchronously
        this.chatService.fetchChats();
        this.chatService.connectAndConfigureSocket();
        console.log('Successfully logged in!');
        this.router.navigate(['/chats/overview'])
      },
      error: error => {
        console.error(error);
        return;
      },
      complete: () => {}
    })
  }

}
