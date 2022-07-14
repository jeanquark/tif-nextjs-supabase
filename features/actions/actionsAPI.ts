import { supabase } from "../../utils/supabaseClient"

export async function getActions() {
    // const response = await fetch('/api/counter', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ amount }),
    // })
    // const result = await response.json()

    const { data, error } = await supabase
        .from('actions')
        .select('*')
    console.log('[REDUX] @actionsAPI data: ', data)
    return data
}