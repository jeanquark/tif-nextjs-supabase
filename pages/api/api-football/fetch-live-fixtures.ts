import type { NextApiRequest, NextApiResponse } from 'next'
import slugify from 'slugify'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {

    // console.log('[api/api-football/fetch-live-fixtures]', new Date())
    // return res.status(200).json({ success: true });
    
    const fixtures = await fetch('https://v3.football.api-sports.io/fixtures?league=2&live=all', { // ID UEFA Champions League: 2, ID UEFA Nations League: 5
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.API_FOOTBALL_KEY,
            'x-rapidapi-host': 'v3.football.api-sports.io',
        },
    })
    const { response } = await fixtures.json()


    // 2) Update DB
    let array = []
    for (let i = 0; i < response.length; i++) {
        array.push({
            fixture_id: response[i]['fixture']['id'],
            home_team_score: response[i]['goals']['home'],
            visitor_team_score: response[i]['goals']['away'],
            // events: response[i]['events']
            elapsed_time: response[i]['fixture']['status']['elapsed'],
            updated_at: new Date()
        })
    }
    console.log('[api/api-football] array: ', array)
    const { error } = await supabase.from('events').upsert(array, { onConflict: 'fixture_id' })
    console.log('[api/api-football] error: ', error)

    return res.status(200).json({ success: true, length: response.length });
}