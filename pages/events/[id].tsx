import { ReactElement, useEffect, useState, useRef } from 'react'
import { supabase } from '../../utils/supabaseClient'
import Layout from '../../components/Layout'
import NestedLayout from '../../components/LayoutFrontend'
import axios from 'axios'
import { useRouter } from 'next/router'
import styles from '../../styles/Event.module.css'
import Counter from '../../features/counter/Counter'
import moment from 'moment'


import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { selectAuth } from '../../features/auth/authSlice'
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

interface Action {
    id: number,
    name: string,
    slug?: string,
    image?: string
}

export default function EventPage() {
    const dispatch = useAppDispatch()
    const auth = useAppSelector(selectAuth)
    const [data, setData] = useState(null)
    const [event, setEvent] = useState(null)
    const actions = useAppSelector(selectActions)
    const actionsRef = useRef<Action[]>()
    actionsRef.current = actions

    const [isLoading, setLoading] = useState<boolean>(false)
    const [updateEvent, handleUpdateEvent] = useState(null)
    const [eventActions, setEventActions] = useState([])
    const eventActionsRef = useRef<any>()
    eventActionsRef.current = eventActions
    const [userActions, setUserActions] = useState([])

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
        console.log('[useEffect] getInitialUserActions auth: ', auth)
        if (auth && auth.id) {
            getInitialUserActions(+auth.id)
        }
    }, [auth])

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

    const getInitialEvent = async (id: number) => {
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

    const getInitialEventActions = async (id: number) => {
        console.log('getInitialEventActions')
        const { data, error } = await supabase
            .from('event_actions')
            .select('id, number_participants, participation_threshold, actions (name, image), events (home_team_name, visitor_team_name), users (id, username), inserted_at')
            .eq('event_id', id)
            // .gt('expired_at', moment().utc())
            .order('id', { ascending: false })
        if (error) {
            return
        }
        console.log('event actions data: ', data)
        setEventActions(data)
    }

    const getInitialUserActions = async (userId: number) => {
        const { data, error } = await supabase
            .from('event_actions_users')
            .select('*')
            .eq('user_id', userId)
            .order('id', { ascending: false })
        if (error) {
            return
        }
        setUserActions(data)
        // data.forEach((a) => {
        //     setUserActions[a.id] = a
        // })
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
            console.log('Not subscribed to eventActions')
            subscriptionEventActions = supabase
                .from(`event_actions:event_id=eq.${id}`)
                .on('INSERT', payload => {
                    console.log('[INSERT] newEventAction payload: ', payload.new)

                    const action = actionsRef.current.find((action) => action.id == payload.new.action_id)
                    console.log('action: ', action)
                    const newEventAction = {
                        actions: {
                            name: action.name,
                            image: action.image,
                        },
                        ...payload.new,
                    }
                    setEventActions((a) => [newEventAction, ...a])
                })
                .on('UPDATE', (payload) => {
                    console.log('UPDATE eventActions: ', payload)
                    console.log('eventActionsRef: ', eventActionsRef);
                    console.log('payload.new.id: ', payload.new.id);

                    const index = eventActionsRef.current.findIndex(action => action.id == payload.new.id)
                    console.log('index: ', index)
                    // 1. Make a shallow copy of the items
                    let items = [...eventActionsRef.current];
                    // 2. Make a shallow copy of the item you want to mutate
                    // let item = { ...items[index] };
                    // 3. Replace the property you're intested in
                    // item.name = 'newName';
                    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
                    items[index]['number_participants'] = payload.new.number_participants;
                    // items[index]['name'] = ''
                    console.log('items: ', items);
                    // 5. Set the state to our new copy
                    setEventActions(items);
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
                    // user_id: 3,
                    user_id: auth.id,
                    participation_threshold: 2
                }])
            console.log('launchAction data: ', data);
            if (error) {
                throw error
            }
            // setEventActions([...eventActions, data[0]])
        } catch (error) {
            console.log('error: ', error);
        }
    }

    const joinAction = async (eventAction: any) => {
        try {
            console.log('joinAction: ', eventAction)
            // 1) Add auth user to event_actions_users table
            const { data, error: errorInsert } = await supabase.from('event_actions_users').insert(
                {
                    event_action_id: eventAction.id,
                    user_id: auth.id,
                }
            )
            if (errorInsert) {
                console.log('errorInsert: ', errorInsert)
                throw errorInsert
            }
            console.log('data: ', data);

            // 2) Increment counter
            const { error: errorIncrement } = await supabase.rpc('increment_participation_count_by_one', { row_id: eventAction.id })
            if (errorIncrement) {
                console.log('errorIncrement: ', errorIncrement)
                throw errorIncrement
            }
            const userAction = {
                id: data[0].id,
                user_id: auth.id,
                event_action_id: eventAction.id,
                inserted_at: data[0].inserted_at
            }

            // 3) Update local store
            setUserActions(oldArray => [...oldArray, userAction]);


        } catch (error) {
            console.log('error: ', error);
        }
    }

    const unjoinAction = async (eventAction: any) => {
        try {
            console.log('unjoinAction: ', eventAction)

            // 1) Remove auth user to event_actions_users table
            const { data, error } = await supabase
                .from('event_actions_users')
                .delete()
                .match({ id: eventAction.id })
            if (error) {
                console.log('error: ', error)
                throw error
            }

            // 2) Decrement counter
            const { data: abc, error: errorDecrement } = await supabase.rpc('decrement_participation_count_by_one', { row_id: eventAction.event_action_id })
            if (errorDecrement) {
                console.log('errorDecrement: ', errorDecrement)
                throw errorDecrement
            }
            console.log('abc: ', abc);

            // 3) Update local state
            let array = [...userActions]; // make a separate copy of the array
            const index = array.findIndex(action => action.id === eventAction.id)
            if (index !== -1) {
                array.splice(index, 1);
                setUserActions(array);
            }
        } catch (error) {
            console.log('error: ', error);
        }
    }

    const deleteAction = async (eventActionId: number) => {
        try {
            const { data, error } = await supabase
                .from('event_actions')
                .delete()
                .match({ id: eventActionId })
            if (error) {
                throw error
            }

            let array = [...eventActions]; // make a separate copy of the array
            const index = array.findIndex(action => action.id === eventActionId)
            if (index !== -1) {
                array.splice(index, 1);
                setEventActions(array);
            }
        } catch (error) {
            console.log('error: ', error);
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
                            {action.name}&nbsp;
                            <button onClick={() => launchAction(action.id)}>Launch</button>
                        </Card>
                    })}
                    <h4>List of event actions</h4>
                    <ul>{eventActions.map((action, index) => {
                        return <li key={action.id}>
                            ID: {action.id} - {action.actions?.name} - #participants: {action.number_participants}/{action.participation_threshold} - {moment(action.inserted_at).format('HH:mm')}&nbsp;
                            <button disabled={userActions.find(a => a.event_action_id == action.id)} onClick={() => joinAction(action)}>Join</button>&nbsp;
                            <button onClick={() => deleteAction(action.id)}>Delete</button>
                        </li>
                    })}</ul>
                    <h4>List of user actions</h4>
                    <ul>{userActions.map((action, index) => {
                        return <li key={action.id}>
                            ID: {action.id} - userId: {action.user_id} - eventActionId: {action.event_action_id} - {moment(action.inserted_at).format('HH:mm')}&nbsp;
                            <button onClick={() => unjoinAction(action)}>Unjoin</button>
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

