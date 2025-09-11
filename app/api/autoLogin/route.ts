// post https://hcafe.hgreenfood.com/api/common/setCookie.do
// body: {
//     cookie: string;
// }

import { parseCookie } from "@/app/utils/cookie";
import { NextResponse } from "next/server";

//autoLogin= {id}; WMONID=NaeM5wLhX8o
//body= {"appInfo":{"osDvCd":"I","userCurrAppVer":"1.8.6","mobiPhTrmlId":"FE56A211-65F8-4D53-8E12-0270B990F66C","trmlTokenVal":"eyInsRQTOkb4qQERjzYL4u:APA91bFUX47BlXUIhylJZwDc6FSDURStO3ruqGU36Rxi0_EqoIUxXr6qJbh_as9xiY09q1gdzWAU0nwab_k6FdE4-OC4B0J8mUuMJbUACX5D1vPsKaGNtfU","id":"","pw":""},"autoLogin":"rkemr5002"}

export async function POST(request: Request) {
    const { id, osDvCd, userCurrAppVer, mobiPhTrmlId, trmlTokenVal, wmonid } = await request.json();
    
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

    let cookie = '';

    if (id && id !=="undefined") {
        cookie = `autoLogin=${id}`;
    }

    if (wmonid && wmonid !=="undefined") {
        cookie = `${cookie}; WMONID=${wmonid}`;
    }

    if (cookie && cookie !=="undefined") {
        headers["Cookie"] = cookie;
    }

    const response1 = await fetch('https://hcafe.hgreenfood.com/api/common/setCookie.do', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ appInfo: { osDvCd, userCurrAppVer, mobiPhTrmlId, trmlTokenVal, id:'', pw:'' }, autoLogin: id }),
    });

    if (!response1.ok) {
        return NextResponse.json({ error: '자동로그인 실패했습니다.' }, { status: 400 });
            
    } 

    const data1 = await response1.json();

    const headers2:{
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
    const setCookie1 = response1.headers.get("Set-Cookie");
    const cookies1 = parseCookie(setCookie1??'');
    
    let cookie2 = '';

    if (id && id !=="undefined") {
        cookie2 = `autoLogin=${id}`;
    }

    if (cookies1.appInfo?.value) {
        cookie2 = `${cookie2}; appInfo=${cookies1.appInfo.value}; Path=/`;
    }

    if (cookie2 && cookie2 !=="undefined") {
        headers2["Cookie"] = cookie2;
    }

    const response2 = await fetch('https://hcafe.hgreenfood.com/api/common/setCookie.do', {
        method: 'POST',
        headers: headers2,
        body: JSON.stringify({ appInfo: { osDvCd, userCurrAppVer, mobiPhTrmlId, trmlTokenVal, id:'', pw:'' }, autoLogin: id }),
    });
    
    if (!response2.ok) {
        return NextResponse.json({ error: '자동로그인 실패했습니다.' }, { status: 400 });
    }

    const data2 = await response2.json();
    const setCookieResponse = response2.headers.get("Set-Cookie");
    
    
    return NextResponse.json({data2, cookie:setCookieResponse}, { status: 200 });
}
