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
import { Modal } from '../components/UI/Modal'
import { Modal2 } from '../components/UI/Modal2'

const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
}


export default function Navbar() {
    const dispatch = useAppDispatch()
    const auth = useAppSelector(selectAuth)
    const [modal, setModal] = useState<boolean>(false)
    // const [login, setLogin] = useState(false)
    const [loginModal, setLoginModal] = useState<boolean>(false)
    // const [registerModal, setRegisterModal] = useState(false)
    const [showModal2, setShowModal2] = useState(false)

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
        setModal(!modal)
    }
    const closeModal = () => {
        setModal(false)
    }

    const toggleLoginModal = () => {
        console.log('toggleLoginModal')
        setLoginModal(!loginModal)
    }

    const closeLoginModal = () => {
        console.log('closeLoginModal')
        setTimeout(() => {
            setShowModal2(false)
        }, 900)
    }

    useEffect(() => {
        const session = supabase.auth.session()
        console.log('[useEffect Navbar] session: ', session)
        const authUser = session?.user

        if (authUser) {
            const fetchUser = async () => {
                const { data } = await supabase.from('users').select('*').eq('auth_user_id', authUser.id).limit(1).single()
                console.log('data2: ', data)

                dispatch(setAuthUser({
                    id: data.id,
                    email: authUser.email,
                    role: authUser.role
                }))
            }
            fetchUser()

            
            
        }

        // const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        //     console.log('[useEffect Navbar] onAuthStateChange session: ', session, new Date());

        //     dispatch(setAuthUser({
        //         id: session?.user.id,
        //         email: session?.user.email,
        //         role: session?.user.role
        //     }))
        // })
        // return () => {
        //     listener?.unsubscribe()
        // }
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
            auth.id: {auth.id}
            {auth.id ?
                <div style={{ display: 'inline-block' }}><button onClick={() => handleLogout()}>Logout</button>&nbsp;<span>{auth.email}</span></div>
                : <><button onClick={openLoginModal}>Login</button>&nbsp;|&nbsp;<button onClick={openRegisterModal}>Register</button></>
            }
            <Modal show={modal} handleClose={() => setModal(false)}>
                {/* <p>Modal</p> */}
                {loginModal ? <Login toggleModal={toggleModal} /> : <Register toggleModal={toggleModal} />}
            </Modal>
            <br />
            <div>
                {/* <Modal show={modal} handleClose={closeModal}>
				<p>Modal</p>
			</Modal>
			<button type="button" onClick={toggleModal}>Open modal</button> */}
            </div>
            <div>
                {showModal2 ? <button onClick={() => setShowModal2(false)}>Close modal2</button> : <button onClick={() => setShowModal2(true)}>Open modal2</button>}
                {showModal2 && <Modal2 handleClose={() => closeLoginModal()}>Modal2</Modal2>}
            </div>
        </div>
    )
}