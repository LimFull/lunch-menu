'use client';

import { User, UserContext } from "@/app/context/user";
import { useEffect, useLayoutEffect, useState } from "react";

function ClientLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({});
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user, setUser]);

  useLayoutEffect(() => {
    const user = localStorage.getItem('user');
    
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);
  

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export default ClientLayout;