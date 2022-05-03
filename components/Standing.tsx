import { useEffect, useState } from "react"
import axios from 'axios'

function Standing() {
    // NextJS Client side request
    const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(false)

    interface User {
        id: string
        email: string
        points: number
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('[useEffect] Standing')
                setLoading(true)
                // const response = await fetch('api/players')
                // console.log('response: ', response);
                // const data = await response.json()
                const { data } = await axios.get('/api/players')
                console.log('data: ', data)
                setLoading(false)
                setData(data)
            } catch (error) {
                console.log('error: ', error);
            } finally {
                console.log('finally');
                setLoading(false)
            }
            // .then((res) => res.json())
            //     .then((data) => {
            //         setData(data)
            //         setLoading(false)
            //     })
        }
        fetchData()
        // .catch(console.log('an error occured'))
        console.log('Done!')
    }, [])

    if (isLoading) return <p>Loading...</p>
    if (!data) return <p>No data</p>

    return (
        <>
            <h3>Players Standing</h3>
            <ul>
                {data.map((user: User) =>
                    <li key={user.id}>
                        {user.email}
                    </li>
                )}
            </ul>
        </>

    )
}

export default Standing