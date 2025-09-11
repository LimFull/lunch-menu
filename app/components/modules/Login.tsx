'use client';

import { useState } from "react";

import useUserContext from "@/app/hooks/useUserContext";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { parseCookie } from "@/app/utils/cookie";

function Login() {
  const { user, setUser } = useUserContext();
  const [currentId, setCurrentId] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const router = useRouter();
  
  const handleLogin = useCallback(async () => {

    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ id: currentId, password: currentPassword, osDvCd:user.osDvCd, userCurrAppVer:user.userCurrAppVer, mobiPhTrmlId:user.mobiPhTrmlId, trmlTokenVal:user.trmlTokenVal }),
      // body: JSON.stringify({ id: currentId, password: currentPassword, osDvCd:user.osDvCd, userCurrAppVer:user.userCurrAppVer, mobiPhTrmlId:user.mobiPhTrmlId, trmlTokenVal:user.trmlTokenVal, cookie:user.cookie }),
    });
    
    

    if (response.ok) {
      const data = await response.json();
      const cookies = parseCookie(data.cookie);
      
      setUser({  trmlTokenVal:data.trmlTokenVal, osDvCd:data.osDvCd, userCurrAppVer:data.userCurrAppVer, mobiPhTrmlId:data.mobiPhTrmlId, id:currentId, password:currentPassword, wmonid:cookies.WMONID.value, mblctfSessionidPrd:cookies.MBLCTF_SESSIONID_PRD.value });
      router.push('/menu');
    } else {
      const data = await response.json();
    }

  }, [currentId, currentPassword, user.osDvCd, user.userCurrAppVer, user.mobiPhTrmlId, user.trmlTokenVal, setUser]);



  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1>Hcafeteria Menu</h1>
      <input type="text" placeholder="ID" className="border border-gray-300 p-2 rounded-md" value={currentId} onChange={(e) => setCurrentId(e.target.value)} />
      <input type="password" placeholder="Password" className="border border-gray-300 p-2 rounded-md" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
      <button className="bg-blue-500 text-white p-2 rounded-md" onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;