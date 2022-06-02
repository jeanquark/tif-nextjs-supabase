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
import { selectActions } from '../features/actions/actionsSlice'
import { selectEventActions, setEventActions, addEventAction } from '../features/eventActions/eventActionsSlice'
import { selectEventUserActions, setEventUserActions, addEventUserAction } from '../features/eventUserActions/eventUserActionsSlice'

import {
    decrement,
    increment,
    incrementByAmount,
    incrementAsync,
    incrementIfOdd,
    selectCount,
} from '../features/counter/counterSlice'

import { Event, Action, EventAction, EventUserAction } from '../app/interfaces'

// interface Event {
//     id: number,
//     home_team_name: string,
//     visitor_team_name: string
// }

// interface Action {
//     id: number,
//     name: string,
//     slug?: string,
//     image?: string
// }

// interface EventAction {
//     id: number
//     action_id: number
//     event_id: number
//     user_id: number
//     username: string
//     action: {
//         name: string
//         image: string
//     }
//     is_completed: boolean
//     number_participants: number
//     participation_threshold: number
//     points: number
//     expired_at: Date
//     inserted_at: Date
//     updated_at: Date
// }

// interface EventUserAction {
//     id: number
//     user_id: number
//     event_action_id: number
//     inserted_at: Date
//     updated_at: Date
// }

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

    const eventActions = useAppSelector(selectEventActions)
    // const [eventActions, setEventActions] = useState([])
    const eventActionsRef = useRef<EventAction[] | null>(null)
    eventActionsRef.current = eventActions

    // const [eventUsers, setEventUsers] = useState([])
    // const eventUsersRef = useRef<any>()
    // eventUsersRef.current = eventUsers

    const eventUserActions = useAppSelector(selectEventUserActions)
    // const [userActions, setUserActions] = useState([])
    const eventUserActionsRef = useRef<EventUserAction[] | null>(null)
    eventUserActionsRef.current = eventUserActions



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
        // setEventActions(data)
        dispatch(setEventActions(data))
    }


    const getEventActionsAndSubscribe = async (id: number) => {
        console.log('getEventActionsAndSubscribe. id: ', id);
        getInitialEventActions(id)
        if (!subscriptionEventActions) {
            console.log('Not subscribed to eventActions')
            subscriptionEventActions = supabase
                .from(`event_actions:event_id=eq.${id}`)
                .on('INSERT', payload => {
                    console.log('[INSERT] subscriptionEventActions payload: ', payload.new)
                    console.log('[INSERT] eventActionsRef.current: ', eventActionsRef.current);

                    const action = actionsRef.current.find((action) => action.id == payload.new.action_id)
                    // const action = actions.find((action) => action.id == payload.new.action_id)
                    console.log('[INSERT] action: ', action)

                    const newEventAction: EventAction = {
                        action: {
                            name: action.name,
                            image: action.image,
                        },
                        ...payload.new,
                    }
                    newEventAction['number_participants'] = 1
                    console.log('newEventAction: ', newEventAction);
                    // setEventActions((a) => [newEventAction, ...a])

                    // let items = [...eventActionsRef.current];
                    // dispatch(setEventActions2([...items, newEventAction]))
                    dispatch(addEventAction(newEventAction))
                    // dispatch(setEventActions2((a) => [newEventAction, ...a]))

                })
                .on('UPDATE', (payload) => {
                    console.log('[UPDATE] subscriptionEventActions payload: ', payload)
                    console.log('[UPDATE] eventActionsRef.current: ', eventActionsRef.current)
                    console.log('[UPDATE] eventActions: ', eventActions)
                    console.log('payload.new.id: ', payload.new.id);

                    if (payload.new.is_completed) {
                        console.log('Action is complete!!!')

                        let index = eventUserActionsRef.current.findIndex(action => action.event_action.id == payload.new.id)
                        // let index = eventUserActions.findIndex(action => action.event_action.id == payload.new.id)
                        console.log('index: ', index);
                        if (index > -1) {
                            // Update user points
                            dispatch(incrementPoints(payload.new.points))
                        }
                    }

                    // let items = [...eventActionsRef.current];
                    // let items =  Object.create(eventActionsRef.current);
                    // console.log('items: ', items);
                    let index = eventActionsRef.current.findIndex(action => action.id == payload.new.id)
                    // let index2 = eventActions.findIndex(action => action.id == payload.new.id)
                    console.log('index: ', index)
                    if (index > -1) {
                        let item = {

                        }
                        let eventActionsArray = [...eventActionsRef.current];
                        let obj = {...eventActionsArray[index]}
                        obj['number_participants'] = payload.new.number_participants
                        obj['is_completed'] = payload.new.is_completed
                        console.log('obj: ', obj);
                        eventActionsArray[index] = obj
                        // 1. Make a shallow copy of the items
                        // 2. Make a shallow copy of the item you want to mutate
                        // let item = { ...items[index] };
                        
                        // let items = [...eventActions]
                        // 3. Replace the property you're intested in
                        // item.name = 'newName';
                        // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
                        // items[index2]['number_participants'] = payload.new.number_participants;
                        // items[index2]['is_completed'] = payload.new.is_completed
                        // items[index]['name'] = ''
                        console.log('eventActionsArray: ', eventActionsArray);
                        // 5. Set the state to our new copy
                        // setEventActions((a) => [items, ...a])
                        // setEventActions(items);
                        dispatch(setEventActions(eventActionsArray))
                        // dispatch(incrementByAmount(2))
                    }

                })
                .on('DELETE', (payload) => {
                    console.log('[DELETE] subscriptionEventActions payload: ', payload)

                    // 1) Delete eventActions
                    // let index = eventActionsRef.current.findIndex(action => action.id == payload.old.id)
                    console.log('[DELETE] eventActionsRef.current: ', eventActionsRef.current);
                    console.log('[DELETE] eventActions: ', eventActions)
                    // let index = eventActions.findIndex(action => action.id == payload.old.id)
                    let index = eventActionsRef.current.findIndex(action => action.id == payload.old.id)
                    console.log('index: ', index)
                    if (index > -1) {
                        let items = [...eventActionsRef.current];
                        // let items = eventActions
                        console.log('items: ', items)
                        items.splice(index, 1)
                        // setEventActions(items)
                        dispatch(setEventActions(items))
                    }

                    // 2) Delete userActions
                    // console.log('userActionsRef.current: ', userActionsRef.current);
                    let index2 = eventUserActionsRef.current.findIndex(action => action.event_action.id == payload.old.id)
                    // index = eventUserActions.findIndex(action => action.event_action.id == payload.old.id)
                    console.log('index2: ', index2)
                    if (index2 > -1) {
                        let items = [...eventUserActionsRef.current];
                        // let items = [...eventUserActions]
                        console.log('items: ', items)
                        items.splice(index2, 1)
                        // setUserActions(items)
                        dispatch(setEventUserActions(items))

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
            console.log('[eventAction] joinAction: ', eventAction)

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

            

            // 2) Increment counter
            const { error: errorIncrement } = await supabase.rpc('increment_participation_count_by_one', { row_id: eventAction.id })
            if (errorIncrement) {
                console.log('errorIncrement: ', errorIncrement)
                throw errorIncrement
            }

            // 3) Update local store
            const userAction: EventUserAction = {
                id: +data[0].id,
                user_id: +auth.id,
                name: eventAction.name,
                event_action: {
                    id: eventAction.id
                },
                inserted_at: data[0].inserted_at,
            }
            // setEventActions(oldArray => [...oldArray, eventAction]);
            // setUserActions(oldArray => [...oldArray, userAction]);
            dispatch(addEventUserAction(userAction))

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

            // 2) Delete event action
            const { data, error: error2 } = await supabase
                .from('event_actions')
                .delete()
                .match({ id: eventAction.id })

            console.log('data: ', data);
            if (error2) {
                throw error2
            }

            // 3) Update eventActions store
            let eventActionsArray = [...eventActionsRef.current]; // make a separate copy of the array
            console.log('eventActionsArray: ', eventActionsArray);
            let index = eventActionsArray.findIndex(action => action.id === eventAction.id)
            console.log('index1: ', index);
            if (index !== -1) {
                // eventActionsArray.splice(index, 1);
                // setEventActions(array);
                dispatch(setEventActions(eventActionsArray))
            }

            // 4) Update eventUserActions store
            // array = [...userActions]; // make a separate copy of the array
            // let array2 = [...eventUserActions]
            let eventUserActionsArray = [...eventUserActionsRef.current]
            console.log('eventUserActionsArray: ', eventUserActionsArray);
            console.log('eventAction.id: ', eventAction.id);
            index = eventUserActionsArray.findIndex(action => action.event_action.id === eventAction.id)
            console.log('index2: ', index);
            if (index !== -1) {
                // eventUserActionsArray.splice(index, 1);
                dispatch(setEventUserActions(eventUserActionsArray))
            }
        } catch (error) {
            console.log('error: ', error);
        }
    }

    const disabled = (actionId: number) => {
        const index = eventUserActions.findIndex(a => a.event_action.id == actionId)
        if (index > -1) {
            return true
        }
        return false
    }

    return (
        <div style={{ border: '0px dashed orangered' }}>
            <h4>{t('list_of_event_actions')}</h4>
            <ul>{eventActions && eventActions.map((action, index) => {
                return <li key={action.id} style={{ border: '1px solid black', marginBottom: '10px' }}>
                    Id: {action.id}<br />
                    {t('name')}: {action.action?.name}<br />
                    {t('launched_by')}: {action.username}<br />
                    {t('number_participants')}: <b>{action.number_participants}</b>/<b>{action.participation_threshold}</b><br />
                    {t('created_at')}: {moment(action.inserted_at).format('HH:mm')}&nbsp;
                    {action.is_completed ? <span style={{ color: 'lightgreen' }}>{t('action_completed')}</span> : <>
                        <button disabled={disabled(action.id)} className={styles.btn} onClick={() => joinAction(action)}>{t('join')}</button>
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

