import { NextResponse } from 'next/server';

// Tạm thời lưu trữ trong memory (sẽ thay bằng database sau)
let apiKeys: any[] = [];

export async function GET() {
  return NextResponse.json(apiKeys);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name } = body;

  if (!name) {
    return NextResponse.json(
      { error: 'Name is required' },
      { status: 400 }
    );
  }

  const newKey = {
    id: Date.now().toString(),
    name,
    key: 'sk-' + Math.random().toString(36).substring(2),
    createdAt: new Date().toISOString(),
  };

  apiKeys.push(newKey);
  return NextResponse.json(newKey);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'ID is required' },
      { status: 400 }
    );
  }

  apiKeys = apiKeys.filter(key => key.id !== id);
  return NextResponse.json({ success: true });
}
