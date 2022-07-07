import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';
import { supabase } from '../utils/supabaseClient';
import styles from '../styles/Navbar.module.css';


export default function RegisterModal() {
    const { t } = useTranslation(['common'])
    const [loading, setLoading] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>('')

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            console.log('registerUser');
            setLoading(true)
            // console.log('email: ', email);
            // console.log('password: ', password);
            if (password !== passwordConfirmation) {
                console.log('password: ', password);
                console.log('passwordConfirmation: ', passwordConfirmation);
                alert('Password confirmation do not match')
                return
            }
            const { user, session, error } = await supabase.auth.signUp({ email, password })
            if (error) throw error
            console.log('user: ', user)
            console.log('session: ', session)
            // Close modal
            //    props.handleClose()
            // alert('User was successfully created. Check your inbox for the confirmation message!')
            // alert(t('user_create_success'))
        } catch (error) {
            console.log('error: ', error);
            alert(error.error_description || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="modal fade" id="registerModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content" style={{ backgroundColor: 'LightSlateGray' }}>
                    <div className="modal-header">
                        <h5 className={classNames("modal-title", styles.textSubTitle)} id="exampleModalLabel">{t('register')}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body" style={{ backgroundColor: 'whitesmoke' }}>
                        <div className="row">
                            <div className="col col-md-12">
                                <main className="form-signin w-100 m-auto text-center">
                                    <form onSubmit={handleSubmit}>
                                    <img className="mb-4" src="/images/avatar.png" alt="tif-logo" width="100" />

                                    <div className="form-floating mb-2">
                                            <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
                                            <label htmlFor="floatingInput">{t('email')}</label>
                                        </div>
                                        <div className="form-floating mb-2">
                                            <input type="password" className="form-control" id="floatingPassword" placeholder="Password" />
                                            <label htmlFor="floatingPassword">{t('password')}</label>
                                        </div>
                                        <div className="form-floating mb-4">
                                            <input type="password" className="form-control" id="floatingPassword" placeholder="Password" />
                                            <label htmlFor="floatingPassword">{t('password_confirmation')}</label>
                                        </div>
                                        <button className="w-100 btn btn-lg" type="submit" style={{ backgroundColor: 'orangered', color: 'white' }}>{t('register')}</button>

                                        {/* <h2>{t('register')}</h2>
                                        <label htmlFor="name">{t('email')}</label>
                                        <input id="email" type="email" placeholder="Your email" required onChange={(e) => setEmail(e.target.value)} />
                                        <br /><br />
                                        <label htmlFor="password">{t('password')}</label>
                                        <input
                                            id="password"
                                            type="password"
                                            placeholder="Your password"
                                            required
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <br /><br />
                                        <label htmlFor="password_confirmation">{t('password_confirmation')}</label>
                                        <input
                                            id="password_confirmation"
                                            type="password"
                                            placeholder="Password confirmation"
                                            required
                                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        />
                                        <br /><br /><br />
                                        <div>
                                            <button
                                                onClick={(e) => {
                                                    handleSubmit(e)
                                                }}
                                                className=""
                                                disabled={loading}
                                            >
                                                <span>{loading ? t('loading') : t('register')}</span>
                                            </button>&nbsp;<button>{t('switch_to_login')}</button>
                                        </div> */}
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