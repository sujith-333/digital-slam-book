// components/ui/SessionProvider.jsx
// NextAuth requires this client-side wrapper to share session data
// "use client" means this runs in the browser, not on the server

'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

export default function SessionProvider({ children, session }) {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
}