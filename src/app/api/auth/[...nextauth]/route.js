import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from '@/lib/mongodb'
import User from '@/models/User'

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  pages: {
    signIn: '/login',
  },
  async signIn({ user, account, profile }) {
    if (account.provider === "google" || account.provider === "github") {
      const { name, email } = user;
      try {
        await User.findOneAndUpdate(
          { email },
          { 
            firstName: name.split(' ')[0],
            lastName: name.split(' ').slice(1).join(' '),
            email,
            authProviderId: account.providerAccountId
          },
          { upsert: true, new: true, runValidators: true }
        );
        return true;
      } catch (error) {
        console.error("Error saving user:", error);
        return false;
      }
    }
    return true;
  },
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.AUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
