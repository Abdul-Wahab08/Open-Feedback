import { Message } from "@/model/User.model";

export interface apiResponse{
    success: boolean,
    message: string,
    isAcceptingMessages?: boolean,
    messages?: Array<Message>
}