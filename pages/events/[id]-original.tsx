import { ReactElement, useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import { supabase } from '../../utils/supabaseClient'
import Layout from '../../components/Layout'
import NestedLayout from '../../components/LayoutFrontend'
import { Card } from '../../components/UI/Card'
import EventActions from '../../components/EventActions'
import EventUserActions from '../../components/EventUserActions'
import styles from '../../styles/Event.module.css'

import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { selectAuth, incrementPoints } from '../../features/auth/authSlice'
import {
    selectActions,
    fetchActions
} from '../../features/actions/actionsSlice'


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

type EffectCallback = () => (void | (() => void | undefined));


export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['actions', 'common', 'home'])),
            // Will be passed to the page component as props
        },
    };
}

export default function EventPage() {
    const dispatch = useAppDispatch()
    const auth = useAppSelector(selectAuth)
    const router = useRouter()
    const { id } = router.query
    const [isLoading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState(null)
    const [event, setEvent] = useState(null)
    const [updateEvent, handleUpdateEvent] = useState(null)

    const actions = useAppSelector(selectActions)
    const actionsRef = useRef<Action[]>()
    actionsRef.current = actions

    const [eventActions, setEventActions] = useState([])
    const eventActionsRef = useRef<any>()
    eventActionsRef.current = eventActions

    const [eventUsers, setEventUsers] = useState([])
    const eventUsersRef = useRef<any>()
    eventUsersRef.current = eventUsers

    const [userActions, setUserActions] = useState([])
    const userActionsRef = useRef<any[]>()
    userActionsRef.current = userActions



    let subscriptionEvents = null
    let subscriptionEventUsers = null
    let subscriptionEventActions = null

    const { t } = useTranslation(['actions', 'common', 'home']);

    // useEffect((): ReturnType<EffectCallback> => {
    //     console.log('[useEffect] id: ', id)
    //     return async () => {
    //         if (subscriptionEvents) {
    //             console.log('[removeSubscription] useEffect', subscriptionEvents)
    //             // supabase.removeSubscription(subscriptionEvents)   
    //             supabase.removeAllSubscriptions()
    //         }
    //     }
    // }, [id])

    useEffect((): ReturnType<EffectCallback> => {
        console.log('[useEffect] subscribeToEvents id, auth: ', id)
        if (id != undefined) {
            const username = auth.username ? auth.username : auth.email
            getEventAndSubscribe(+id)
            // getEventUsersAndSubscribe(+id, +auth.id, username)
            getEventActionsAndSubscribe(+id)
        }

        return async () => {
            // Remove user from event_users list
            if (auth.id) {
                // await supabase.from('event_users').upsert({ user_id: auth.id, event_id: id, joined_at: null, left_at: new Date() }, { onConflict: 'user_id' })
            }
            if (subscriptionEvents) {
                console.log('[removeSubscription] useEffect', subscriptionEvents)
                // supabase.removeSubscription(subscriptionEvents)   
                supabase.removeAllSubscriptions()
            }
        }
    }, [id])

    useEffect(() => {
        console.log('[useEffect] fetchActions id: ', id)
        if (actions && actions.length < 1) {
            dispatch(fetchActions());
        }
    }, [id])

    useEffect(() => {
        console.log('[useEffect] getInitialUserActions id, auth: ', id, auth)
        if (auth && auth.id) {
            getInitialUserActions(+id, +auth.id)
        }
    }, [id, auth])

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
            .select(`id, number_participants, participation_threshold, is_completed, action:actions (name, image), event:events (home_team_name, visitor_team_name), user_id, username, inserted_at`)
            .eq('event_id', id)
            // .gt('expired_at', moment().utc())
            .order('id', { ascending: false })
        if (error) {
            return
        }
        console.log('event actions data: ', data)
        setEventActions(data)
    }

    const getInitialEventUsers = async (id: number, authId: number, username: string) => {
        console.log('getInitialEventUsers', id, authId, username)
        const { error: error1 } = await supabase
            .from('event_users')
            .upsert({ user_id: authId, username, event_id: id, joined_at: new Date(), left_at: null }, { onConflict: 'user_id' })
        if (error1) {
            console.log('error1: ', error1);
            return
        }
        const { data, error } = await supabase
            .from('event_users')
            .select(`*`)
            .eq('event_id', id)
            .not('joined_at', 'is', null)
        if (error) {
            console.log('error: ', error);
            return
        }
        console.log('event users data: ', data)
        setEventUsers(data)

    }

    const getInitialUserActions = async (eventActionId: number, userId: number) => {
        console.log('getInitialUserActions: ', eventActionId, userId);
        const { data, error } = await supabase
            .from('event_actions_users')
            // .select('*')
            .select(`
                id,
                inserted_at,
                user_id,
                event_action:event_actions (
                    id,
                    is_completed,
                    action:actions(
                        name
                    ),
                    event:events(
                        id
                    )
                )
            `)
            .eq('user_id', userId)
            // .match({'user_id': userId, 'event_action.event.id': eventActionId})
            // .match({'user_id': userId})
            // .eq('event_action.event.id', eventActionId)
            .order('id', { ascending: false })


        console.log('userEventActions data: ', data);
        if (error) {
            console.log('error: ', error);
            return
        }
        const userEventActions = data.filter(a => a.event_action.event.id == eventActionId)
        console.log('userEventActions: ', userEventActions);
        setUserActions(userEventActions)
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
            console.log('[removeSubscription] getEventAndSubscribe')
            supabase.removeSubscription(subscriptionEvents)
        }
    }
    const getEventUsersAndSubscribe = async (id: number, authId: number, username: string) => {
        console.log('authId: ', authId);
        console.log('username: ', username);
        if (authId) {
            getInitialEventUsers(id, authId, username)
        }
        if (!subscriptionEventUsers) {
            subscriptionEventUsers = supabase
                .from(`event_users:event_id=eq.${id}`)
                .on('*', payload => {
                    console.log('Change received!', payload)
                    if (payload.new.joined_at) {
                        // User joined
                        console.log('user joined!')
                        const user = eventUsersRef.current.find((user) => user.user_id == payload.new.user_id)
                        console.log('user: ', user)
                        if (!user) {
                            const newEventUser = payload.new
                            setEventUsers((a) => [newEventUser, ...a])
                        }
                    } else {
                        // User left
                        console.log('user left!')
                        const user = eventUsersRef.current.find((user) => user.user_id == payload.new.user_id)
                        console.log('user: ', user)
                        const users = eventUsersRef.current.filter((user) => user.user_id != payload.new.user_id)
                        console.log('users: ', users);
                        setEventUsers(users)
                    }
                })
                .subscribe()
        }
    }
    const getEventActionsAndSubscribe = async (id: number) => {
        console.log('getEventActionsAndSubscribe. id: ', id);
        getInitialEventActions(id)
        if (!subscriptionEventActions) {
            console.log('Not subscribed to eventActions')
            subscriptionEventActions = supabase
                // .from('event_actions')
                .from(`event_actions:event_id=eq.${id}`)
                // .on('*', payload => {
                //     console.log('Changed received!', payload)
                // }).subscribe()
                .on('INSERT', payload => {
                    console.log('[INSERT] subscriptionEventActions payload: ', payload.new)

                    const action = actionsRef.current.find((action) => action.id == payload.new.action_id)
                    console.log('action: ', action)
                    const newEventAction = {
                        action: {
                            name: action.name,
                            image: action.image,
                        },
                        ...payload.new,
                    }
                    setEventActions((a) => [newEventAction, ...a])
                })
                .on('UPDATE', (payload) => {
                    console.log('[UPDATE] subscriptionEventActions payload: ', payload)
                    console.log('eventActionsRef: ', eventActionsRef);
                    console.log('payload.new.id: ', payload.new.id);
                    console.log('userActionsRef: ', userActionsRef);

                    let index
                    if (payload.new.is_completed) {
                        console.log('Action is completed!!!')

                        index = userActionsRef.current.findIndex(action => action.event_action.id == payload.new.id)
                        console.log('index: ', index);
                        if (index > -1) {
                            // Update user points
                            dispatch(incrementPoints(payload.new.points))
                        }
                    }

                    index = eventActionsRef.current.findIndex(action => action.id == payload.new.id)
                    console.log('index: ', index)
                    // 1. Make a shallow copy of the items
                    let items = [...eventActionsRef.current];
                    // 2. Make a shallow copy of the item you want to mutate
                    // let item = { ...items[index] };
                    // 3. Replace the property you're intested in
                    // item.name = 'newName';
                    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
                    items[index]['number_participants'] = payload.new.number_participants;
                    items[index]['is_completed'] = payload.new.is_completed
                    // items[index]['name'] = ''
                    console.log('items: ', items);
                    // 5. Set the state to our new copy
                    setEventActions(items);
                    // setEventActions((a) => [items, ...a])

                })
                .on('DELETE', (payload) => {
                    console.log('[DELETE] subscriptionEventActions payload: ', payload)

                    // 1) Delete eventActions
                    let index = eventActionsRef.current.findIndex(action => action.id == payload.old.id)
                    console.log('index1: ', index)
                    if (index > -1) {
                        let items = [...eventActionsRef.current];
                        console.log('items: ', items)
                        items.splice(index, 1)
                        setEventActions(items)
                    }

                    // 2) Delete userActions
                    console.log('userActionsRef.current: ', userActionsRef.current);
                    index = userActionsRef.current.findIndex(action => action.event_action.id == payload.old.id)
                    console.log('index2: ', index)
                    if (index > -1) {
                        let items = [...userActionsRef.current];
                        console.log('items: ', items)
                        items.splice(index, 1)
                        setUserActions(items)
                    }
                })
                .subscribe()
        } else {
            console.log('[removeSubscription] getEventActionsAndSubscribe')
            supabase.removeSubscription(subscriptionEventActions)
        }
    }

    const launchAction = async (action: Action) => {
        try {
            console.log('lauchAction: ', action)
            if (!auth.id) {
                // alert('You are not authenticated. Please login first.')
                alert(t('common:not_authenticated'))
                throw 'not authenticated'
            }
            // throw 'not_auth'

            const { data, error } = await supabase
                .from('event_actions')
                .insert([{
                    event_id: event.id,
                    action_id: action.id,
                    user_id: auth.id,
                    username: auth.username ? auth.username : auth.id,
                    number_participants: 0,
                    participation_threshold: 2,
                    points: 100
                }])
            console.log('launchAction data: ', data);
            if (error) {
                throw error
            }
            data[0]['number_participants'] = 1
            data[0]['name'] = action.name
            // setEventActions([...eventActions, { action: {
            //     name: action.name,
            //     image: action.image,
            // }, user: { id: auth.id, username: auth.username }, ...data[0] }])
            joinAction(data[0])
        } catch (error) {
            console.log('error: ', error);
        }
    }

    const joinAction = async (eventAction: any) => {
        try {
            console.log('joinAction: ', eventAction)

            if (!auth.id) {
                // alert('You are not authenticated. Please login first.')
                alert(t('common:not_authenticated'))
                throw 'not authenticated'
            }

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

            const userAction = {
                id: data[0].id,
                user_id: auth.id,
                name: eventAction.name,
                event_action: {
                    id: eventAction.id
                },
                inserted_at: data[0].inserted_at
            }

            // 2) Increment counter
            const { error: errorIncrement } = await supabase.rpc('increment_participation_count_by_one', { row_id: eventAction.id })
            if (errorIncrement) {
                console.log('errorIncrement: ', errorIncrement)
                throw errorIncrement
            }

            // 3) Update local store
            // setEventActions(oldArray => [...oldArray, eventAction]);
            setUserActions(oldArray => [...oldArray, userAction]);

        } catch (error) {
            console.log('error: ', error);
        }
    }

    const unjoinAction = async (eventAction: any) => {
        try {
            console.log('unjoinAction: ', eventAction)
            if (!auth.id) {
                // alert('You are not authenticated. Please login first.')
                alert(t('common:not_authenticated'))
                throw 'not authenticated'
            }

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
            const { data: dataDecrement, error: errorDecrement } = await supabase.rpc('decrement_participation_count_by_one', { row_id: eventAction.event_action.id })
            if (errorDecrement) {
                console.log('errorDecrement: ', errorDecrement)
                throw errorDecrement
            }
            console.log('dataDecrement: ', dataDecrement);

            // 3) Update local state
            // let array = [...eventActions] // make separate copy of the array
            // let index = array.findIndex(action => action.id === eventAction.id)
            // console.log('index: ', index);
            // if (index !== -1) {
            //     array.splice(index, 1);
            //     setUserActions(array);
            // }
            let array = [...userActions]; // make a separate copy of the array
            let index = array.findIndex(action => action.id === eventAction.id)
            if (index !== -1) {
                array.splice(index, 1);
                setUserActions(array);
            }
        } catch (error) {
            console.log('error: ', error);
        }
    }

    const deleteAction = async (eventAction: any) => {
        try {
            console.log('deleteAction eventAction: ', eventAction);
            if (!auth.id) {
                // alert('You are not authenticated. Please login first.')
                alert(t('common:not_authenticated'))
                throw 'not_authenticated'
            }
            // if (eventAction.user.id !== auth.id) {
            //     alert('You are not the creator of this action')
            //     throw 'not_your_action'
            // }

            // 1) Delete all users related to this action
            const { error: error1 } = await supabase
                .from('event_actions_users')
                .delete()
                .match({ event_action_id: eventAction.id })
            if (error1) {
                throw error1
            }

            // 2) Delete action
            const { data, error: error2 } = await supabase
                .from('event_actions')
                .delete()
                .match({ id: eventAction.id })

            console.log('data: ', data);
            if (error2) {
                throw error2
            }

            // 3) Update eventActions store
            let array = [...eventActions]; // make a separate copy of the array
            console.log('array1: ', array);
            let index = array.findIndex(action => action.id === eventAction.id)
            console.log('index1: ', index);
            if (index !== -1) {
                array.splice(index, 1);
                setEventActions(array);
            }

            // 4) Update userActions store
            array = [...userActions]; // make a separate copy of the array
            console.log('array2: ', array);
            console.log('eventAction.id: ', eventAction.id);
            index = array.findIndex(action => action.event_action.id === eventAction.id)
            console.log('index2: ', index);
            if (index !== -1) {
                array.splice(index, 1);
                setUserActions(array);
            }
        } catch (error) {
            console.log('error: ', error);
        }
    }

    return (
        <>
            <div>
                <h1>{t('event_page')}</h1>
                {/* <p>Event id: {event && event.id}</p> */}
            </div>
            <div className={styles.parent}>
                {event && <div className={styles.childLeft}>
                    <h3 style={{ textAlign: 'center' }}>{event.home_team_name} vs {event.visitor_team_name}</h3>
                    <h3 style={{ textAlign: 'center' }}>{event.home_team_score}&nbsp;-&nbsp;{event.visitor_team_score}</h3>
                    <h5 style={{ textAlign: 'center' }}>{event.elapsed_time}min</h5>
                    <br />
                    <p style={{ textAlign: 'center' }}>{moment(event.date).format('ll')}&nbsp;{moment(event.date).format('HH:mm')}</p>
                    <h4>{t('list_of_event_users')}</h4>
                    <p>{"Ce serait bien d'avoir ici la liste des joueurs qui suivent ce match, c'est à dire les joueurs en ligne qui visitent en ce moment cette page. Malheureusement, cette fonctionnalité, appelée \"presence\", n'est pas encore disponible avec notre base de données. L'équipe de Supabase est en train de "}<a href="https://supabase.com/blog/2022/04/01/supabase-realtime-with-multiplayer-features">travailler dessus</a>{"."}</p>
                    {/* <ul>{eventUsers && eventUsers.map((user, index) => {
                        return <li key={user.id} style={{ border: '1px solid black', marginBottom: '10px' }}>
                            Id: {user.id}<br />
                            {t('name')}: {user.username}<br />
                            {t('joined_at')}: {moment(user.join_at).format('HH:mm')}&nbsp;
                        </li>
                    })}</ul> */}
                </div>}
                {event && <div className={styles.childRight}>
                    <h3>{t('actions')}</h3>
                    {actions.map((action, index) => {
                        return <Card key={index}>
                            Id: {action.id}&nbsp;
                            {action.name}&nbsp;
                            <button onClick={() => launchAction(action)} className={styles.btn}>{t('launch')}</button>
                        </Card>
                    })}
                    {/* <EventActions /> */}
                    <h4>{t('list_of_event_actions')}</h4>
                    <ul>{eventActions && eventActions.map((action, index) => {
                        return <li key={action.id} style={{ border: '1px solid black', marginBottom: '10px' }}>
                            Id: {action.id}<br />
                            {t('name')}: {action.action?.name}<br />
                            {t('launched_by')}: {action.username}<br />
                            {t('number_participants')}: <b>{action.number_participants}</b>/<b>{action.participation_threshold}</b><br />
                            {t('created_at')}: {moment(action.inserted_at).format('HH:mm')}&nbsp;
                            {action.is_completed ? <span style={{ color: 'lightgreen' }}>{t('action_completed')}</span> : <>
                                <button disabled={userActions.find(a => a.event_action.id == action.id)} className={styles.btn} onClick={() => joinAction(action)}>{t('join')}</button>
                            </>}&nbsp;
                            <button className={styles.btn} onClick={() => deleteAction(action)}>{t('delete')}</button>
                        </li>
                    })}</ul>

                    {/* <EventUserActions /> */}
                    <h4>{t('list_of_user_actions')}</h4>
                    <ul>{userActions && userActions.map(action => {
                        return <li key={action.id} style={{ border: '1px solid black', marginBottom: '10px' }}>
                            Id: {action.id}<br />
                            {t('name')}: {action.name ? action.name : action.event_action?.action?.name}<br />
                            {t('created_at')}: {moment(action.inserted_at).format('HH:mm')}&nbsp;
                            {action.event_actions?.is_completed ? <span style={{ color: 'lightgreen' }}>{t('action_completed')}</span> : <button className={styles.btn} onClick={() => unjoinAction(action)}>{t('unjoin')}</button>}
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

