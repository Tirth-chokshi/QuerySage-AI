import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from '@/lib/mongodb'
import User from '@/models/User'
import dbConnect from '@/lib/dbConnect'

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
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id || user._id;
      }
      return session;
    },
  },
  events: {
    // Runs after the adapter has created/linked the user, so this only enriches that doc.
    // (As a signIn callback it would create the doc first and trigger OAuthAccountNotLinked for new users.)
    async signIn({ user, account }) {
      const [firstName, ...rest] = (user.name || '').split(' ');
      await dbConnect();
      await User.updateOne(
        { email: user.email },
        { firstName, lastName: rest.join(' '), authProviderId: account.providerAccountId }
      );
    },
  },
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.AUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }