import { Component } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { Chat } from '../model/Chat';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat-overview',
  templateUrl: './chat-overview.component.html',
  styleUrl: './chat-overview.component.css'
})
export class ChatOverviewComponent {

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private router: Router
  ) {
    this.chats$ = chatService.chats$;

  }

  chats$: Observable<Chat[] | undefined>;

  ngOnInit() {
    if (!this.authService.loggedIn()) {
      this.router.navigate(['/login'])
      return;
    }
  }
}
