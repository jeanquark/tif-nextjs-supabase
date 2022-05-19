import { useState, useEffect } from 'react'
import Link from 'next/link'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import { supabase } from '../utils/supabaseClient'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import {
    loginUser,
    setAuthUser,
    selectAuth
} from '../features/auth/authSlice'
import Login from '../components/Login'
import Register from '../components/Register'
import ForgotPassword from '../components/ForgotPassword'
import { Modal } from '../components/UI/Modal'
import { Modal2 } from '../components/UI/Modal2'
import { useRouter } from 'next/router'

import styles from '../styles/Navbar.module.css'

// export async function getServerSideProps({ locale }) {
//     return {
//         props: {
//             ...(await serverSideTranslations(locale, ["common", "home"])),
//             // Will be passed to the page component as props
//         },
//     };
// }

export default function Navbar() {
    const dispatch = useAppDispatch()
    const auth = useAppSelector(selectAuth)
    const router = useRouter();
    const [modal, setModal] = useState<boolean>(false)
    const [modalType, setModalType] = useState<string>('')
    // const [modal, setModal] = useState<string>('')
    // const [login, setLogin] = useState(false)
    const [loginModal, setLoginModal] = useState<boolean>(false)
    const [registerModal, setRegisterModal] = useState<boolean>(false)
    const [forgotPasswordModal, setForgotPasswordModal] = useState<boolean>(false)
    // const [registerModal, setRegisterModal] = useState(false)
    const [showModal2, setShowModal2] = useState(false)
    const { t } = useTranslation(['home']);


    const handleLocaleChange = (event) => {
        const value = event.target.value;

        router.push(router.route, router.asPath, {
            locale: value,
        });
    };


    const openLoginModal = () => {
        setModal(true)
        setModalType('login')
    }
    const openRegisterModal = () => {
        setModal(true)
        setModalType('register')
    }
    const openForgotPasswordModal = () => {
        setModal(true)
        setModalType('forgot-password')
    }

    const switchTo = (modalName: string) => {
        console.log('switchTo: ', modalName)
        switch (modalName) {
            case 'register':
                // openRegisterModal()
                setModal(true)
                setModalType('register')
                break;
            case 'login':
                // openLoginModal()
                setModal(true)
                setModalType('login')
                break;
            case 'forgot-password':
                // openForgotPasswordModal()
                setModal(true)
                setModalType('forgot-password')
                break;
            default:
                openRegisterModal()
        }
    }

    const resetPoints = async () => {
        try {
            console.log('resetPoints')
            const { data, error } = await supabase
                .from('users')
                .update({ points: 0 })
                .match({ id: auth.id })
            console.log('data: ', data)
            const session = supabase.auth.session()
            const authUser = session.user
            fetchUser(authUser)
            if (error) {
                throw error
            }
        } catch (error) {
            console.log('error: ', error);
        }
    }

    const closeModal = () => {
        setModal(false)
    }

    const closeLoginModal = () => {
        console.log('closeLoginModal')
        setTimeout(() => {
            setShowModal2(false)
        }, 900)
    }

    const fetchUser = async (authUser: any) => {
        const { data } = await supabase.from('users').select('*').eq('auth_user_id', authUser.id).limit(1).single()
        console.log('data2: ', data)
        if (data) {
            dispatch(setAuthUser({
                id: data.id,
                email: authUser.email,
                username: data.username,
                role: authUser.role,
                points: data.points
            }))
        }
    }

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            return error
        }
        dispatch(setAuthUser({
            id: null,
            email: null,
            username: null,
            role: null,
            points: 0
        }))
    }

    useEffect(() => {
        const session = supabase.auth.session()
        console.log('[useEffect Navbar] session: ', session)
        const authUser = session?.user

        if (authUser) {
            fetchUser(authUser)
        }

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log('[useEffect Navbar] onAuthStateChange session: ', session, new Date());

            if (session && session.user) {
                fetchUser(session.user)
            }
        })
        return () => {
            listener?.unsubscribe()
        }
    }, [])

    return (
        <>
            {/* <img src="/logo.png" alt="logo" style={{ maxWidth: 50, display: 'inline-block', verticalAlign: 'middle' }} />
            <Link href="/">
                <a>{t('home')}</a>
            </Link>&nbsp;|&nbsp;
            <Link href="/about">
                <a>{t('about')}</a>
            </Link>&nbsp;|&nbsp;
            <Link href="/counter">
                <a>Counter</a>
            </Link>&nbsp;|&nbsp;
            {auth.id ?
                <><Link href="/account"><a>{t('account')}</a></Link>&nbsp;|&nbsp;
                    <div style={{ display: 'inline-block' }}><button onClick={() => handleLogout()}>{t('logout')}</button>&nbsp;Welcome, {auth.email}&nbsp;</div></>
                : <><button onClick={openLoginModal}>{t('login')}</button>&nbsp;|&nbsp;<button onClick={openRegisterModal}>{t('register')}</button></>
            }
            <Modal show={modal} handleClose={() => setModal(false)}>
                {modalType == 'login' && <Login switchTo={switchTo} handleClose={closeModal} />}
                {modalType == 'register' && <Register switchTo={switchTo} handleClose={closeModal} />}
                {modalType == 'forgot-password' && <ForgotPassword switchTo={switchTo} handleClose={closeModal} />}
            </Modal>
            <select onChange={handleLocaleChange} value={router.locale}>
                <option value="en">🇺🇸 English</option>
                <option value="fr">FR Français</option>
            </select>
            <button style={{ float: 'right' }}>Right</button>
            <br />
            <div>
                auth.id: {auth.id}&nbsp;
                auth.username: {auth.username}&nbsp;
                auth.points: {auth.points}&nbsp;
                {auth.points > 0 && <button onClick={resetPoints}>{t('reset')}</button>}
            </div>


            <div className={styles.topnav}>
                <div className={styles.topnavLeft}>
                    <img src="/logo.png" alt="logo" style={{ float: 'left', maxWidth: 50, verticalAlign: 'middle' }} />
                    <Link href="/">
                        <a>{t('home')}</a>
                    </Link>
                    <Link href="/about">
                        <a>{t('about')}</a>
                    </Link>
                    {auth.id ?
                        <>
                            <Link href="/account"><a>{t('account')}</a></Link>
                            <button className={styles.btn} onClick={() => handleLogout()}>{t('logout')}</button>
                            <span>Welcome, {auth.email}</span>
                        </>
                        : 
                        <>
                            <button onClick={openLoginModal}>{t('login')}</button>&nbsp;|&nbsp;<button onClick={openRegisterModal}>{t('register')}</button>
                        </>
                    }
                </div>

                <div className={styles.topnavRight}>
                    <a href="#search">Search</a>
                    <a href="#about">About</a>
                </div>
            </div> */}



            <header className={styles.topbar}>
                <div className={styles.logo}>
                    <img src="/logo.png" alt="logo" style={{ float: 'left', maxWidth: 50, verticalAlign: 'middle' }} />
                </div>
                <nav className={styles.navigation}>
                    <ul className={styles.navigationUl}>
                        <li className={styles.navigationLi}><Link href="/">
                            <a>{t('home')}</a>
                        </Link></li>
                        <li className={styles.navigationLi}><Link href="/about">
                            <a>{t('about')}</a>
                        </Link></li>
                        <li className={styles.navigationLi}>
                            <select onChange={handleLocaleChange} value={router.locale}>
                                <option value="en">🇺🇸 English</option>
                                <option value="fr">FR Français</option>
                            </select>
                        </li>
                        {auth &&
                            <>
                                <li className={styles.navigationLi}><b>{auth.points}&nbsp;points</b></li>
                                <li className={styles.navigationLi}>
                                    <button onClick={resetPoints}>{t('reset')}</button>
                                </li>
                            </>
                        }
                    </ul>
                </nav>
                <nav className={styles.user}>
                    {auth.id ?
                        <>
                            <ul className={styles.navigationUl}>
                                <li className={styles.navigationLi}>{t('welcome')}, {auth.email}!</li>
                                <li className={styles.navigationLi}><Link href="/account"><a>{t('account')}</a></Link></li>
                                <li className={styles.navigationLi}><button onClick={() => handleLogout()}>{t('logout')}</button>
                                </li>
                            </ul>
                        </>
                        :
                        <ul>
                            <li className={styles.navigationLi}><button onClick={openLoginModal}>{t('login')}</button></li>
                            <li className={styles.navigationLi}><button onClick={openRegisterModal}>{t('register')}</button></li>
                        </ul>
                    }
                </nav>
            </header>
            <Modal show={modal} handleClose={() => setModal(false)}>
                {modalType == 'login' && <Login switchTo={switchTo} handleClose={closeModal} />}
                {modalType == 'register' && <Register switchTo={switchTo} handleClose={closeModal} />}
                {modalType == 'forgot-password' && <ForgotPassword switchTo={switchTo} handleClose={closeModal} />}
            </Modal>
        </>
    )
}