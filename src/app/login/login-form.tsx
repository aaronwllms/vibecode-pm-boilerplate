'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { signInAction, signUpAction, type AuthActionState } from './actions'
import { CriticalErrorBanner } from '@/components/critical-error-banner'

export function LoginForm() {
  const [state, setState] = useState<AuthActionState>({})
  const [isPending, startTransition] = useTransition()

  const handleSignIn = async (formData: FormData) => {
    startTransition(async () => {
      const result = await signInAction({}, formData)
      setState(result)
    })
  }

  const handleSignUp = async (formData: FormData) => {
    startTransition(async () => {
      const result = await signUpAction({}, formData)
      setState(result)
    })
  }

  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
      <Link
        href="/"
        className="bg-btn-background hover:bg-btn-background-hover group absolute left-8 top-8 flex items-center rounded-md px-4 py-2 text-sm text-foreground no-underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{' '}
        Back
      </Link>

      {/* Critical Error Banner */}
      {state.isCritical && state.error && (
        <CriticalErrorBanner
          message={state.error}
          errorCode={state.errorCode}
        />
      )}

      <form
        className="flex w-full flex-1 flex-col justify-center gap-2 text-foreground animate-in"
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          handleSignIn(formData)
        }}
      >
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          name="email"
          placeholder="you@example.com"
          required
          disabled={isPending}
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          type="password"
          name="password"
          placeholder="••••••••"
          required
          disabled={isPending}
        />
        <button
          type="submit"
          disabled={isPending}
          className="mb-2 rounded-md bg-green-700 px-4 py-2 text-foreground disabled:opacity-50"
        >
          {isPending ? 'Loading...' : 'Sign In'}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={(e) => {
            const form = e.currentTarget.form
            if (form) {
              const formData = new FormData(form)
              handleSignUp(formData)
            }
          }}
          className="mb-2 rounded-md border border-foreground/20 px-4 py-2 text-foreground disabled:opacity-50"
        >
          {isPending ? 'Loading...' : 'Sign Up'}
        </button>

        {/* Regular error message */}
        {!state.isCritical && state.error && (
          <p className="mt-4 bg-foreground/10 p-4 text-center text-foreground">
            {state.error}
          </p>
        )}
      </form>
    </div>
  )
}

