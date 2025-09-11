import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { date, mealDvCd, conerDvCd, conerCRsvUseYn, conerCDelvUseYn, dlvrFloorRsvYn, mnuOfstockStbyStatFuncYn, mblctfSessionidPrd, appInfo, wmonid } = await request.json();
    
    const body: {
        prvdDt: string;
        bizplcCd: string;
        mealDvCd: string;
        conerDvCd: string;
        conerCRsvUseYn: string;
        conerCDelvUseYn: string;
        dlvrFloorRsvYn: string;
        mnuOfstockStbyStatFuncYn: string;
    } = { prvdDt: date, bizplcCd: '198570', mealDvCd, conerDvCd, conerCRsvUseYn:conerCRsvUseYn??null, conerCDelvUseYn:conerCDelvUseYn??null, dlvrFloorRsvYn:dlvrFloorRsvYn??null, mnuOfstockStbyStatFuncYn:mnuOfstockStbyStatFuncYn??null };

    const headers: {
        [key: string]: string;
    } = {
        "Host":"hcafe.hgreenfood.com",
        "Accept":"application/json, text/javascript, */*; q=0.01",
        "X-Requested-With":"XMLHttpRequest",
        "Sec-Fetch-Site":"same-origin",
        "Accept-Language":"ko-KR,ko;q=0.9",
        "Sec-Fetch-Mode":"cors",
        "Content-Type":"application/json;charset=UTF-8",
        "Origin":"https://hcafe.hgreenfood.com",
        "User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko)",
        "Referer":"https://hcafe.hgreenfood.com/ctf/menu/todayMenu/todayMenuList.do?",
        "Sec-Fetch-Dest":"empty",
    }


    let cookie = '';    
    if (wmonid && wmonid !=="undefined") {
        cookie = `WMONID=${wmonid}`;
    }

    if (mblctfSessionidPrd && mblctfSessionidPrd !=="undefined") {
        cookie = `${cookie}; MBLCTF_SESSIONID_PRD=${mblctfSessionidPrd}`;
    }

    if (appInfo && appInfo !=="undefined") {
        cookie = `${cookie}; appInfo=${appInfo}`;
    }

    // if (id && id !=="undefined") {
    //     cookie = `${cookie}; autoLogin=${id}`;
    // }

    if (cookie && cookie !=="undefined") {
        headers["Cookie"] = cookie;
    }

    const response = await fetch('https://hcafe.hgreenfood.com/api/menu/todayMenu/selectTodayMenuDetailList.do', {
        headers: headers,
        method: 'POST',
        body: JSON.stringify(body),
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });

}   