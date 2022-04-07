import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../utils/supabaseClient'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import {
    loginUser,
    setAuthUser,
    selectAuth
} from '../features/auth/authSlice'
import { Modal } from '../components/UI/Modal'
import Login from '../components/Login'
import Register from '../components/Register'

const handleLogout = async() => {
    const { error } = await supabase.auth.signOut()
}


export default function Navbar() {
    const dispatch = useAppDispatch()
    const auth = useAppSelector(selectAuth)
	const [modal, setModal] = useState<boolean>(false)
    // const [login, setLogin] = useState(false)
	const [loginModal, setLoginModal] = useState<boolean>(false)
	// const [registerModal, setRegisterModal] = useState(false)

    const openLoginModal = () => {
        setLoginModal(true)
        setModal(true)
    }
    const openRegisterModal = () => {
        setLoginModal(false)
        setModal(true)
    }

    const switchTo = (where: string) => {
        console.log('switchTo')
    }

    const toggleModal = () => {
        console.log('toggleModal')
        setLoginModal(!loginModal)
      }

    useEffect(() => {
        const session = supabase.auth.session()
        console.log('[useEffect Navbar] session: ', session)
        const authUser = session?.user
        if (authUser) {
            dispatch(setAuthUser({
                id: authUser.id,
                email: authUser.email,
                role: authUser.role
            }))
        }
    
        supabase.auth.onAuthStateChange((_event, session) => {
            console.log('[useEffect Navbar] onAuthStateChange session: ', session);
            dispatch(setAuthUser({
                id: session?.user.id,
                email: session?.user.email,
                role: session?.user.role
            }))
        })
      }, [])
    return (
        <div>
            <img src="/logo.svg" alt="logo" style={{ maxWidth: 30 }} />
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
            {auth.id ? 
                <div style={{ display: 'inline-block'}}><button onClick={() => handleLogout()}>Logout</button>&nbsp;<span>{auth.email}</span></div>
                : <><button onClick={openLoginModal}>Login</button>&nbsp;|&nbsp;<button onClick={openRegisterModal}>Register</button></>
            }
            <Modal show={modal} handleClose={() => setModal(false)}>
				{/* <p>Modal</p> */}
                {loginModal ? <Login toggleModal={toggleModal} /> : <Register toggleModal={toggleModal} />}
			</Modal>
        </div>
    )
}