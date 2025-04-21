import { NextResponse } from 'next/server';
import { supabase, ApiKey } from '@/app/lib/supabase';
import { getUserIdFromEmail } from '@/app/lib/auth';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

// GET a specific API key by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const id = params.id;

    // Fetch the API key for this user
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching API key:', error);
      return NextResponse.json(
        { error: 'Failed to fetch API key' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'API key not found or unauthorized' },
        { status: 404 }
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

// PATCH (update) a specific API key by ID
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const id = params.id;
    const body = await request.json();
    const { name, monthlyLimit } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // First check if the API key belongs to the user
    const { data: existingKey, error: fetchError } = await supabase
      .from('api_keys')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existingKey) {
      return NextResponse.json(
        { error: 'API key not found or unauthorized' },
        { status: 404 }
      );
    }

    // Update the API key
    const updateData: Partial<ApiKey> = { name };

    if (monthlyLimit !== undefined) {
      updateData.monthly_limit = monthlyLimit;
    }

    const { data, error } = await supabase
      .from('api_keys')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating API key:', error);
      return NextResponse.json(
        { error: 'Failed to update API key' },
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

// DELETE a specific API key by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const id = params.id;

    // First check if the API key belongs to the user
    const { data: existingKey, error: fetchError } = await supabase
      .from('api_keys')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existingKey) {
      return NextResponse.json(
        { error: 'API key not found or unauthorized' },
        { status: 404 }
      );
    }

    // Delete the API key
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting API key:', error);
      return NextResponse.json(
        { error: 'Failed to delete API key' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
