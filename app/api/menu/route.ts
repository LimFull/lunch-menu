import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const { date, mblctfSessionidPrd } = await request.json();


    if (!mblctfSessionidPrd) {
      return NextResponse.json(
        { error: 'mblctfSessionidPrd 파라미터가 필요합니다.' },
        { status: 400 }
      );
    }


  try {
    console.log('MENU API 호출 시작', mblctfSessionidPrd, date);
    const response = await fetch('https://hcafe.hgreenfood.com/api/menu/todayMenu/selectTodayMenuList.do', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Host': 'hcafe.hgreenfood.com',
        'Referer': 'https://hcafe.hgreenfood.com/ctf/menu/todayMenu/todayMenuList.do?',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko)',
        'X-Requested-With': 'XMLHttpRequest',
        'Origin': 'https://hcafe.hgreenfood.com',
        'Cookie': `MBLCTF_SESSIONID_PRD=${mblctfSessionidPrd}`,
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Sec-Fetch-Site': 'same-origin',
        'Accept-Language': 'ko-KR,ko;q=0.9',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
      },
      body: JSON.stringify({"prvdDt":date,"bizplcCd":"198570"}),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': 'public, max-age=300', // 5분 캐시
      },
    });

  } catch (error) {
    console.error('API 호출 실패:', error);
    
    return NextResponse.json(
      { 
        error: '메뉴 데이터를 가져오는데 실패했습니다.',
        details: error instanceof Error ? error.message : String(error)
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}

// OPTIONS 요청 처리 (CORS preflight)
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
