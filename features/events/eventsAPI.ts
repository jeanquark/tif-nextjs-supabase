import { supabase } from "../../utils/supabaseClient"

// export async function getEvents(date1, date2) {
export async function getEvents(date1, date2) {

    // const response = await fetch('/api/counter', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ amount }),
    // })
    // const result = await response.json()

    const { data, error } = await supabase
        .from('events')
        .select('id, home_team_name, visitor_team_name, home_team_score, visitor_team_score, status, date, timestamp, updated_at')
        // .eq('date', date)
        .gt('timestamp', date1)
        .lt('timestamp', date2)
        .order('timestamp', { ascending: true })
    console.log('[REDUX] @eventsAPI data: ', data)
    console.log('error: ', error);
    return data
}
