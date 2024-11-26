import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { repeat } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  registrationForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.maxLength(150)
    ]),
    userName: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100)
    ]),
    repeatedPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100)
    ])
  }, [repeatedPasswordValidator])

  onSubmit() {
    const formData = this.registrationForm.value;
    const userData = {
      userName: formData.userName!,
      email: formData.email!,
      password: formData.password!
    };
    this.userService.registerUser(userData).subscribe({
      next: _ => {
        console.log('Successfull registration.');
        this.router.navigate(['/login']);
      },
      error: console.error,
      complete: () => { }
    })
  }
}

const repeatedPasswordValidator = function(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value
  const repeatedPassword = control.get('repeatedPassword')?.value
  if (!password || !repeatedPassword) {
    return null;
  }
  if (password && repeatedPassword && password === repeatedPassword) {
    return null;
  }
  return { passwordsMatch: false } 
}
