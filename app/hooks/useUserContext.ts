import { useContext } from "react";
import { UserContext } from "../context/user";

function useUserContext() {
  const { user, setUser } = useContext(UserContext);

  return { user, setUser };
}

export default useUserContext;