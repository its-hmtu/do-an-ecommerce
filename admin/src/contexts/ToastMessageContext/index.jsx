import React, { createContext } from 'react'
export const ToastMessageContext = createContext();

function ToastMessageProvider({children}) {
  const [toastMessage, setToastMessage] = React.useState({
    message: '',
    type: 'success',
    open: false,
  });
  return (
    <ToastMessageContext.Provider value={{toastMessage, setToastMessage}}>
      {children}
    </ToastMessageContext.Provider>
  )
}

export default ToastMessageProvider