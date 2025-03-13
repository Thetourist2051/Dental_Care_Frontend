import { createContext, useState } from "react";

interface UserContextType {
  username: string;
  setUsername: (username: string) => void;
}
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: any) => {
  const [username, setUsername] = useState("Guest");
  return (
    <>
      <UserContext.Provider value={{ username, setUsername }}>
        {children}
      </UserContext.Provider>
    </>
  );
};
