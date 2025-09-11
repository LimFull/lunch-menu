'use client';

import { useEffect, useRef, useState } from "react";

import useUserContext from "@/app/hooks/useUserContext";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { parseCookie } from "@/app/utils/cookie";
import { User } from "@/app/context/user";

function Login() {
  const { user, setUser } = useUserContext();
  const [currentId, setCurrentId] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const router = useRouter();
  const autoLoginRef = useRef(false);

  
  
  const handleLogin = useCallback(async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ id: currentId, password: currentPassword, osDvCd:user.osDvCd, userCurrAppVer:user.userCurrAppVer, mobiPhTrmlId:user.mobiPhTrmlId, trmlTokenVal:user.trmlTokenVal }),
    });
    

    if (response.ok) {
      const data = await response.json();
      const cookies = parseCookie(data.cookie);
      
      setUser((prev:User) => ({...prev, trmlTokenVal:data.trmlTokenVal, osDvCd:data.osDvCd, userCurrAppVer:data.userCurrAppVer, mobiPhTrmlId:data.mobiPhTrmlId, id:currentId, wmonid:cookies?.WMONID?.value??prev.wmonid, mblctfSessionidPrd:cookies?.MBLCTF_SESSIONID_PRD?.value??prev.mblctfSessionidPrd }));
      router.push('/menu');
    } else { 
      const data = await response.json();
    }

  }, [currentId, currentPassword, user.osDvCd, user.userCurrAppVer, user.mobiPhTrmlId, user.trmlTokenVal, setUser]);

  
  const autoLogin = useCallback(async () => {
    console.log('autoLogin', user.isAutoLogin, autoLoginRef.current);
    if (user.isAutoLogin && !autoLoginRef.current) {
      if (!user.id || !user.wmonid) {
        console.log("자동로그인 조건 불만족", user.id,"wmonid", user.wmonid);
        return;
      }
      console.log("자동로그인 시작");
      autoLoginRef.current = true;
      
      const response = await fetch('/api/autoLogin', {
        method: 'POST',
        body: JSON.stringify({ id: currentId, osDvCd:user.osDvCd, userCurrAppVer:user.userCurrAppVer, mobiPhTrmlId:user.mobiPhTrmlId, trmlTokenVal:user.trmlTokenVal, wmonid:user.wmonid }),
      });


      if (response.ok) {
        const data = await response.json();

        const cookies = parseCookie(data.cookie);
        console.log('자동로그인 cookies', cookies);
        setUser((prev:User) => ({...prev, mblctfSessionidPrd:cookies?.MBLCTF_SESSIONID_PRD?.value??prev.mblctfSessionidPrd, wmonid:cookies?.WMONID?.value??prev.wmonid, appInfo:cookies?.appInfo?.value??prev.appInfo }));
        router.push('/menu');
      }
      else { 
        console.log('자동로그인 실패', response);
        const data = await response.json();
      }

      return;
    }
  }, [user.id, user.isAutoLogin, currentId, currentPassword, user.osDvCd, user.userCurrAppVer, user.mobiPhTrmlId, user.trmlTokenVal, user.wmonid, setUser]);

  useEffect(() => {
    autoLogin();
  }, [user.isAutoLogin]);

// 자동로그인 체크박스
  return (
    <form className="flex flex-col items-center justify-center h-screen gap-4" onSubmit={handleLogin} >
      <h1>Hcafeteria Menu</h1>
      <input type="text" placeholder="ID" className="border border-gray-300 p-2 rounded-md" value={currentId} onChange={(e) => setCurrentId(e.target.value)} />
      <input type="password" placeholder="Password" className="border border-gray-300 p-2 rounded-md" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
      <button className="bg-blue-500 text-white p-2 rounded-md" onClick={() => {handleLogin()}}>Login</button>
      <div className="flex flex-row items-center justify-center gap-4">
        <input type="checkbox" className="border border-gray-300 p-2 rounded-md" checked={user?.isAutoLogin === undefined ? false : user.isAutoLogin } onChange={(e) => setUser((prev:User) => ({...prev, isAutoLogin:e.target.checked}))} />
        <label htmlFor="autoLogin">자동로그인</label>
      </div>
    </form>
  );
}

export default Login;