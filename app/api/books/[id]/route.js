import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    let book = null;

    // First try finding by slug
    const { data: bySlug } = await supabaseAdmin
      .from('books')
      .select('*')
      .eq('slug', id)
      .single();

    if (bySlug) {
      book = bySlug;
    } else {
      // Then try by ID
      const { data: byId } = await supabaseAdmin
        .from('books')
        .select('*')
        .eq('id', id)
        .single();
      book = byId;
    }

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json({ book });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

    const body = await request.json();
    const { data: book, error } = await supabaseAdmin
      .from('books')
      .update(body)
      .eq('id', params.id)
      .eq('owner_id', session.user.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ book });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

    const { error } = await supabaseAdmin
      .from('books')
      .delete()
      .eq('id', params.id)
      .eq('owner_id', session.user.id);

    if (error) throw error;
    return NextResponse.json({ message: 'Book deleted' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}