import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../utils/supabaseClient'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import {
    loginUser,
    setAuthUser,
    selectAuth
} from '../features/auth/authSlice'

const handleLogout = async() => {
    const { error } = await supabase.auth.signOut()
}

function Navbar() {
    const dispatch = useAppDispatch()
    const auth = useAppSelector(selectAuth)

    useEffect(() => {
        const session = supabase.auth.session()
        console.log('[useEffect Navbar] session: ', session)
        const authUser = session?.user
        if (authUser) {
            dispatch(setAuthUser({
                id: authUser.id,
                email: authUser.email,
                role: authUser.role
            }))
        }
    
        supabase.auth.onAuthStateChange((_event, session) => {
            console.log('[useEffect Navbar] onAuthStateChange session: ', session);
            dispatch(setAuthUser({
                id: session?.user.id,
                email: session?.user.email,
                role: session?.user.role
            }))
        })
      }, [])
    return (
        <div>
            <img src="/logo.svg" alt="logo" style={{ maxWidth: 30 }} />
            <Link href="/">
                <a>Home</a>
            </Link>&nbsp;|&nbsp;
            <Link href="/about" >
                <a>About</a>
            </Link>&nbsp;|&nbsp;
            <Link href="/counter" >
                <a>Counter</a>
            </Link>&nbsp;|&nbsp;
            {auth.id ? 
                <div style={{ display: 'inline-block'}}><button onClick={() => handleLogout()}>Logout</button>&nbsp;<span>{auth.email}</span></div>
                : <Link href="/login"><a>Login</a></Link>
            }
        </div>
    )
}
export default Navbar