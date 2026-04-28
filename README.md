#  Digital Slam Book

> A modern, full-stack digital memory book — create your personal slam book, share with friends, and collect beautiful memories forever.

![Digital Slam Book](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel)

##  Live Demo

** [digital-slam-book-eight.vercel.app](https://digital-slam-book-eight.vercel.app)**

---

##  Features

-  **4 Immersive Themes** — Retro 90s, Minimal, Neon Night, Pastel Dream
-  **Google OAuth** — Sign in with Google via NextAuth.js
-  **Book Creation** — Custom questions with drag-to-reorder
-  **Fill Page** — One-question-at-a-time flow with progress bar
-  **Confetti on Submit** — Celebration animation when friends submit
-  **Beautiful Dashboard** — Manage all your slam books
-  **Polaroid Response Cards** — Masonry grid of friend responses
-  **Save as Image** — Export responses as shareable image cards
-  **Anonymous Responses** — Friends can stay anonymous
-  **Shareable Links** — Unique URL for each slam book

---

##  Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 14** (App Router) | Full-stack React framework |
| **Tailwind CSS** | Styling |
| **Framer Motion** | Animations & transitions |
| **Supabase** | PostgreSQL database |
| **NextAuth.js** | Google OAuth authentication |
| **canvas-confetti** | Confetti animation on submit |
| **html-to-image** | Export response cards as images |
| **react-beautiful-dnd** | Drag-to-reorder questions |
| **Vercel** | Deployment |

---

##  Project Structure

```
digital-slam-book/
├── app/
│   ├── page.js                    # Landing page
│   ├── create/page.js             # Book creation page
│   ├── dashboard/
│   │   ├── page.js                # Dashboard
│   │   └── [id]/page.js           # Responses viewer
│   ├── book/[slug]/page.js        # Public fill page
│   └── api/
│       ├── auth/[...nextauth]/    # NextAuth handler
│       ├── books/                 # Books CRUD API
│       └── responses/             # Responses API
├── components/
│   ├── landing/                   # Landing page components
│   ├── book/                      # Book creation components
│   ├── fill/                      # Fill page components
│   ├── dashboard/                 # Dashboard components
│   └── ui/                        # Reusable UI components
├── lib/
│   ├── supabase.js                # Supabase client
│   ├── auth.js                    # NextAuth config
│   └── themes.js                  # Theme definitions
└── models/                        # Data models reference
```

---

##  Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account (free)
- A [Google Cloud](https://console.cloud.google.com) account (for OAuth)

### 1. Clone the repository
```bash
git clone https://github.com/sujith-333/digital-slam-book.git
cd digital-slam-book
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Supabase
1. Create a new project on [supabase.com](https://supabase.com)
2. Run the following SQL in the Supabase SQL Editor:

```sql
create table users (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text unique not null,
  image text default '',
  created_at timestamp with time zone default now()
);

create table books (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references users(id) on delete cascade,
  title text not null,
  description text default '',
  slug text unique not null,
  theme text default 'pastel',
  questions jsonb default '[]',
  is_active boolean default true,
  response_count integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table responses (
  id uuid default gen_random_uuid() primary key,
  book_id uuid references books(id) on delete cascade,
  responder_name text default 'Anonymous',
  is_anonymous boolean default false,
  answers jsonb default '[]',
  vibe text default '',
  signature jsonb default '{"color": "#6366f1"}',
  created_at timestamp with time zone default now()
);
```

### 4. Set up Google OAuth
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project
3. Enable OAuth 2.0 and create credentials
4. Add `http://localhost:3000/api/auth/callback/google` as redirect URI

### 5. Configure environment variables
Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser! 🎉

---

## 📸 Screenshots

### Landing Page
> Animated hero with typewriter effect and floating emojis

### Book Creation
> Step-by-step creation with live phone preview and theme picker

### Fill Page
> One-question-at-a-time flow with progress bar and card animations

### Dashboard
> Manage your books, copy share links, view response counts

### Responses
> Polaroid-style masonry grid with save-as-image feature

---

##  Deployment

This app is deployed on **Vercel**. To deploy your own:

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Add all environment variables in Vercel project settings
4. Deploy! Vercel handles everything automatically.

Don't forget to add your Vercel URL to Google OAuth authorized redirect URIs:
```
https://your-app.vercel.app/api/auth/callback/google
```

---

##  Contributing

Contributions are welcome! Feel free to:
-  Report bugs
-  Suggest new features
-  Submit pull requests

---

##  License

This project is open source and available under the [MIT License](LICENSE).

---

##  Author

**Sujith**
- GitHub: [@sujith-333](https://github.com/sujith-333)
- Live App: [digital-slam-book-eight.vercel.app](https://digital-slam-book-eight.vercel.app)

---

<div align="center">
  Made with 💜 — Collect memories, cherish friendships
  <br/>
  ⭐ Star this repo if you found it helpful!
</div>
