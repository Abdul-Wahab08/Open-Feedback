"use client"
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import messages from "@/messages.json"
import Autoplay from "embla-carousel-autoplay";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Link2, MessageSquare, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="grow flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black mx-auto">
      <main className="mx-2 my-10 flex justify-center items-center flex-col gap-4">
        <section className="-my-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center py-2">Anonymous Feedback Without Fear</h1>
          <p className="text-lg text-center py-2 text-zinc-600 dark:text-zinc-400">Open Feedback - Where your identity remains a secret.</p>
        </section>

        <section>
          <Carousel className="w-full max-w-xs" plugins={[Autoplay({ delay: 5000, stopOnMouseEnter: false })]} >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex flex-col gap-2 aspect-square items-center justify-center p-6">
                        <h2 className="text-lg font-bold">{message.title}</h2>
                        <p className="text-center">{message.content}</p>
                      </CardContent>
                      <p className="w-1/2 px-4 py-2 rounded-lg ml-2 mb-6 bg-black text-white">{message.received} </p>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
        <div className="mt-4">
          <Link href={"/sign-in"} >
            <Button className="px-10 py-5">
              Get Started <ArrowRight />
            </Button>
          </Link>
        </div>

        <section className="grid md:grid-cols-3 gap-6 my-6">
          <Card>
            <CardContent className="p-6 flex flex-col gap-3 items-center text-center">
              <Link2 />
              <h3 className="font-semibold">Create your link</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Sign up and generate your personal feedback link.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col gap-3 items-center text-center">
              <MessageSquare />
              <h3 className="font-semibold">Share it anywhere</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Post it on social media, chats, or email.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col gap-3 items-center text-center">
              <ShieldCheck />
              <h3 className="font-semibold">Get honest feedback</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                People reply anonymously. You see the truth.
              </p>
            </CardContent>
          </Card>
        </section>

      </main>

    </div>
  );
}
