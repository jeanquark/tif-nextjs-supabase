import type { NextApiRequest, NextApiResponse } from 'next'
import slugify from 'slugify'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    // res.status(200).json({ name: 'John Doe' })
    // try {
        console.log('API_FOOTBALL_KEY: ', process.env.API_FOOTBALL_KEY)

        // 1) Request data from Football API
        const fixtures = await fetch("https://v3.football.api-sports.io/fixtures?league=5&season=2022", {
            "method": "GET",
            "headers": {
                "x-apisports-key": process.env.API_FOOTBALL_KEY
            }
        })
        // console.log('data: ', data)
        const { response } = await fixtures.json()
        console.log('[api/api-football/fetchNextFixtures] response: ', response);
        
        // 2) Insert data in DB
        let array = []
        let venueSlug: string
        for (let i = 0; i < response.length; i++) {
            venueSlug = slugify(response[i]['fixture']['venue']['name'] || '', { lower: true })
            array.push({
                fixture_id: response[i]['fixture']['id'],
                home_team_id: response[i]['teams']['home']['id'],
                home_team_name: response[i]['teams']['home']['name'],
                home_team_image: `${response[i]['teams']['home']['id']}.png`,
                home_team_score: response[i]['goals']['home'],
                visitor_team_id: response[i]['teams']['away']['id'],
                visitor_team_name: response[i]['teams']['away']['name'],
                visitor_team_image: `${response[i]['teams']['away']['id']}.png`,
                visitor_team_score: response[i]['goals']['away'],
                venue_id: response[i]['fixture']['venue']['id'],
                venue_name: response[i]['fixture']['venue']['name'],
                venue_slug: venueSlug,
                city: response[i]['fixture']['venue']['city'],
                date: response[i]['fixture']['date'],
                timestamp: response[i]['fixture']['timestamp'],
                elapsed_time: response[i]['fixture']['status']['elapsed'],
                status: response[i]['fixture']['status']['short'],
                league_id: response[i]['league']['id'],
                round: response[i]['league']['round'],
                season: response[i]['league']['season'],
                // events: response[i]['events']
            })
        }
        // console.log('[api/api-football/fetchNextFixtures] array: ', array)

        const { error } = await supabase.from('events').upsert(array, { onConflict: 'fixture_id'})
        if (error) {
            return res.status(500).json({ success: false, message: error })
        }
        

        return res.status(200).json({ success: true, length: response.length });
    // } catch (error) {
    //     console.log(error)
    // }
}