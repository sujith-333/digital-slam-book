// app/layout.js
// This wraps EVERY page in the app
// Think of it as the "frame" around all your pages

import './globals.css';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import SessionProvider from '@/components/ui/SessionProvider';

export const metadata = {
  title: 'Slam Book — Your Digital Memory Book',
  description: 'Create your personal slam book, share with friends, collect memories forever.',
  keywords: 'slam book, memories, friends, digital',
  openGraph: {
    title: 'Slam Book',
    description: 'Your Digital Memory Book',
    images: ['/og-image.png'],
  },
};

export default async function RootLayout({ children }) {
  // Get the user's session on the server
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      </head>
      <body>
        {/* SessionProvider makes the session available to ALL client components */}
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}