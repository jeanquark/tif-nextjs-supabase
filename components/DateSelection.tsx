import { useState } from 'react'
import Moment from 'react-moment';
import moment from 'moment'

import { supabase } from '../utils/supabaseClient'
import styles from '../styles/Home.module.css'

const fetchEventsByDate = async (day: number) => {
    const date1 = moment().add(day - 1, 'd').unix()
    const date2 = moment().add(day + 1, 'd').unix()
    console.log('date1: ', date1)
    console.log('date2: ', date2)

	const { data, error } = await supabase
		.from('events')
		.select('id, home_team_name, visitor_team_name, home_team_score, visitor_team_score, status, date, timestamp, updated_at')
		// .eq('date', date)
        .gt('timestamp', date1)
        .lt('timestamp', date2)
		.order('timestamp', { ascending: true })
    console.log('data: ', data)
    console.log('error: ', error)

    // Load data in Store
}

export default function DateSelection () {
    const [date, setDate] = useState<Date>();

    return (<ul className={styles.ul}>
        <li onClick={() => fetchEventsByDate(-2)}><Moment format="DD MMM" subtract={{ days: 2 }}>{date}</Moment></li>
        <li onClick={() => fetchEventsByDate(-1)}>Hier</li>
        <li onClick={() => fetchEventsByDate(0)}>Aujourd'hui</li>
        <li onClick={() => fetchEventsByDate(1)}>Demain</li>
        <li onClick={() => fetchEventsByDate(2)}><Moment format="DD MMM" add={{ days: 2 }}>{new Date()}</Moment></li>
    </ul>)
}