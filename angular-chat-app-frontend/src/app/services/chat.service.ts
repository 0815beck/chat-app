import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { AuthService } from './auth.service';
import { Chat } from '../model/Chat';
import { ChatMessage } from '../model/ChatMessage';
import { BehaviorSubject, connect, firstValueFrom, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { env } from '../../environments/environment';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) { }

  private _chats = new BehaviorSubject<Chat[] | undefined>(undefined);
  private _activeChat = new BehaviorSubject<Chat | undefined>(undefined);
  private _messages = new BehaviorSubject<ChatMessage[] | undefined>(undefined);
  private socket: Socket | undefined;

  public chats$ = this._chats.asObservable();
  public activeChat$ = this._activeChat.asObservable();
  public messages$ = this._messages.asObservable();

  fetchChats() {
    this.httpClient.get<Chat[]>(`${env.baseUrl}/api/chats`, {
      headers: this.authService.getAuthHeader()
    }).subscribe(chats =>  this._chats.next(chats));
  }

  chatsLoaded() {
    return this._chats.getValue() !== undefined;
  }

  connectAndConfigureSocket() {
    console.log('[Debug] Attempting socket connection', this.socket);

    this.socket = io(env.baseUrl, {
      auth: {token: this.authService.getToken()}
    });

    this.socket.on('joined', (messages) => {
      console.log('[Debug] Event joined was triggered.');
      console.log('[Debug] Event joined payload: ', messages);
      this._messages.next(messages);
    });

    this.socket.on('new message', (message) => {
      console.log('[Info] new message was triggered and a new message arrived. you can see it below.');
      console.log(message);
      this._messages.next(this._messages.getValue()?.concat(message))
    });

    this.socket.on('connect', () => {
      console.log('[Info] Socket connected: ', this.socket);
    });

    console.log('[Debug] Trying to connect socket: ', this.socket);
  }


  connectToChatRoom(chatId: string) {
    this._activeChat.next(this._chats.getValue()?.find(chat => chat.id === chatId));
    
    if (! this.socket || ! this.socket?.connected) {
      console.log('[Debug] Attempting to connect to chat room, but socket is not connected yet.')
      this.connectAndConfigureSocket();
      this.socket?.on('connect', () => {
        this.socket?.emit('join', chatId);
      });
      return;
    }
    
    this.socket?.emit('join', chatId);
  }

  postChatMessage(message: ChatMessage) {
    this.socket?.emit('new message', this._activeChat.getValue()?.id, message);
  }
  
  ngOnInit() { }

  getAuthorName(authorId: string): string | undefined {
    const chats = this._activeChat.getValue();
    console.log(
      '[Debug] searching for author with id ' + authorId + 
      ' in the active chat object: ', this._activeChat.getValue()
    );
    const author = chats?.members?.find(member => member.id === authorId);
    const name = author?.userName;
    console.log('[Debug] still searching for the right name. Author: ', author);
    console.log('[Debug] as above. Name: ' + name);
    return name;
  }
}
