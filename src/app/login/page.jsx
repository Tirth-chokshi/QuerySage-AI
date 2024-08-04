"use client"
import { useSession, signIn, signOut } from "next-auth/react"
import AnimatedGridPattern from '@/components/magicui/animated-grid-pattern'
import { cn } from "@/lib/utils"
import { redirect } from 'next/navigation'
import { useEffect } from "react"
import DotPattern from "@/components/magicui/dot-pattern"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { LampContainer } from "@/components/ui/lamp"
import { motion } from "framer-motion"
import { AuroraBackground } from "@/components/ui/aurora-background"
export default function Component() {
  const { data: session, status } = useSession()

  // useEffect(() => {
  //   if (status === "authenticated") {
  //     redirect('/dashboard')
  //   }
  // }, [status])
  if (session) {
    return <>
      Signed in as {session.user.email} <br />
      <button onClick={() => signOut()}>Sign out</button>
    </>
  }
  return <>
      <div className="h-[40rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
            Hello, Human
          </h1>
          <p></p>
          <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
            Ask questions, get answers - leave the SQL to us.
          </p>
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Continue with </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-6">
                <Button variant="outline"
                  onClick={() => signIn('github')}
                >
                  <Icons.gitHub className="mr-2 h-4 w-4" />
                  Github
                </Button>
                <Button variant="outline"
                  onClick={() => signIn('google')}
                >
                  <Icons.google className="mr-2 h-4 w-4" />
                  Google
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* <BackgroundBeams /> */}
      </div>
  </>
}