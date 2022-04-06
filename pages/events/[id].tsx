import { ReactElement, useEffect, useState } from 'react'
import { supabase } from '../../utils/supabaseClient'
import Layout from '../../components/Layout'
import NestedLayout from '../../components/LayoutFrontend'
import axios from 'axios'
import { useRouter } from 'next/router'
import styles from '../../styles/Event.module.css'

interface Event {
    id: number,
    home_team_name: string,
    visitor_team_name: string
}

export default function EventPage() {
    const [data, setData] = useState(null)
    const [event, setEvent] = useState(null)

    const [isLoading, setLoading] = useState(false)
    const [updateEvent, handleUpdateEvent] = useState(null)
    const [clapCount, setClapCount] = useState(0)

    const router = useRouter()
    const { id } = router.query
    let subscriptionEvents = null
    let subscriptionEventActions = null

    const clap = async () => {
        console.log('clap')

        // Increment clap count for this event
        const { data, error } = await supabase.rpc('increment_clap_count_by_one', {
            row_id: 1
        })
        console.log('data: ', data);
        console.log('error: ', error);
    }

    useEffect(() => {
        console.log('[useEffect] id: ', id)
        if (id != undefined) {
            getEventAndSubscribe(+id)
            getEventActionsAndSubscribe(+id)
        }
        return () => {
            if (subscriptionEvents) {
                console.log('removeSubscription: ', subscriptionEvents)
                // supabase.removeSubscription(subscriptionEvents)
                supabase.removeAllSubscriptions()
            }
        }
    }, [id])

    useEffect(() => {
        try {
            console.log('[useEffect] updateEvent: ', updateEvent)
            if (updateEvent) {
                setEvent(updateEvent)
            }
        } catch (error) {
            console.log('error: ', error)
        }
    }, [updateEvent])

    const getInitialEvent = async (id) => {
        console.log('getInitialEvent')

        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', id)
        if (error) {
            console.log('error: ', error);
            supabase.removeSubscription(subscriptionEvents)
            subscriptionEvents = null
            return
        }
        console.log('data2: ', data);
        setEvent(data[0])
    }

    const getInitialEventActions = async (id) => {
        console.log('getInitialEventActions')
        const { data, error } = await supabase
            .from('event_actions2')
            .select('*')
            .eq('event_id', id)
        console.log('data: ', data);
        setClapCount(data[0].count)
    }

    const getEventAndSubscribe = async (id: number) => {
        console.log('getEventAndSubscribe. id: ', id)
        getInitialEvent(id)
        if (!subscriptionEvents) {
            subscriptionEvents = supabase
                .from(`events:id=eq.${id}`)
                .on('UPDATE', (payload) => {
                    console.log('UPDATE: ', payload)
                    handleUpdateEvent(payload.new)
                })
                .subscribe()
        } else {
            console.log('removeSubscription')
            supabase.removeSubscription(subscriptionEvents)
        }
    }
    const getEventActionsAndSubscribe = async (id: number) => {
        console.log('getEventActionsAndSubscribe. id: ', id);
        getInitialEventActions(id)
        if (!subscriptionEventActions) {
        subscriptionEventActions = supabase
            .from(`event_actions2:event_id=eq.${id}`)
            .on('UPDATE', (payload) => {
                console.log('UPDATE: ', payload)
                setClapCount(payload.new.count)
            })
            .subscribe()
        } else {
            console.log('removeSubscription')
            supabase.removeSubscription(subscriptionEventActions)
        }

        // const eventActions2 = supabase
        //     .from('event_actions2')
        //     .on('*', payload => {
        //         console.log('Change received!', payload)
        //     })
        //     .subscribe()
    }


    return (
        <>
            <div>
                <h1>Event page {event && event.id}</h1>
            </div>
            <div className={styles.parent}>
                {event && <div className={styles.childLeft}>
                    {event.home_team_name} vs {event.visitor_team_name}<br />
                    {event.home_team_score} {event.visitor_team_score}
                </div>}
                {event && <div className={styles.childRight}>
                    <h3>Actions</h3>
                    <button onClick={clap}>Applaudir</button>&nbsp;
                    ({clapCount})
                </div>}
            </div>
        </>
    )
}

EventPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            <NestedLayout>{page}</NestedLayout>
        </Layout>
    )
}
