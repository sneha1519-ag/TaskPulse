import * as React from "react"

const ToastContext = React.createContext({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
})

export { ToastContext } 