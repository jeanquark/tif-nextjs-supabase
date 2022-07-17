import { ReactElement, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment'
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import { supabase } from '../utils/supabaseClient'
import Layout from '../components/Layout'
import NestedLayout from '../components/LayoutFrontend'
// import { Card } from '../components/UI/Card'
// import EventActions from '../components/EventActions';
import styles from '../styles/Event.module.css'

import { useAppSelector, useAppDispatch } from '../app/hooks'
import { selectAuth, incrementPoints } from '../features/auth/authSlice'
import { selectActions, fetchActions } from '../features/actions/actionsSlice'
import { selectEventActions, setEventActions, addEventAction } from '../features/eventActions/eventActionsSlice'
import { selectEventUserActions, setEventUserActions, addEventUserAction } from '../features/eventUserActions/eventUserActionsSlice'

import { Event, Action, EventAction, EventUserAction } from '../app/interfaces'

type EffectCallback = () => (void | (() => void | undefined));



export default function EventUserActions() {
    const dispatch = useAppDispatch()
    const auth = useAppSelector(selectAuth)
    const router = useRouter()
    const { id } = router.query
    const [event, setEvent] = useState(null)
    const [updateEvent, handleUpdateEvent] = useState(null)

    const actions = useAppSelector(selectActions)
    const actionsRef = useRef<Action[]>()
    actionsRef.current = actions

    const eventActions = useAppSelector(selectEventActions)
    const eventActionsRef = useRef<any>()
    eventActionsRef.current = eventActions

    // const [eventUsers, setEventUsers] = useState([])
    // const eventUsersRef = useRef<any>()
    // eventUsersRef.current = eventUsers

    const eventUserActions = useAppSelector(selectEventUserActions)
    const eventUserActionsRef = useRef<any[]>()
    eventUserActionsRef.current = eventUserActions

    let subscriptionEvents = null

    const { t } = useTranslation(['actions', 'common', 'home']);

    // useEffect((): ReturnType<EffectCallback> => {
    //     console.log('[useEffect] subscribeToEvents id, auth: ', id)
    //     if (id != undefined) {
    //     }

    //     return async () => {
    //         if (subscriptionEvents) {
    //             console.log('[removeSubscription] useEffect', subscriptionEvents)
    //             // supabase.removeSubscription(subscriptionEvents)   
    //             supabase.removeAllSubscriptions()
    //         }
    //     }
    // }, [id])

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
            .select(`
                id,
                inserted_at,
                user_id,
                event_action:event_actions (
                    id,
                    is_completed,
                    action:actions(
                        name,
                        image
                    ),
                    event:events(
                        id
                    )
                )
            `)
            .eq('user_id', userId)
            .order('id', { ascending: false })


        console.log('userEventActions data: ', data);
        if (error) {
            console.log('error: ', error);
            return
        }
        const userEventActions = data.filter(a => a.event_action.event.id == eventActionId)
        console.log('userEventActions: ', userEventActions);
        dispatch(setEventUserActions(userEventActions))
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
            const { error } = await supabase
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
            let array = [...eventUserActionsRef.current] // make a separate copy of the array
            let index = array.findIndex(action => action.id === eventAction.id)
            if (index !== -1) {
                array.splice(index, 1);
                dispatch(setEventUserActions(array))
            }
        } catch (error) {
            console.log('error: ', error);
        }
    }

    return (
        <div className="row">
            {eventUserActions && eventUserActions.map(action => {
                return (
                    <div className="col col-md-2" key={action.id}>
                        <Image src={`/images/actions/${action.event_action?.action?.image}`} width="100%" height="100%" alt="image of action" />
                        {/* action.event_action.action.name: {action.event_action.action.name}<br /> */}
                        {/* action.event_action.action.image: {action.event_action.action.image}<br /> */}
                    </div>
                )
            })}
        </div>

        // <div style={{ border: '0px dashed darkblue' }}>
        //     <h4>{t('list_of_user_actions')}</h4>
        //     <ul>{eventUserActions && eventUserActions.map(action => {
        //         return <li key={action.id} style={{ border: '1px solid black', marginBottom: '10px' }}>
        //             Id: {action.id}<br />
        //             {t('name')}: {action.name ? action.name : action.event_action?.action?.name}<br />
        //             {t('created_at')}: {moment(action.inserted_at).format('HH:mm')}&nbsp;
        //             {action.event_action?.is_completed ? <span style={{ color: 'lightgreen' }}>{t('action_completed')}</span> : <button className={styles.btn} onClick={() => unjoinAction(action)}>{t('unjoin')}</button>}
        //         </li>
        //     })}</ul>
        // </div>
    )
}

EventUserActions.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            <NestedLayout>{page}</NestedLayout>
        </Layout>
    )
}

