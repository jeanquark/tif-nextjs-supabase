import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useAppDispatch } from '../app/hooks'
import { setAuthUser } from '../features/auth/authSlice';
// import { Router } from 'next/router';
// import { useRouter } from 'next/router'
// import Router from 'next/router'
import { useRouter } from 'next/router'



type ChildProps = {
    handleClose: () => void;
    toggleModal: () => void;
    // switchTo: (modalName: string) => {};
    switchTo: (params: any) => any;
    // { toggleModal = () => {} }: toggleModal
    // toggleState: (e: React.MouseEvent) => void;
}

export default function Login(props: ChildProps) {
    // const router = useRouter()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    // useEffect(() => {
    //     const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
    //         console.log('[Login] onAuthStateChange event: ', event)
    //         console.log('[Login] onAuthStateChange session: ', session)
    //         const session2 = supabase.auth.session()
    //         console.log('session2: ', session2);
    //         // Send session to /api/auth route to set the auth cookie.
    //         // NOTE: this is only needed if you're doing SSR (getServerSideProps)!
    //         // dispatch(setAuthUser({
    //         //     id: session?.user.id,
    //         //     email: session?.user.email,
    //         //     role: session?.user.role
    //         // }))

    //     })
    //     return () => {
    //         authListener.unsubscribe()
    //     }
    // }, [])

    const handleLogin = async (email: string, password: string) => {
        console.log('handleLogin');
        try {
            setLoading(true)
            const { user, error } = await supabase.auth.signIn({ email, password })
            if (error) throw error
            console.log('user: ', user)
            console.log('Successful login!')
            // Fetch user
            const { data } = await supabase.from('users').select('*').eq('auth_user_id', user.id).limit(1).single()
            console.log('data2: ', data)
            if (data) {
                dispatch(setAuthUser({
                    id: data.id,
                    email: user.email,
                    role: user.role
                }))
            }
            props.handleClose()
        } catch (error) {
            alert(error.error_description || error.message)
        } finally {
            setLoading(false)
        }
        // dispatch(loginUser(email, password));
    }

    const handleOAuthLogin = async (OAuthProvider: any) => {
        const { user, session, error } = await supabase.auth.signIn({
            // provider can be 'github', 'google', 'gitlab', and more
            provider: OAuthProvider
        })
        console.log('user: ', user)
        console.log('session: ', session)
        if (error) {
            console.log('error: ', error)
            return
        }
        // router.reload(window.location.pathname)
        // Router.push('/')
        // if (typeof window !== 'undefined') {
        //     console.log('redirect')
        //     router.push('/')
        //     return
        // }
    }

    return (
        <div className="row flex flex-center">
            <div className="col-6 form-widget">
                <h2>Login</h2>
                <div>
                    <input
                        className="inputField"
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <br />
                <div>
                    <input
                        className="inputField"
                        type="password"
                        placeholder="Your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <br />
                <div>
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            handleLogin(email, password)
                        }}
                        className="button block"
                        disabled={loading}
                    >
                        <span>{loading ? 'Loading' : 'Login'}</span>
                    </button>&nbsp;
                    <button onClick={() => props.switchTo('register')}>Switch to Register</button>
                </div>
                <div>
                    <button onClick={(e) => {
                        e.preventDefault()
                        handleOAuthLogin('google')
                    }}>Google OAuth</button>
                </div>
                <div>
                <button onClick={(e) => {
                        e.preventDefault()
                        handleOAuthLogin('facebook')
                    }}>Facebook OAuth</button>
                </div>
                <br />
            </div>
        </div>
    )
}