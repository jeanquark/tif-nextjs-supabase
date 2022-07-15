import { supabase } from "../../utils/supabaseClient"

export async function getEventActions({ id }) {
    // const response = await fetch('/api/counter', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ amount }),
    // })
    // const result = await response.json()

    const { data, error } = await supabase
            .from('event_actions')
            .select(`id, number_participants, participation_threshold, is_completed, action:actions (name, image), event:events (home_team_name, visitor_team_name), team_id, user_id, username, inserted_at`)
            .eq('event_id', id)
            // .gt('expired_at', moment().utc())
            .order('id', { ascending: false })
    console.log('[REDUX] @eventActionsAPI data: ', data)
    return data
}