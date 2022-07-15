import type { NextApiRequest, NextApiResponse } from 'next'
import slugify from 'slugify'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    console.log('API_FOOTBALL_KEY: ', process.env.API_FOOTBALL_KEY)

    // 1) Request data from Football API
    const fixtures = await fetch("https://v3.football.api-sports.io/teams?league=207&season=2022", {
        "method": "GET",
        "headers": {
            "x-apisports-key": process.env.API_FOOTBALL_KEY
        }
    })
    // console.log('data: ', data)
    const { response } = await fixtures.json()
    console.log('[api/api-football/fetchTeams] response: ', response);

    // 2) Insert data in DB
    let array = []
    let teamSlug: string
    for (let i = 0; i < response.length; i++) {
        teamSlug = slugify(response[i]['team']['name'] || '', { lower: true })
        array.push({
            api_football_id: response[i]['team']['id'],
            name: response[i]['team']['name'],
            slug: teamSlug,
            national: response[i]['team']['national'],
            country: response[i]['team']['country'],
            image: `${response[i]['team']['id']}.png`
        })
    }
    // console.log('[api/api-football/fetchNextFixtures] array: ', array)

    const { error } = await supabase.from('teams').upsert(array, { onConflict: 'api_football_id' })
    if (error) {
        return res.status(500).json({ success: false, message: error })
    }


    return res.status(200).json({ success: true, length: response.length });
}