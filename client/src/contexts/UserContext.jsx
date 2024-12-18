import { React, createContext, useEffect, useState } from 'react';
import { useGetUser } from 'hooks';
const UserContext = createContext();

const UserProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const { data, isLoading } = useGetUser();

  useEffect(() => {
    if (data) {
      setUser(data);
    } else {
      setUser(null);
    }
  }, [data]);

  return (
    <UserContext.Provider value={{user, setUser, isLoading}}>
      {children}
    </UserContext.Provider>
  )
}

export {
  UserContext,
  UserProvider
}