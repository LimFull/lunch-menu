import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { id, password, osDvCd, userCurrAppVer, mobiPhTrmlId, trmlTokenVal, cookie } = await request.json();

    const body: {
        userId?: string;
        userData?: string;
        osDvCd?: string;
        userCurrAppVer?: string;
        mobiPhTrmlId?: string;
        trmlTokenVal?: string;
    } = {};

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
        "Referer":"https://hcafe.hgreenfood.com/ctf/login/login.do?",
        "Sec-Fetch-Dest":"empty",
    }

    if (id && password && id !=="undefined" && password !=="undefined") {
        body.userId = id;
        body.userData = password;
    }

    if (osDvCd && osDvCd !=="undefined") {
        body.osDvCd = osDvCd;
    }

    if (userCurrAppVer && userCurrAppVer !=="undefined") {
        body.userCurrAppVer = userCurrAppVer;
    }

    if (mobiPhTrmlId && mobiPhTrmlId !=="undefined") {
        body.mobiPhTrmlId = mobiPhTrmlId;
    }

    if (trmlTokenVal && trmlTokenVal !=="undefined") {
        body.trmlTokenVal = trmlTokenVal;
    }

    if (cookie && cookie !=="undefined") {
        headers["Cookie"] = cookie;
    }


    const response = await fetch('https://hcafe.hgreenfood.com/api/com/login.do', {
        headers: headers,
        method: 'POST',
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        return NextResponse.json({ error: '로그인 실패했습니다.' }, { status: 400 });
    }

    const data = await response.json();
    const setCookie = response.headers.get("Set-Cookie");

    return NextResponse.json({data, cookie:setCookie}, { status: 200 });
}