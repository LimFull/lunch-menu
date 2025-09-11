import { createContext } from "react";

export interface User {
  id?: string;
  password?: string;
  osDvCd?: string;
  userCurrAppVer?: string;
  mobiPhTrmlId?: string;
  trmlTokenVal?: string;
  wmonid?: string;
  mblctfSessionidPrd?: string;
}

export const UserContext = createContext({
  user: {} as User,
  setUser: (user: any) => {},
});

