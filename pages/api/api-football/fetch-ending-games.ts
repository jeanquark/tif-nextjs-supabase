import type { NextApiRequest, NextApiResponse } from 'next'
import slugify from 'slugify'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {

    console.log('[api/api-football/fetch-ending-games]', new Date())
    // return res.status(200).json({ success: true });
    
    
    // 3) Find all events that have a status not equal to FT && an elapsed time > 85 
    const { data, error } = await supabase.from('events').select('*').not('status', 'eq', 'FT').gt('elapsed_time', 85)

    // if (parseInt(match.val().elapsed) > 85) {
    //     matchesArray.push({
    //         id: match.val().id, 
    //         league_id: match.val().league_id,
    //         league_slug: match.val().league_slug,
    //         elapsed: match.val().elapsed
    //     });
    // }

    return res.status(200).json({ success: true, length: data.length });
}