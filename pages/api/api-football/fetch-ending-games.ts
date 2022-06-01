import type { NextApiRequest, NextApiResponse } from 'next'
import slugify from 'slugify'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {

    console.log('[api/api-football/fetch-ending-games]', new Date())
    // return res.status(200).json({ success: true });
    type Event = {
        fixture_id: string
    }
    
    // 1) Find all events that have a status not equal to FT && an elapsed time > 85 
    const { data, error } : any = await supabase.from('events').select('fixture_id').not('status', 'eq', 'FT').gt('elapsed_time', 85)
    // const { data, error } : any = await supabase.from('events').select('fixture_id').eq('status', 'FT').gt('elapsed_time', 85)
    console.log('data.length: ', data.length);

    // 2) Fetch fixture status for those events in API-Football
    let fixturesUpdated = 0
    for (let i = 0; i < data.length; i++) {
        console.log('data[i][fixture_id]: ', data[i]['fixture_id'])
        const fixture = await fetch(`https://v3.football.api-sports.io/fixtures?id=${data[i]['fixture_id']}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': process.env.API_FOOTBALL_KEY,
                'x-rapidapi-host': 'v3.football.api-sports.io',
            }
        })
        const { response } = await fixture.json()
        // console.log('response: ', response);

        // 3) Update DB with the fixture data
        if (response[0]) {
            let obj = {
                fixture_id: response[0]['fixture']['id'],
                home_team_score: response[0]['goals']['home'],
                visitor_team_score: response[0]['goals']['away'],
                elapsed_time: response[0]['fixture']['status']['elapsed'],
                status: response[0]['fixture']['status']['short'],
                events: response[0]['events'],
            }
            const { error } = await supabase.from('events').upsert(obj, { onConflict: 'fixture_id' })
            if (error) {
                console.log('error: ', error);
            }
            fixturesUpdated++
        } 
    }

    return res.status(200).json({ success: true, fixturesUpdated });
}