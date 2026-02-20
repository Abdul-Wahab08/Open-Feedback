"use client"
import React from 'react'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import axios, { AxiosError } from 'axios'
import { Message } from '@/model/User.model'
import { toast } from 'sonner'
import { apiResponse } from '@/types/apiResponse'

type cardProps = {
    message: Message,
    onDeleteMessage: (messageId: string) => void
}

function MessageCard({ message, onDeleteMessage }: cardProps) {

    const handleDeleteMessage = async () => {
        try {
            console.log(message)
            const response = await axios.delete<apiResponse>(`/api/delete-message/${message._id}`)
            console.log("Response: ", response.data)
            if (!response.data.success) {
                toast.error(response.data.message)
                return
            }

            toast.success(response.data.message)
            onDeleteMessage(message._id.toString())
        } catch (error) {
            const axiosError = error as AxiosError<apiResponse>
            toast.error(axiosError.response?.data.message)
        }
    }

    return (
        <Card >
            <CardHeader>
                <CardDescription className='text-[16px] text-black font-semibold'>
                    {message.content}
                </CardDescription>
                <CardAction>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className='cursor-pointer' variant="destructive">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    message and remove your message from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteMessage}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardAction>
            </CardHeader>
            <CardContent>
                <span>{new Intl.DateTimeFormat("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true
                }).format(new Date(message.createdAt))}</span>
            </CardContent>
        </Card>

    )
}

export default MessageCard
