import type { NextApiHandler } from 'next'
// import { supabase } from '../../utils/supabaseClient'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

type User = {
    id: number;
    email: string;
    username: string;
    points: number;
}

const usersHandler: NextApiHandler = async (request, response) => {

    // await new Promise((resolve) => setTimeout(resolve, 1500))

    const { data, error } = await supabase
        .from<User>('users')
        .select('id, email, username, points')
        // .select('*')
        .order('points', { ascending: false })

    // console.log('data: ', data)
    // console.log('error: ', error)
    if (error) {
        return response.status(500).send(error);
    }
    // console.log('bypass error')
    return response.status(200).json(data)
}

export default usersHandler