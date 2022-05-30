import { ReactElement, useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import { supabase } from '../utils/supabaseClient'
import Layout from './Layout'
import NestedLayout from './LayoutFrontend'
import styles from '../styles/Event.module.css'

import { useAppSelector, useAppDispatch } from '../app/hooks'
import { selectAuth, incrementPoints } from '../features/auth/authSlice'
import { selectActions, fetchActions } from '../features/actions/actionsSlice'
import { selectEventActions as selectEventActions2, setEventActions as setEventActions2 } from '../features/eventActions/eventActionsSlice'

import {
    decrement,
    increment,
    incrementByAmount,
    incrementAsync,
    incrementIfOdd,
    selectCount,
} from '../features/counter/counterSlice'

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


export default function EventActions() {
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

    const eventActions2 = useAppSelector(selectEventActions2)
    const [eventActions, setEventActions] = useState([])
    const eventActionsRef = useRef<any>()
    eventActionsRef.current = eventActions

    // const [eventUsers, setEventUsers] = useState([])
    // const eventUsersRef = useRef<any>()
    // eventUsersRef.current = eventUsers

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
            // getEventUsersAndSubscribe(+id, +auth.id, username)
            getEventActionsAndSubscribe(+id)
        }
    }, [id])


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
                    // setEventActions((a) => [items, ...a])
                    setEventActions(items);
                    dispatch(setEventActions2(items))
                    dispatch(incrementByAmount(2))
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
        <div style={{ border: '2px dashed orangered' }}>
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
            Actions from Redux store:
            <ul>{eventActions2 && eventActions2.map((action, index) => {
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
        </div>
    )
}

EventActions.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            <NestedLayout>{page}</NestedLayout>
        </Layout>
    )
}

