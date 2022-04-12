import { ReactElement, useEffect, useState } from 'react'
import { supabase } from '../../utils/supabaseClient'
import Layout from '../../components/Layout'
import NestedLayout from '../../components/LayoutFrontend'
import axios from 'axios'
import { useRouter } from 'next/router'
import styles from '../../styles/Event.module.css'
import Counter from '../../features/counter/Counter'
import moment from 'moment'


import { useAppSelector, useAppDispatch } from '../../app/hooks'
import {
    selectActions,
    fetchActions
} from '../../features/actions/actionsSlice'
import { Card } from '../../components/UI/Card'


interface Event {
    id: number,
    home_team_name: string,
    visitor_team_name: string
}

export default function EventPage() {
    const dispatch = useAppDispatch()
    const [data, setData] = useState(null)
    const [event, setEvent] = useState(null)
    const actions = useAppSelector(selectActions)

    const [isLoading, setLoading] = useState<boolean>(false)
    const [updateEvent, handleUpdateEvent] = useState(null)
    const [clapCount, setClapCount] = useState(0)
    const [eventActions, setEventActions] = useState([])

    const router = useRouter()
    const { id } = router.query
    let subscriptionEvents = null
    let subscriptionEventActions = null


    useEffect(() => {
        console.log('[useEffect] subscribeToEvents id: ', id)
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
        console.log('[useEffect] fetchActions id: ', id)
        if (actions.length < 1) {
            dispatch(fetchActions());
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
            .from('event_actions')
            .select('*')
            .eq('event_id', id)
        console.log('event actions data: ', data)
        setEventActions(data)
    }

    const getEventAndSubscribe = async (id: number) => {
        console.log('getEventAndSubscribe. id: ', id)
        getInitialEvent(id)
        if (!subscriptionEvents) {
            subscriptionEvents = supabase
                .from(`events:id=eq.${id}`)
                .on('UPDATE', (payload) => {
                    console.log('UPDATE event: ', payload)
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
                .from(`event_actions:event_id=eq.${id}`)
                .on('UPDATE', (payload) => {
                    console.log('UPDATE eventActions: ', payload)
                    setClapCount(payload.new.count)
                })
                .subscribe()
        } else {
            console.log('removeSubscription')
            supabase.removeSubscription(subscriptionEventActions)
        }
    }

    const launchAction = async (id: number) => {
        try {
            console.log('lauchAction: ', id)
            const { data, error } = await supabase
                .from('event_actions')
                .insert([{
                    event_id: event.id,
                    action_id: id,
                    user_id: 3,
                    participation_threshold: 2
                }])
            console.log('launchAction data: ', data);
            if (error) {
                throw error
            }
            setEventActions([...eventActions, data[0]])
        } catch (error) {
            console.log('error: ', error);
        }
    }

    const clap = async () => {
        console.log('clap')

        // Increment clap count for this event
        const { data, error } = await supabase.rpc('increment_clap_count_by_one', {
            row_id: 1
        })
        console.log('data: ', data);
        console.log('error: ', error);
    }

    const joinAction = async (eventActionId: number) => {
        try {
            // 1) Add auth user to event_actions_users table
            const { error: errorInsert } = await supabase.from('event_actions_users').insert([
                {
                    event_action_id: eventActionId,
                    user_id: 3,
                },
            ])
            if (errorInsert) {
                console.log('error1: ', errorInsert)
                throw errorInsert
            }

            // 2) Increment counter
            const { error: errorIncrement } = await supabase.rpc('increment_participation_count_by_one', { row_id: eventActionId })
            if (errorIncrement) {
                console.log('errorIncrement: ', errorIncrement)
                throw errorIncrement
            }
        } catch (error) {
            console.log('error: ', error);
        }
    }

    const deleteAction = async (eventActionId: number) => {
        const { data, error } = await supabase
            .from('event_actions')
            .delete()
            .match({ id: eventActionId })
        console.log('error: ', error)

        let array = [...eventActions]; // make a separate copy of the array
        const index = array.findIndex(action => action.id === eventActionId)
        if (index !== -1) {
            array.splice(index, 1);
            setEventActions(array);
        }

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
                        {actions.map((action, index) => {
                            return <Card key={index}>
                                ID: {action.id}&nbsp;
                                Name: {action.name}&nbsp;
                                <button onClick={() => launchAction(action.id)}>Launch</button>
                            </Card>
                        })}
                    {/* <button onClick={clap}>Applaudir</button>&nbsp; */}
                    {/* ({clapCount})<br /> */}
                    {/* <button onClick={() => launchAction('hola')}>Lancer holà</button> */}
                    <ul>{eventActions.map((action, index) => {
                        return <li key={action.id}>
                            ID: {action.id} - {action.name} - #participants: {action.number_participants} - date: {moment(action.inserted_at).format('HH:mm')}&nbsp;
                            <button onClick={() => joinAction(action.id)}>Join</button>&nbsp;
                            <button onClick={() => deleteAction(action.id)}>Delete</button>
                        </li>
                    })}</ul>
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
