import { useState, useEffect } from 'react';
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleUp, faCertificate, faDollarSign, faStar } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { supabase } from '../utils/supabaseClient';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
    loginUser,
    setAuthUser,
    selectAuth
} from '../features/auth/authSlice'
import LoginModal from '../components/LoginModal'
import RegisterModal from '../components/RegisterModal'
import ForgotPassword from '../components/ForgotPassword'
import { Modal } from '../components/UI/Modal'
import { Modal2 } from '../components/UI/Modal2'
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
            <header>
                <div className="row mb-2">
                    <div className="col">
                        <span className={classNames(styles.menuBox, styles.orangered)}><FontAwesomeIcon
                            icon={faStar}
                            style={{ fontSize: 20 }}
                        />&nbsp;Niv. 1 -&nbsp;
                            <FontAwesomeIcon
                                icon={faAngleDoubleUp}
                                style={{ fontSize: 20 }}
                            />&nbsp;1/10</span>
                    </div>
                    <div className="col">
                        <span className={classNames(styles.menuBox, styles.green)}><FontAwesomeIcon
                            icon={faDollarSign}
                            style={{ fontSize: 20 }}
                        />&nbsp;500</span>
                    </div>
                    <div className="col">
                        <span className={classNames(styles.menuBox, styles.yellow)}><FontAwesomeIcon
                            icon={faCertificate}
                            style={{ fontSize: 20 }}
                        />&nbsp;5</span>
                    </div>
                </div>

                {auth?.id ?
                    <div className="row align-items-center">
                        <div className="col col-lg-1">
                            <div className={classNames(styles.link, styles.boxShadow)}>
                                <Link href="/avatar">
                                    <Image src="/images/avatar.png" alt="avatar icon" width="100%" height="100%" />
                                </Link>
                            </div>
                        </div>
                        <div className={classNames("col col-lg-10 align-self-stretch", styles.boxShadow)} style={{ border: '0px dashed grey' }}>
                            <div className="d-flex flex-row justify-content-center align-items-center h-100" style={{ border: '0px dashed pink' }}>
                                <div className="d-flex align-items-center px-2" style={{ border: '0px dashed grey' }}>
                                    <Image src="/images/163.png" alt="flag icon" width="60px" height="60px" />
                                    <span className={classNames(styles.textSubTitle)} style={{ border: '0px dashed purple' }}>{ auth.username || auth.email }</span>
                                </div>
                                <div className="d-flex align-items-center px-2" style={{ border: '0px dashed grey' }}>
                                    <Image src="/images/cup.png" alt="cup icon" width="60px" height="60px" />
                                    <span className={classNames(styles.textSubTitle)} style={{ border: '0px dashed purple' }}>1863ème</span>
                                </div>
                                <span className="text-white" onClick={() => handleLogout()}>{t('logout')}</span>
                            </div>
                        </div>
                        <div className="col col-lg-1">
                            <div className={styles.boxShadow} style={{ border: '0px dashed grey' }}>
                                <Link href="/parameters">
                                <Image src="/images/parameters.png" alt="parameters icon" width="100%" height="100%" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    :
                    <div>
                        <div className="row">
                            <div className="col col-md-6 text-center">
                                <div className={styles.boxShadow} data-bs-toggle="modal" data-bs-target="#loginModal">
                                    <p className={classNames("my-0 py-2", styles.textSubTitle)} >
                                        Login
                                    </p>
                                </div>
                            </div>
                            <div className="col col-md-6 text-center">
                                <div className={styles.boxShadow} data-bs-toggle="modal" data-bs-target="#registerModal">
                                    <p className={classNames("my-0 py-2", styles.textSubTitle)} >
                                        Senregistrer
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </header>

            <LoginModal />
            <RegisterModal />

        </>
    )
}