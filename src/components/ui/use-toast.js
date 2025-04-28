import React from "react"

let listeners = []
let counter = 0

export function toast({ title, description }) {
    const id = `toast-${++counter}`
    const newToast = { id, title, description }

    listeners.forEach((listener) => listener(newToast))

    setTimeout(() => {
        listeners.forEach((listener) => listener({ id, dismiss: true }))
    }, 3000)
}

export function useToast() {
    const [toasts, setToasts] = React.useState([])

    React.useEffect(() => {
        const listener = (toast) => {
            if (toast.dismiss) {
                setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            } else {
                setToasts((prev) => [...prev, toast])
            }
        }
        listeners.push(listener)
        return () => {
            listeners = listeners.filter((l) => l !== listener)
        }
    }, [])

    return { toasts, toast }
}
