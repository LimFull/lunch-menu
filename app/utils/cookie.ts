

type ParsedCookie = {
    value: string;
    path?: string;
    domain?: string;
    expires?: string;       
    expiresISO?: string;    
    maxAge?: number;
    sameSite?: 'Lax' | 'Strict' | 'None';
    secure?: boolean;
    httpOnly?: boolean;
  };
  
  export function parseCookie(header: string): Record<string, ParsedCookie> {
    // 1) 여러 쿠키로 분할: 콤마 뒤에 "토큰=" 패턴이 나올 때만 나눈다.
    const cookieStrings: string[] = [];
    let start = 0;
    for (let i = 0; i < header.length; i++) {
      if (header[i] === ',') {
        const rest = header.slice(i + 1);
        // 콤마 다음이 "이름=" 패턴이면 새 쿠키의 시작으로 본다.
        const m = rest.match(/^\s*([A-Za-z0-9!#$%&'*+.^_`|~-]+)\s*=/);
        if (m) {
          cookieStrings.push(header.slice(start, i).trim());
          start = i + 1;
        }
        // 아니라면 Expires 등 속성 값 내부의 콤마로 간주하고 계속 진행
      }
    }
    cookieStrings.push(header.slice(start).trim());
  
    const result: Record<string, ParsedCookie> = {};
  
    for (const s of cookieStrings) {
      if (!s) continue;
      // 2) 세미콜론으로 속성 분할
      const segments = s.split(';').map(x => x.trim()).filter(Boolean);
      if (segments.length === 0) continue;
  
      // 3) 첫 세그먼트: name=value
      const [namePart, ...valueParts] = segments[0].split('=');
      const cookieName = (namePart ?? '').trim();
      const cookieValue = valueParts.join('=').trim(); // 값에 '=' 포함 가능성 고려
  
      if (!cookieName) continue;
  
      const parsed: ParsedCookie = { value: stripQuotes(cookieValue) };
  
      // 4) 나머지 세그먼트: 속성들
      for (let i = 1; i < segments.length; i++) {
        const seg = segments[i];
        const [kRaw, ...vParts] = seg.split('=');
        const key = (kRaw || '').trim().toLowerCase();
        const valRaw = vParts.join('=').trim();
        const val = stripQuotes(valRaw);
  
        switch (key) {
          case 'path':
            parsed.path = val || '/';
            break;
          case 'domain':
            parsed.domain = val;
            break;
          case 'expires': {
            parsed.expires = val;
            const d = new Date(val);
            if (!isNaN(d.getTime())) parsed.expiresISO = d.toISOString();
            break;
          }
          case 'max-age': {
            const n = Number(val);
            if (!Number.isNaN(n)) parsed.maxAge = n;
            break;
          }
          case 'samesite': {
            const v = val.toLowerCase();
            if (v === 'lax' || v === 'strict' || v === 'none') {
              parsed.sameSite = (v[0].toUpperCase() + v.slice(1)) as ParsedCookie['sameSite'];
            }
            break;
          }
          case 'secure':
            parsed.secure = true;
            break;
          case 'httponly':
            parsed.httpOnly = true;
            break;
          default:
            // 필요하면 커스텀/미지원 속성 처리
            // 예: parsed[key] = val || true;
            if (key) {
              // flag 속성(값 없음)도 true로 보존하려면:
              (parsed as any)[key] = vParts.length ? val : true;
            }
        }
      }
  
      result[cookieName] = parsed;
    }
  
    return result;
  
    function stripQuotes(str: string) {
      if (str.length >= 2 && ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'")))) {
        return str.slice(1, -1);
      }
      return str;
    }
  }