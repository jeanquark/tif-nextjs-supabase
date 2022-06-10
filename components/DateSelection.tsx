import { useEffect, useState } from 'react'
import Moment from 'react-moment';
import moment from 'moment'
import { useTranslation } from 'next-i18next';

import { supabase } from '../utils/supabaseClient'
import styles from '../styles/Home.module.css'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { selectEvents, setEvents, fetchEvents } from '../features/events/eventsSlice'


export default function DateSelection () {
    const [date, setDate] = useState<Date>();
    const [day, setDay] = useState<number>(0)
    const dispatch = useAppDispatch()
    const events = useAppSelector(selectEvents)
    const { t } = useTranslation(['common', 'home']);

    useEffect(() => {
        console.log('[useEffect] day: ', day)

        const datesInterval = {
            date1: moment().add(day, 'd').startOf('day').unix(),
            date2: moment().add(day, 'd').endOf('day').unix()
        }
        console.log('moment().unix(): ', moment().unix())
        // if (events && events.length < 1) {
            dispatch(fetchEvents(datesInterval));
        // }
    }, [day])

    const fetchEventsByDate = async (day: number) => {
        console.log('fetchEventsByDate')
        // const date1 = moment().add(day - 1, 'd').unix()
        // const date2 = moment().add(day + 1, 'd').unix()
        // console.log('date1: ', date1)
        // console.log('date2: ', date2)
    
        // const { data, error } = await supabase
        //     .from('events')
        //     .select('id, home_team_name, visitor_team_name, home_team_score, visitor_team_score, status, date, timestamp, updated_at')
        //     // .eq('date', date)
        //     .gt('timestamp', date1)
        //     .lt('timestamp', date2)
        //     .order('timestamp', { ascending: true })
        // console.log('data: ', data)
        // console.log('error: ', error)
        
        // // Load data in Store
        // dispatch(setEvents(data))

        const datesInterval = {
            date1: moment().add(day - 1, 'd').unix(),
            date2: moment().add(day + 1, 'd').unix()
        }
        dispatch(fetchEvents(datesInterval));
    }

    return (<ul className={styles.ul}>
        <li className={`${day == -2 ? styles.active : ""}`} onClick={() => setDay(-2)}><Moment format="DD MMM" subtract={{ days: 2 }}>{date}</Moment></li>
        <li className={`${day == -1 ? styles.active : ""}`} onClick={() => setDay(-1)}>{t('yesterday')}</li>
        <li className={`${day == 0 ? styles.active : ""}`} onClick={() => setDay(0)}>{t('today')}</li>
        <li className={`${day == 1 ? styles.active : ""}`} onClick={() => setDay(1)}>{t('tomorrow')}</li>
        <li className={`${day == 2 ? styles.active : ""}`} onClick={() => setDay(2)}><Moment format="DD MMM" add={{ days: 2 }}>{new Date()}</Moment></li>
    </ul>)
}