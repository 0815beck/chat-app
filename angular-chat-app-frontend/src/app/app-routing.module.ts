import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ChatComponent } from './chat/chat.component';
import { ChatOverviewComponent } from './chat-overview/chat-overview.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent },
  {path: 'chats/overview', component: ChatOverviewComponent},
  {path: 'chats/:id', component: ChatComponent},
  {path: '**', redirectTo: 'chats/overview'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
