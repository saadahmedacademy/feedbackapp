import { Message } from "@/model/user.model"

export interface ApiResponse {
    success: boolean
    message: string
    isAccecptingMessage?: boolean
    messages?: Array<Message>;
}