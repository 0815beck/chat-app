import { User } from "./User";

export type ChatMessage = {
    id?: string,
    time: Date,
    userId: string,
    chatId: string,
    content: string
}