import { ReactElement, useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'
import { useTranslation } from 'next-i18next';

import { supabase } from '../utils/supabaseClient'
import Layout from '../components/Layout'
import NestedLayout from '../components/LayoutFrontend'
import { Card } from '../components/UI/Card'
import EventActions from '../components/EventActions';
import styles from '../styles/Event.module.css'

import { useAppSelector, useAppDispatch } from '../app/hooks'
import { selectAuth, incrementPoints } from '../features/auth/authSlice'
import {
    selectActions,
    fetchActions
} from '../features/actions/actionsSlice'

import { selectEventUserActions as selectEventUserActions2, setEventUserActions as setEventUserActions2, addEventUserAction as addEventUserAction2 } from '../features/eventUserActions/eventUserActionsSlice'


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

interface EventUserAction {
    id: number
    user_id: number
    event_action_id: number
    inserted_at: Date
    updated_at: Date
}

type EffectCallback = () => (void | (() => void | undefined));



export default function EventUserActions() {
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

    const eventUserActions2 = useAppSelector(selectEventUserActions2)
    const [userActions, setUserActions] = useState([])
    const userActionsRef = useRef<any[]>()
    userActionsRef.current = userActions



    let subscriptionEvents = null
    let subscriptionEventUsers = null
    let subscriptionEventActions = null

    const { t } = useTranslation(['actions', 'common', 'home']);

    useEffect((): ReturnType<EffectCallback> => {
        console.log('[useEffect] subscribeToEvents id, auth: ', id)
        if (id != undefined) {
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
        dispatch(setEventUserActions2(userEventActions))
    }


    const getEventUsersAndSubscribe = async (id: number, authId: number, username: string) => {
        console.log('authId: ', authId);
        console.log('username: ', username);
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
            // let array = [...userActions]; // make a separate copy of the array
            let array = [...eventUserActions2]
            let index = array.findIndex(action => action.id === eventAction.id)
            if (index !== -1) {
                array.splice(index, 1);
                setUserActions(array);
                dispatch(setEventUserActions2(array))
            }
        } catch (error) {
            console.log('error: ', error);
        }
    }



    return (
        <div style={{ border: '2px dashed darkblue' }}>
            {/* <h4>{t('list_of_user_actions')}</h4>
            <ul>{userActions && userActions.map(action => {

                return <li key={action.id} style={{ border: '1px solid black', marginBottom: '10px' }}>
                    Id: {action.id}<br />
                    {t('name')}: {action.name ? action.name : action.event_action?.action?.name}<br />
                    {t('created_at')}: {moment(action.inserted_at).format('HH:mm')}&nbsp;
                    {action.event_actions?.is_completed ? <span style={{ color: 'lightgreen' }}>{t('action_completed')}</span> : <button className={styles.btn} onClick={() => unjoinAction(action)}>{t('unjoin')}</button>}
                </li>
            })}</ul> */}
            EventUserActions from Redux store:
            <ul>{eventUserActions2 && eventUserActions2.map(action => {
                return <li key={action.id} style={{ border: '1px solid black', marginBottom: '10px' }}>
                    Id: {action.id}<br />
                    {/* {t('name')}: {action.name ? action.name : action.event_action?.action?.name}<br />
                    {t('created_at')}: {moment(action.inserted_at).format('HH:mm')}&nbsp;
                    {action.event_actions?.is_completed ? <span style={{ color: 'lightgreen' }}>{t('action_completed')}</span> : <button className={styles.btn} onClick={() => unjoinAction(action)}>{t('unjoin')}</button>} */}
                </li>
            })}</ul>
        </div>
    )
}

EventUserActions.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            <NestedLayout>{page}</NestedLayout>
        </Layout>
    )
}

