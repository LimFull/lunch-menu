'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { PowerAutoLoginUserData } from "../types/power-auto-login";
import useUserContext from "./useUserContext";
import { parseCookie } from "../utils/cookie";
import { User } from "../context/user";
import { useRouter } from "next/navigation";
import { usePowerAutoLoginContext } from "../context/powerAutoLogin";
import Cookies from 'js-cookie';



export function usePowerAutoLogin() {
    const { setUser } = useUserContext();
    const { isPowerAutoLogin, setIsPowerAutoLogin, powerAutoLoginUserData,setPowerAutoLoginUserData } = usePowerAutoLoginContext();
    const router = useRouter();

  const handleAutoLogin = useCallback(async () => {
    const isPowerAutoLoginLocal = Cookies.get('isPowerAutoLogin');
    const powerLoginUserDataLocal = JSON.parse(Cookies.get('powerAutoLoginUserData') ?? '{}');

    if (isPowerAutoLoginLocal !== 'true' || !powerLoginUserDataLocal.id || !powerLoginUserDataLocal.pwd) {
    return;
    }

    const response = await fetch('/api/login', {
      method: 'POST',

      body: JSON.stringify({ id: powerLoginUserDataLocal.id, password: powerLoginUserDataLocal.pwd }),
    });
    

    if (response.ok) {
      const data = await response.json();
      const cookies = parseCookie(data.cookie);
      
      setUser((prev:User) => ({...prev, trmlTokenVal:data.trmlTokenVal, osDvCd:data.osDvCd, userCurrAppVer:data.userCurrAppVer, mobiPhTrmlId:data.mobiPhTrmlId, id:powerLoginUserDataLocal.id, wmonid:cookies?.WMONID?.value??prev.wmonid, mblctfSessionidPrd:cookies?.MBLCTF_SESSIONID_PRD?.value??prev.mblctfSessionidPrd, appInfo:cookies?.appInfo?.value??prev.appInfo }));
      router.push('/menu');
    } else { 
      const data = await response.json();
    }

  }, [ setUser]);


  const setIsPowerAutoLoginLocal = useCallback((isPowerAutoLogin: boolean) => {
    if (isPowerAutoLogin) {
      Cookies.set('isPowerAutoLogin', 'true', { expires: undefined });
    } else {
      Cookies.remove('isPowerAutoLogin');
    }
  }, []);

  const setPowerAutoLoginUserDataLocal = useCallback((powerAutoLoginUserData: PowerAutoLoginUserData) => {
    if (powerAutoLoginUserData.id && powerAutoLoginUserData.pwd) {
      Cookies.set('powerAutoLoginUserData', JSON.stringify(powerAutoLoginUserData), { expires: undefined });
    } else {
      Cookies.remove('powerAutoLoginUserData');
    }
  }, []);


  


  return { powerAutoLogin:handleAutoLogin, isPowerAutoLogin, powerAutoLoginUserData, setIsPowerAutoLogin, setIsPowerAutoLoginLocal, setPowerAutoLoginUserData, setPowerAutoLoginUserDataLocal };
}