import { useEffect, useState } from "react"
import axios from 'axios'
import { supabase } from '../utils/supabaseClient'
import { useTranslation } from "next-i18next"

function Standing() {
    // NextJS Client side request
    const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(false)
	const { t } = useTranslation(['home'])


    interface User {
        id: string
        email: string
        username: string
        points: number
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('[useEffect] Standing')
                setLoading(true)

                const { data } = await axios.get('/api/users')
                console.log('data: ', data)
                setLoading(false)
                setData(data)
            } catch (error) {
                console.log('error: ', error);
            } finally {
                console.log('finally');
                setLoading(false)
            }
        }
        fetchData()
        // .catch(console.log('an error occured'))
        console.log('Done!')
    }, [])

    if (isLoading) return <p>Loading...</p>
    if (!data) return <p>No data</p>

    return (
        <>
            <h3>{t('standing')}</h3>
            <ul>
                {data.map((user: User) =>
                    <li key={user.id}>
                        {user.username ? user.username : user.email}&nbsp;<b>{user.points}</b> points
                    </li>
                )}
            </ul>
        </>

    )
}

export default Standing