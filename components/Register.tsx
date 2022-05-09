import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
// import { useAppSelector, useAppDispatch } from '../app/hooks'


type ChildProps = {
    handleClose: () => void;
    toggleModal: () => void;
}

// export default function Register(props: ChildProps) {
const Register: React.FC<ChildProps> = (props: ChildProps) => {
    // export default Register: React.FC<ChildProps> = (props) => {
    // const dispatch = useAppDispatch()

    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>('')

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

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            console.log('registerUser');
            setLoading(true)
            console.log('email: ', email);
            console.log('password: ', password);
            const { user, session, error } = await supabase.auth.signUp({ email, password })
            if (error) throw error
            console.log('user: ', user)
            console.log('session: ', session)
            // Close modal
           props.handleClose()
            // alert('Successful login!')
        } catch (error) {
            console.log('error: ', error);
            alert(error.error_description || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="row flex flex-center">
            <div className="col-6 form-widget">
                <form onSubmit={handleSubmit}>
                    <h2>Register</h2>
                    <label htmlFor="name">Email</label>
                    <input id="email" type="email" placeholder="Your email" required onChange={(e) => setEmail(e.target.value)} />
                    <br />
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Your password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br />
                    <label htmlFor="password_confirmation">Password confirmation</label>
                    <input
                        id="password_confirmation"
                        type="password"
                        placeholder="Password confirmation"
                        required
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                    />
                    <br /><br />
                    <div>
                        <button
                            onClick={(e) => {
                                handleSubmit(e)
                            }}
                            className=""
                            disabled={loading}
                        >
                            <span>{loading ? 'Loading' : 'Register'}</span>
                        </button>&nbsp;<button onClick={props.toggleModal}>Switch to Login</button>
                    </div>
                </form>
                <br />
            </div>
        </div>
    )
}

export default Register;