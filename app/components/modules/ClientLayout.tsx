'use client';

import { User, UserContext } from "@/app/context/user";
import { useEffect, useLayoutEffect, useState } from "react";
import ErrorBoundary from "./ErrorBoundary";

function ClientLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({});

  
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user, setUser]);

  useLayoutEffect(() => {
    const user = localStorage.getItem('user');
    const parsedUser = JSON.parse(user??'');

    if (user) { setUser((prev) => ({...prev, ...parsedUser, osDvCd:parsedUser.osDvCd??prev.osDvCd??'I', userCurrAppVer:parsedUser.userCurrAppVer??prev.userCurrAppVer??'1.8.6'}));
    }
  }, []);
  

  return (
    <ErrorBoundary fallback={<div>에러가 발생했습니다. 잠시 후 다시 시도해주세요.</div>}>
      <UserContext.Provider value={{ user, setUser }}>
        {children}
      </UserContext.Provider>
    </ErrorBoundary>
  );
}

export default ClientLayout;