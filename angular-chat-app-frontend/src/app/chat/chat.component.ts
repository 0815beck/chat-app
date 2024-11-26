import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatMessage } from '../model/ChatMessage';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';
import { Chat } from '../model/Chat';
import { UserService } from '../services/user.service';
import { User } from '../model/User';
import { Observable } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.messages$ = chatService.messages$;
    this.activeChat$ = chatService.activeChat$;
    this.chatId = route.snapshot.paramMap.get('id')!;
  }

  newMessage = new FormControl('', [
    Validators.required,
    Validators.maxLength(1000)
  ]);

  activeChat$: Observable<Chat | undefined>; 
  messages$: Observable<ChatMessage[] | undefined>;
  chatId: string;

  getAuthorName(authorId: string) {
    this.chatService.getAuthorName(authorId);
  }

  getActiveUserId() {
    const user = this.authService.getActiveUser();
    return user?.id;
  }

  ngOnInit() {
    if (!this.authService.loggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.chatService.connectToChatRoom(this.chatId);
  }

  sendMessage() {
    const message: ChatMessage = {
      time: new Date(),
      userId: this.authService.getActiveUser()?.id!,
      chatId: this.chatId,
      content: this.newMessage.value!
    };
    this.chatService.postChatMessage(message);
    this.newMessage.setValue('');
  }


  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = 
        this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll failed:', err);
    }
  }
}