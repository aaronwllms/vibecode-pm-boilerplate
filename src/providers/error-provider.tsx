'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface ErrorData {
  message: string
  code: string
}

interface ErrorContextType {
  error: ErrorData | null
  setError: (error: ErrorData) => void
  clearError: () => void
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [error, setErrorState] = useState<ErrorData | null>(null)

  const setError = (error: ErrorData) => {
    setErrorState(error)
  }

  const clearError = () => {
    setErrorState(null)
  }

  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
      {children}
    </ErrorContext.Provider>
  )
}

export function useError() {
  const context = useContext(ErrorContext)
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider')
  }
  return context
}

