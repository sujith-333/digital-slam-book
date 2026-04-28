import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { defaultQuestions } from '@/lib/themes';

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50)
    + '-' + Date.now().toString(36);
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

    const { data: books, error } = await supabaseAdmin
      .from('books')
      .select('*')
      .eq('owner_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ books });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

    const { title, description, theme, questions } = await request.json();
    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    const { data: book, error } = await supabaseAdmin
      .from('books')
      .insert({
        owner_id: session.user.id,
        title,
        description: description || '',
        theme: theme || 'pastel',
        slug: generateSlug(title),
        questions: questions || defaultQuestions,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ book }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}