"use client"
import { SessionProvider } from "next-auth/react";


export default function SessionWrapper({children}) {
  return (
    <div>
        <SessionProvider>
            {children}
        </SessionProvider>
    </div>
  )
}
