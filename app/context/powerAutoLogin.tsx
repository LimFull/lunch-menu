'use client';

import { createContext, useContext, useState } from "react";

export const PowerAutoLoginContext = createContext({
    isPowerAutoLogin: false,
    setIsPowerAutoLogin: (isPowerAutoLogin: boolean) => {},
});

export const usePowerAutoLoginContext = () => {
    return useContext(PowerAutoLoginContext);
}

export const PowerAutoLoginProvider = ({ children }: { children: React.ReactNode }) => {
    const [isPowerAutoLogin, setIsPowerAutoLogin] = useState<boolean>(false);

    return (
        <PowerAutoLoginContext.Provider value={{ isPowerAutoLogin, setIsPowerAutoLogin }}>
            {children}
        </PowerAutoLoginContext.Provider>
    );
}
