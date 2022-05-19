import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useAppDispatch } from '../app/hooks'
import { setAuthUser } from '../features/auth/authSlice';
// import { Router } from 'next/router';
// import { useRouter } from 'next/router'
// import Router from 'next/router'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'



type ChildProps = {
    handleClose: () => void;
    // toggleModal: () => void;
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

    const { t } = useTranslation(['common']);

    const handleLogin = async (email: string, password: string) => {
        try {
            console.log('handleLogin');
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
                    username: data.username,
                    role: user.role,
                    points: data.points
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
        try {
            const { user, session, error } = await supabase.auth.signIn({
                // provider can be 'github', 'google', 'gitlab', and more
                provider: OAuthProvider
            })
            console.log('user: ', user)
            console.log('session: ', session)
            if (error) {
                throw error
            }
        } catch (error) {
            console.log('error: ', error);
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
                        placeholder={t('your_email')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <br />
                <div>
                    <input
                        className="inputField"
                        type="password"
                        placeholder={t('your_password')}
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
                        <span>{loading ? t('loading') : t('login')}</span>
                    </button>&nbsp;
                    <button onClick={() => props.switchTo('register')}>{t('switch_to_register')}</button>
                </div>
                <br />
                <div>
                    <button onClick={(e) => {
                        e.preventDefault()
                        handleOAuthLogin('google')
                    }}>Google OAuth</button>&nbsp;
                    <button onClick={(e) => {
                        e.preventDefault()
                        handleOAuthLogin('facebook')
                    }}>Facebook OAuth</button>
                </div>
                <br />
                <button onClick={(e) => {
                    props.switchTo('forgot-password')
                }}>{t('forgot_password')}</button>
            </div>
        </div>
    )
}