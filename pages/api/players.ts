import type { NextApiHandler } from 'next'
import { supabase } from '../../utils/supabaseClient'

type User = {
    id: number;
    email: string;
    points: number;
}

const playersHandler: NextApiHandler = async (request, response) => {

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const { data, error } = await supabase
        .from<User>('users')
        .select('id, email, points')
        .order('points', { ascending: false })

    console.log('data: ', data)
    console.log('error: ', error)
    if (error) {
        return response.status(500).send(error);
    }
    console.log('bypass error')
    return response.status(200).json(data)
}

export default playersHandler