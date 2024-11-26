import { User } from "./User"

export type Chat = {
    id?: string,
    chatName: string,
    members: User[]
}