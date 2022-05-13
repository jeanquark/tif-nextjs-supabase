import { ReactElement, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../app/hooks'

import { supabase } from '../utils/supabaseClient'
import { selectAuth, setUsername } from '../features/auth/authSlice'
import Layout from '../components/Layout'

import NestedLayout from '../components/LayoutFrontend'

export default function Account() {
    const auth = useAppSelector(selectAuth)
    const dispatch = useAppDispatch()

    const [loading, setLoading] = useState<boolean>(false)
    const [username, setUsername2] = useState<string>('')

    const handleUpdateAccount = async (username: string) => {
        try {
            console.log('handleUpdateAccount: ', username)
            const { data, error } = await supabase.from('users').update({ username }).match({ id: auth.id })
            dispatch(setUsername(username))
            alert('Successfully updated username!')
        } catch (error) {
            alert('Sorry, an error occured.')
            console.log('error: ', error)
        }
    }

    return (
        <>
            <h2>Update username</h2>
            {auth.username}
            <div>
                <input className="inputField" type="text" placeholder="Your username" value={username} onChange={(e) => setUsername2(e.target.value)} />
            </div>
            <br />
            <div>
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        handleUpdateAccount(username)
                    }}
                    className="button block"
                    disabled={loading}
                >
                    <span>{loading ? 'Loading' : 'Update'}</span>
                </button>
                &nbsp;
            </div>
        </>
    )
}

Account.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            <NestedLayout>{page}</NestedLayout>
        </Layout>
    )
}
