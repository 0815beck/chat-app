import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from '../services/user.service';
import { ChatService } from '../services/chat.service';

@Pipe({
  name: 'authorName'
})
export class AuthorNamePipe implements PipeTransform {
  constructor(private chatService: ChatService) {}

  transform(userId: string): string {
    return this.chatService.getAuthorName(userId)!;
  }
}
