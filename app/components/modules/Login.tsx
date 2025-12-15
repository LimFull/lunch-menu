'use client';

import { useEffect, useRef, useState } from "react";

import useUserContext from "@/app/hooks/useUserContext";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { parseCookie } from "@/app/utils/cookie";
import { User } from "@/app/context/user";
import { usePowerAutoLogin } from "@/app/hooks/usePowerAutoLogin";
import { Tooltip } from "./Tooltip";

function Login() {
  const { user, setUser } = useUserContext();
  const { powerAutoLogin, isPowerAutoLogin, setIsPowerAutoLogin, setPowerAutoLoginUserData } = usePowerAutoLogin();
  const [currentId, setCurrentId] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const isInitial = useRef(false);
  const router = useRouter();
  const autoLoginRef = useRef(false);

  console.log("isPowerAutoLogin", isPowerAutoLogin);
  
  const handleLogin = useCallback(async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    console.log("isPowerAutoLogin", isPowerAutoLogin, currentId, currentPassword);

    
    const response = await fetch('/api/login', {
      method: 'POST',

      body: JSON.stringify({ id: currentId, password: currentPassword, osDvCd:user.osDvCd, userCurrAppVer:user.userCurrAppVer, mobiPhTrmlId:user.mobiPhTrmlId, trmlTokenVal:user.trmlTokenVal }),
    });
    
    if (response.ok) {
      if (isPowerAutoLogin) {
        setPowerAutoLoginUserData({ id: currentId, pwd: currentPassword });
      } else {
        setPowerAutoLoginUserData({ id: '', pwd: '' });
      }
      
      const data = await response.json();
      const cookies = parseCookie(data.cookie);
      
      setUser((prev:User) => ({...prev, trmlTokenVal:data.trmlTokenVal, osDvCd:data.osDvCd, userCurrAppVer:data.userCurrAppVer, mobiPhTrmlId:data.mobiPhTrmlId, id:currentId, wmonid:cookies?.WMONID?.value??prev.wmonid, mblctfSessionidPrd:cookies?.MBLCTF_SESSIONID_PRD?.value??prev.mblctfSessionidPrd, appInfo:cookies?.appInfo?.value??prev.appInfo }));
      router.push('/menu');
    } else { 
      const data = await response.json();
    }

  }, [currentId, currentPassword, user.osDvCd, user.userCurrAppVer, user.mobiPhTrmlId, user.trmlTokenVal, setUser, setPowerAutoLoginUserData, isPowerAutoLogin]);

  
  const autoLogin = useCallback(async () => {
    if (user.isAutoLogin && !autoLoginRef.current) {
      if (!user.id || !user.wmonid) {
        return;
      }
      autoLoginRef.current = true;
      
      const response = await fetch('/api/autoLogin', {
        method: 'POST',
        body: JSON.stringify({ id: currentId, osDvCd:user.osDvCd, userCurrAppVer:user.userCurrAppVer, mobiPhTrmlId:user.mobiPhTrmlId, trmlTokenVal:user.trmlTokenVal, wmonid:user.wmonid }),
      });


      if (response.ok) {
        const data = await response.json();

        const cookies = parseCookie(data.cookie);
        setUser((prev:User) => ({...prev, mblctfSessionidPrd:cookies?.MBLCTF_SESSIONID_PRD?.value??prev.mblctfSessionidPrd, wmonid:cookies?.WMONID?.value??prev.wmonid, appInfo:cookies?.appInfo?.value??prev.appInfo }));
        router.push('/menu');
      }
      else { 
        const data = await response.json();
      }

      return;
    }
  }, [user.id, user.isAutoLogin, currentId, currentPassword, user.osDvCd, user.userCurrAppVer, user.mobiPhTrmlId, user.trmlTokenVal, user.wmonid, setUser]);

  useEffect(() => {
    if (!isInitial.current) {
      autoLogin();
    }
    
  }, [user.isAutoLogin]);

  useEffect(() => {
    setTimeout(() => {
      isInitial.current = true;
    }, 1000);
  }, []);

  useEffect(() => {
    powerAutoLogin();
  }, [powerAutoLogin]);

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
      <div className="flex flex-row items-center justify-center gap-4">
        <input type="checkbox" className="border border-gray-300 p-2 rounded-md" checked={isPowerAutoLogin} onChange={(e) => setIsPowerAutoLogin(e.target.checked)} />
        <label htmlFor="autoLogin">강력 자동로그인</label>
        <Tooltip text="강력 자동로그인은 쿠키를 사용하여 자동으로 로그인을 합니다." position="bottom" delay={10}>
          <span className="text-gray-500 text-sm w-5 h-5 flex items-center justify-center rounded-full bg-gray-200">?</span>
        </Tooltip>
      </div>
    </form>
  );
}

export default Login;