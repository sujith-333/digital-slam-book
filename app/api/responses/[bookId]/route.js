import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    }

    const { bookId } = params;

    // DEBUG: log what we have
    console.log('=== DEBUG ===');
    console.log('bookId:', bookId);
    console.log('session.user.id:', session.user.id);
    console.log('session.user.email:', session.user.email);

    // Fetch book without ownership check first
    const { data: book, error: bookError } = await supabaseAdmin
      .from('books')
      .select('id, owner_id, title')
      .eq('id', bookId)
      .single();

    console.log('book:', book);
    console.log('bookError:', bookError);

    if (bookError || !book) {
      return NextResponse.json({ error: 'Book not found', bookId }, { status: 404 });
    }

    // Check ownership
    console.log('owner_id:', book.owner_id);
    console.log('match:', book.owner_id === session.user.id);

    if (book.owner_id !== session.user.id) {
      return NextResponse.json({
        error: 'Not authorized',
        owner_id: book.owner_id,
        session_id: session.user.id,
      }, { status: 403 });
    }

    const { data: responses, error } = await supabaseAdmin
      .from('responses')
      .select('*')
      .eq('book_id', bookId)
      .order('created_at', { ascending: false });

    console.log('responses count:', responses?.length);
    if (error) throw error;

    return NextResponse.json({ responses: responses || [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}