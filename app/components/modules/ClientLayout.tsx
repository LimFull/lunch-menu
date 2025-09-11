'use client';

import { User, UserContext } from "@/app/context/user";
import { useEffect, useLayoutEffect, useState } from "react";

function ClientLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({});

  console.log("ClientLayout user", user);
  
  useEffect(() => {
    console.log("set localsave user", user);
    localStorage.setItem('user', JSON.stringify(user));
  }, [user, setUser]);

  useLayoutEffect(() => {
    const user = localStorage.getItem('user');

    console.log("get localsave user", user);
    
    if (user) {
      setUser((prev) => ({...prev, ...JSON.parse(user)}));
    }
  }, []);
  

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export default ClientLayout;