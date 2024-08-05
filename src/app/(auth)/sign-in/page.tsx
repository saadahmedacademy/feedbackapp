"use client";

import { useSession, signIn, signOut } from 'next-auth/react'

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        <p>Signed in as {session.user.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      <p>Not signed in</p>
      <button  className='bg-blue-600 text-white border-white rounded-md 
      px-3 py-1 m-3'  onClick={() => signIn()}>Sign in</button>
    </>
  )
}
