import { useState, useEffect } from 'react'
import Link from 'next/link'
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


export default function Navbar() {
    const dispatch = useAppDispatch()
    const auth = useAppSelector(selectAuth)
    const [modal, setModal] = useState<boolean>(false)
    const [modalType, setModalType] = useState<string>('')
    // const [modal, setModal] = useState<string>('')
    // const [login, setLogin] = useState(false)
    const [loginModal, setLoginModal] = useState<boolean>(false)
    const [registerModal, setRegisterModal] = useState<boolean>(false)
    const [forgotPasswordModal, setForgotPasswordModal] = useState<boolean>(false)
    // const [registerModal, setRegisterModal] = useState(false)
    const [showModal2, setShowModal2] = useState(false)

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

    // const toggleModal = () => {
    //     setModal(!modal)
    // }
    const closeModal = () => {
        setModal(false)
    }

    const closeLoginModal = () => {
        console.log('closeLoginModal')
        setTimeout(() => {
            setShowModal2(false)
        }, 900)
    }

    const fetchUser = async (authUser) => {
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
        <div>
            <img src="/logo.png" alt="logo" style={{ maxWidth: 50, display: 'inline-block', verticalAlign: 'middle' }} />
            <Link href="/">
                <a>Home</a>
            </Link>&nbsp;|&nbsp;
            <Link href="/about" >
                <a>About</a>
            </Link>&nbsp;|&nbsp;
            <Link href="/counter" >
                <a>Counter</a>
            </Link>&nbsp;|&nbsp;
            {/* {auth.id ? 
                <div style={{ display: 'inline-block'}}><button onClick={() => handleLogout()}>Logout</button>&nbsp;<span>{auth.email}</span></div>
                : <Link href="/login"><a>Login</a></Link>
            } */}

            {/* modal: {modal} */}
            {/* modalType: {modalType} */}
            {auth.id ?
                <div style={{ display: 'inline-block' }}><button onClick={() => handleLogout()}>Logout</button>&nbsp;Welcome, {auth.email}&nbsp;<Link href="/account"><a>Account</a></Link></div>
                : <><button onClick={openLoginModal}>Login</button>&nbsp;|&nbsp;<button onClick={openRegisterModal}>Register</button></>
            }
            <Modal show={modal} handleClose={() => setModal(false)}>
                {/* <p>Modal</p> */}
                {modalType == 'login' && <Login switchTo={switchTo} handleClose={closeModal} />}
                {modalType == 'register' && <Register switchTo={switchTo} handleClose={closeModal} />}
                {modalType == 'forgot-password' && <ForgotPassword switchTo={switchTo} handleClose={closeModal} />}
            </Modal>
            <br />
            <div>
                auth.id: {auth.id}&nbsp;
                auth.username: {auth.username}&nbsp;
                auth.points: {auth.points}
            </div>
            {/* <div>
                {showModal2 ? <button onClick={() => setShowModal2(false)}>Close modal2</button> : <button onClick={() => setShowModal2(true)}>Open modal2</button>}
                {showModal2 && <Modal2 handleClose={() => closeLoginModal()}>Modal2</Modal2>}
            </div> */}
        </div>
    )
}