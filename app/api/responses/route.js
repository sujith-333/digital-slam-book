import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { bookId, responderName, isAnonymous, answers, vibe, signature } = await request.json();

    if (!bookId || !answers?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check book exists and is active
    const { data: book } = await supabaseAdmin
      .from('books')
      .select('is_active')
      .eq('id', bookId)
      .single();

    if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    if (!book.is_active) return NextResponse.json({ error: 'Book is not accepting responses' }, { status: 403 });

    // Save response
    const { data: response, error } = await supabaseAdmin
      .from('responses')
      .insert({
        book_id: bookId,
        responder_name: isAnonymous ? 'Anonymous' : (responderName || 'Anonymous'),
        is_anonymous: isAnonymous || false,
        answers,
        vibe: vibe || '',
        signature: signature || { color: '#6366f1', emoji: '✨' },
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ response }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}