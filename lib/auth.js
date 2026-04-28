import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async signIn({ user }) {
      const { supabaseAdmin } = await import('@/lib/supabase');
      await supabaseAdmin.from('users').upsert({
        email: user.email,
        name: user.name,
        image: user.image,
      }, { onConflict: 'email' });
      return true;
    },

    async session({ session }) {
      const { supabaseAdmin } = await import('@/lib/supabase');
      const { data } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single();
      if (data) session.user.id = data.id;
      return session;
    },

    async jwt({ token }) {
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};