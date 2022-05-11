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
    // toggleModal: () => void;
    // switchTo: (modalName: string) => {};
    switchTo: (params: any) => any;
    // { toggleModal = () => {} }: toggleModal
    // toggleState: (e: React.MouseEvent) => void;
}

export default function FogotPassword(props: ChildProps) {
    // const router = useRouter()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')

    const handleForgotPassword = async () => {
        try {
            console.log('handleForgotPassword email: ', email)
            const { data, error } = await supabase.auth.api
                .resetPasswordForEmail(email)
            console.log('data: ', data)
            if (error) {
                throw error
            }
        } catch (error) {
            console.log('error: ', error);
            alert(error.message)
        }
    }

    return (
        <div className="row flex flex-center">
            <div className="col-6 form-widget">
                <h2>Forgot Password</h2>
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
                <button onClick={(e) => {
                    e.preventDefault()
                    handleForgotPassword()
                }}>Send Link</button>
            </div>
        </div>
    )
}