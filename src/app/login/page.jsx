"use client"
import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { redirect } from "next/navigation"

export default function Component() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "authenticated") {
      redirect('/dashboard')
    }
  }, [status])

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.1,
          duration: 1,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
          <div className="max-w-2xl mx-auto p-4">
            <h1 className="relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold">
              Hello, Human
            </h1>
            <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
              Ask questions, get answers - leave the SQL to us.
            </p>
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Continue with </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-6">
                  <Button variant="outline" onClick={() => signIn('github')}>
                    Github
                  </Button>
                  <Button variant="default" onClick={() => signIn('google')}>
                    Google
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
      </motion.div>
    </AuroraBackground>
  )
}
