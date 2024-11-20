import { React, createContext, useEffect, useState } from 'react';
import { useGetUser } from 'hooks';
import Cookies from 'js-cookie';
const UserContext = createContext();

const UserProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const { data } = useGetUser(
    Cookies.get('access_token') ? true : false
  );
  useEffect(() => {
    if (data) {
      console.log(data)
      setUser(data);
    } 
  }, [data]);
  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  )
}

export {
  UserContext,
  UserProvider
}