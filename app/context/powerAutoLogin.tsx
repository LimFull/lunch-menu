'use client';

import { createContext, useContext, useState } from "react";
import { PowerAutoLoginUserData } from "../types/power-auto-login";

export const PowerAutoLoginContext = createContext({
    isPowerAutoLogin: false,
    setIsPowerAutoLogin: (isPowerAutoLogin: boolean) => {},
    powerAutoLoginUserData: {
        id: '',
        pwd: '',
    } as PowerAutoLoginUserData,
    setPowerAutoLoginUserData: (powerAutoLoginUserData: PowerAutoLoginUserData) => {},
});

export const usePowerAutoLoginContext = () => {
    return useContext(PowerAutoLoginContext);
}

export const PowerAutoLoginProvider = ({ children }: { children: React.ReactNode }) => {
    const [isPowerAutoLogin, setIsPowerAutoLogin] = useState<boolean>(false);
    const [powerAutoLoginUserData, setPowerAutoLoginUserData] = useState<PowerAutoLoginUserData>({ id: '', pwd: '' });
    
    return (
        <PowerAutoLoginContext.Provider value={{ isPowerAutoLogin, setIsPowerAutoLogin, powerAutoLoginUserData, setPowerAutoLoginUserData }}>
            {children}
        </PowerAutoLoginContext.Provider>
    );
}