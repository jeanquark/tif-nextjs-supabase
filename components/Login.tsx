import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
// import { useAppSelector, useAppDispatch } from '../app/hooks'


export default function Auth() {
    // const dispatch = useAppDispatch()

    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

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

    const handleLogin = async (email, password) => {
        console.log('handleLogin');
        try {
            setLoading(true)
            const { user, error } = await supabase.auth.signIn({ email, password })
            if (error) throw error
            console.log('user: ', user)
            // alert('Successful login!')
        } catch (error) {
            alert(error.error_description || error.message)
        } finally {
            setLoading(false)
        }
        // dispatch(loginUser(email, password));
    }

    return (
        <div className="row flex flex-center">
            <div className="col-6 form-widget">
                <div>
                    <input
                        className="inputField"
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        className="inputField"
                        type="password"
                        placeholder="Your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
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
                    </button>
                </div>
            </div>
        </div>
    )
}