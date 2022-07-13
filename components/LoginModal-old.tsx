import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';
import Modal from 'react-bootstrap/Modal';

import { useAppDispatch } from '../app/hooks';
import { setAuthUser } from '../features/auth/authSlice';
import { supabase } from '../utils/supabaseClient';
import styles from '../styles/Navbar.module.css';

export default function LoginModal() {
    const dispatch = useAppDispatch()
    const { t } = useTranslation(['common'])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>(null)
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [showModal, setShowModal] = useState<boolean>(true)

    const handleLogin = async (email: string, password: string) => {
        try {
            console.log('handleLogin')
            // const myModal = document.getElementById('loginModal')
            // console.log('myModal: ', myModal);
            // myModal.style.display = 'hidden'
            // myModal.modal.hide()
            return

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
        } catch (error) {
            console.log('error: ', error);
            // alert(error.error_description || error.message)
            setError(error)
        } finally {
            setLoading(false)
            // Close modal
            // setShowModal(false)

        }
    }

    const handleOAuthLogin = async (OAuthProvider: any) => {
        try {
            const { user, session, error } = await supabase.auth.signIn({
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
    }

    return (

        <div className="modal fade" id="loginModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content" style={{ backgroundColor: 'LightSlateGray' }}>
                    <div className="modal-header">
                        <h5 className={classNames("modal-title", styles.textSubTitle)} id="exampleModalLabel">{t('login')}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body" style={{ backgroundColor: 'Whitesmoke' }}>
                        <div className="row">
                            <div className="col col-md-12">
                                <main className="form-signin w-100 m-auto text-center">
                                    <form className="form-floating">
                                        <img className="mb-4" src="/images/avatar.png" alt="tif-logo" width="100" />

                                        <div className="form-floating mb-2">
                                            <input type="email" className={classNames("form-control", error && "is-invalid")} id="emailInput" placeholder={t('your_email')} value={email} onChange={(e) => (setError(null), setEmail(e.target.value))} />
                                            <label htmlFor="emailInput">{t('email')}</label>
                                        </div>
                                        <div className="form-floating mb-4">
                                            <input type="password" className={classNames("form-control", error && "is-invalid")} id="passwordInput" placeholder={t('your_password')} value={password} onChange={(e) => (setError(null), setPassword(e.target.value))} />
                                            <label htmlFor="passwordInput">{t('password')}</label>
                                            {error && <span className="text-danger float-start fw-light m-2">Invalid email or password</span>}
                                        </div>
                                        <div>
                                            <div className="btn btn-sm text-center mb-2" onClick={(e) => { }}>{t('forgot_password')}</div>
                                        </div>
                                        <button className="w-100 btn btn-lg" type="submit" style={{ backgroundColor: 'orangered', color: 'white' }} disabled={loading} onClick={(e) => {
                                            e.preventDefault()
                                            handleLogin(email, password)
                                        }}>{t('login')}</button>

                                        <div className="row my-3">
                                            <div className="col col-md-6">
                                                <button className="btn btn-lg" style={{ background: '#4285F4', color: '#fff' }} onClick={(e) => {
                                                    e.preventDefault()
                                                    handleOAuthLogin('google')
                                                }}>Login avec Google</button>
                                            </div>
                                            <div className="col col-md-6">
                                                <button className="btn btn-lg" style={{ background: '#1DB954', color: '#fff' }} onClick={(e) => {
                                                    e.preventDefault()
                                                    handleOAuthLogin('spotify')
                                                }}>Login avec Spotify</button>
                                            </div>
                                        </div>
                                    </form>
                                </main>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}