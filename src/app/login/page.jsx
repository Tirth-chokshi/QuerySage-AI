"use client"
import { useSession, signIn, signOut } from "next-auth/react"
import AnimatedGridPattern from '@/components/magicui/animated-grid-pattern'
import { cn } from "@/lib/utils"
export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return <>
      Signed in as {session.user.email} <br />
      <button onClick={() => signOut()}>Sign out</button>
    </>
  }
  return <>
    {/* <div className="flex items-center justify-center min-h-screen bg-gray-100"> */}
      {/* <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}
      /> */}
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    {/* </div> */}
  </>
}


// import { signIn } from 'next-auth/react'
// import { Button } from '@/components/ui/button'
// import { FaGoogle, FaGithub } from 'react-icons/fa'
// import AnimatedGridPattern from '@/components/magicui/animated-grid-pattern'
// import { cn } from '@/lib/utils'

// export default function Login() {
//   const handleSocialLogin = (provider) => {
//     signIn(provider, { callbackUrl: '/' })
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <AnimatedGridPattern
//         numSquares={30}
//         maxOpacity={0.1}
//         duration={3}
//         repeatDelay={1}
//         className={cn(
//           "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
//           "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
//         )}
//       />
//       <div className="bg-white p-8 rounded-lg shadow-md w-96 z-10">
//         <h1 className="text-2xl font-bold mb-6 text-center">Welcome to QuerySage</h1>
//         <p className="text-center mb-6">Sign in or sign up to continue</p>
//         <div className="space-y-4">
//           <Button
//             onClick={() => handleSocialLogin('google')}
//             className="w-full flex items-center justify-center"
//           >
//             <FaGoogle className="mr-2" />
//             Continue with Google
//           </Button>
//           <Button
//             onClick={() => handleSocialLogin('github')}
//             className="w-full flex items-center justify-center"
//           >
//             <FaGithub className="mr-2" />
//             Continue with GitHub
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }