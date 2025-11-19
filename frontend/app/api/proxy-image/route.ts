import { NextRequest, NextResponse } from 'next/server';

// GET /api/proxy-image - 图片代理，解决跨域问题
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json(
        { error: '缺少图片 URL' },
        { status: 400 }
      );
    }

    console.log('🖼️ 代理图片请求:', imageUrl);

    // 获取图片
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.error('❌ 图片获取失败:', response.status, response.statusText);
      return NextResponse.json(
        { error: '图片获取失败' },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const imageBuffer = await response.arrayBuffer();

    console.log('✅ 图片代理成功，大小:', imageBuffer.byteLength, 'bytes');

    // 返回图片
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // 缓存1天
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    console.error('❌ 代理图片失败:', error.message);
    return NextResponse.json(
      { error: '代理图片失败', details: error.message },
      { status: 500 }
    );
  }
}

