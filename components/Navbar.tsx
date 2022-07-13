import { useState, useEffect, useRef } from 'react';
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleUp, faCertificate, faDollarSign, faStar } from '@fortawesome/free-solid-svg-icons';
// import mergeImages from 'merge-images';
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

type ImagesToMerge = {
    background: string
    skin: string
    eyes: string
    mouth: string
    beard: string
    hair: string
}

export default function Navbar() {
    const dispatch = useAppDispatch()
    const auth = useAppSelector(selectAuth)
    const router = useRouter()
    // const ref = useRef(null)
    const [modal, setModal] = useState<boolean>(false)
    const [modalType, setModalType] = useState<string>('')
    // const [modal, setModal] = useState<string>('')
    // const [login, setLogin] = useState(false)
    const [loginModal, setLoginModal] = useState<boolean>(false)
    const [registerModal, setRegisterModal] = useState<boolean>(false)
    const [forgotPasswordModal, setForgotPasswordModal] = useState<boolean>(false)
    // const [registerModal, setRegisterModal] = useState(false)
    const [showModal2, setShowModal2] = useState(false)
    const { t } = useTranslation(['home'])
    const [showModal, setShowModal] = useState<boolean>(false)
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    const [objectOfImagesToMerge, setObjectOfImagesToMerge] = useState<ImagesToMerge>()

    // useEffect(() => {
    //     console.log('auth.image: ', auth.image)
    //     console.log('JSON.stringify auth.image: ', JSON.stringify(auth.image))
    //     let abc
    //     if (auth.image) {
    //         abc = JSON.parse(JSON.stringify(auth.image))
    //         console.log('auth.image.background: ', abc.background)

    //         setObjectOfImagesToMerge({
    //             ['background']: `/images/avatars/background/${abc['background']}.png`,
    //             ['skin']: `/images/avatars/skin/${abc['skin']}.png`,
    //             ['eyes']: `/images/avatars/eyes/${abc['eyes']}.png`,
    //             ['mouth']: `/images/avatars/mouth/${abc['mouth']}.png`,
    //             ['beard']: `/images/avatars/beard/${abc['beard']}.png`,
    //             ['hair']: `/images/avatars/hair/${abc['hair']}.png`
    //         })
    //         // merge()
    //     }
    // }, [auth])

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
                points: data.points,
                image: data.image
            }))
        }
    }

    // const merge = async () => {
    //     try {
    //         const imagesArray = Object.values(objectOfImagesToMerge)
    //         console.log('imagesArray: ', imagesArray)
    //         const b64 = await mergeImages(imagesArray)
    //         ref.current.src = b64
    //         // const b64 = await mergeImages(['/images/body.png', '/images/eyes.png', '/images/mouth.png'])
    //         // ref.current.src = b64;
    //     } catch (error) {
    //         console.log('error: ', error)
    //     }
    // }

    const handleLogout = async () => {
        console.log("logout")
        const { error } = await supabase.auth.signOut()
        if (error) {
            return error
        }
        dispatch(setAuthUser({
            id: null,
            email: null,
            username: null,
            role: null,
            points: 0,
            image: null
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
                            <div className={classNames("p-1", styles.link, styles.boxShadow)}>
                                {auth.id ?
                                    <Link href="/avatar">
                                        <a>
                                            {/* <Image src="/images/avatar.png" alt="avatar icon" width="100%" height="100%" /> */}
                                            {/* <Image src={`https://buzgvkhmtkqhimaziafs.supabase.co/storage/v1/object/public/avatars/public/${auth.id}.png`} width="100%" height="100%" style={{ border: '0px solid red' }} /> */}
                                            <img src={`https://buzgvkhmtkqhimaziafs.supabase.co/storage/v1/object/public/avatars/public/${auth.id}.png`} width="100%" />
                                            {/* <img src="" ref={ref} width="100%" style={{ border: '0px solid red' }} /> */}
                                        </a>
                                    </Link>
                                    :
                                    <Link href="/avatar">
                                        <a>
                                            <Image src="/images/avatar.png" alt="avatar icon" width="100%" height="100%" />
                                        </a>
                                    </Link>
                                }
                            </div>
                        </div>
                        <div className={classNames("col col-lg-10 align-self-stretch", styles.boxShadow)} style={{ border: '0px dashed grey' }}>
                            <Link href="/profile">
                                <div className="d-flex flex-row justify-content-center align-items-center h-100" style={{ border: '2px dashed pink' }}>
                                    <div className="d-flex align-items-center px-2" style={{ border: '0px dashed grey' }}>
                                        <Image src="/images/163.png" alt="flag icon" width="60px" height="60px" />
                                        <span className={classNames(styles.textSubTitle)} style={{ border: '0px dashed purple' }}>{auth.username || auth.email}</span>

                                    </div>
                                    <div className="d-flex align-items-center px-2" style={{ border: '0px dashed grey' }}>
                                        <Image src="/images/cup.png" alt="cup icon" width="60px" height="60px" />
                                        <span className={classNames(styles.textSubTitle)} style={{ border: '0px dashed purple' }}>1863ème</span>
                                    </div>
                                    <span className="btn btn-sm text-white float-right" style={{ background: "orangered" }} onClick={() => handleLogout()}>{t('logout')}</span>
                                    <span>auth.image: {auth.id}</span>
                                </div>
                            </Link>
                        </div>
                        <div className="col col-lg-1">
                            <div className={styles.boxShadow} style={{ border: '0px dashed grey' }}>
                                <Link href="/parameters" passHref>
                                    <a>
                                        <Image src="/images/parameters.png" alt="parameters icon" width="100%" height="100%" />
                                    </a>
                                </Link>
                            </div>
                        </div>
                    </div>
                    :
                    <div>
                        <div className="row">
                            <div className="col col-md-6 text-center">
                                <div className={styles.boxShadow} onClick={handleShow}>
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

            <LoginModal show={show} handleClose={handleClose} />
            <RegisterModal />

        </>
    )
}