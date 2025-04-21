import { NextResponse } from 'next/server';
import { supabase, ApiKey } from '@/app/lib/supabase';
import { getUserIdFromEmail } from '@/app/lib/auth';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

export async function GET(request: Request) {
  try {
    // Get the session directly from NextAuth
    const session = await getServerSession(authOptions);
    console.log('NextAuth session:', session);

    if (!session || !session.user || !session.user.email) {
      console.log('No session or user email found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the user ID from the email
    const userId = await getUserIdFromEmail(session.user.email);
    console.log('User ID from email:', userId);

    if (!userId) {
      console.log('No user ID found for email:', session.user.email);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch API keys directly using the user ID
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching API keys:', error);
      return NextResponse.json(
        { error: 'Failed to fetch API keys', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Get the session directly from NextAuth
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the user ID from the email
    const userId = await getUserIdFromEmail(session.user.email);

    if (!userId) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const newKey = {
      name,
      key: 'sk-' + Math.random().toString(36).substring(2),
      user_id: userId,
    };

    const { data, error } = await supabase
      .from('api_keys')
      .insert(newKey)
      .select()
      .single();

    if (error) {
      console.error('Error creating API key:', error);
      return NextResponse.json(
        { error: 'Failed to create API key' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
