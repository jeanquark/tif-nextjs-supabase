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
import { selectActions, fetchActions } from '../../features/actions/actionsSlice'
import { selectEventActions, setEventActions } from '../../features/eventActions/eventActionsSlice'
import { selectEventUserActions, setEventUserActions, addEventUserAction } from '../../features/eventUserActions/eventUserActionsSlice'

import { Event, Action, EventAction, EventUserAction } from '../../app/interfaces'
import classNames from 'classnames';

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
//     event_action_id?: number
//     event_action?: {
//         id?: number
//     }
//     inserted_at: Date
//     updated_at: Date
// }

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

    const eventActions = useAppSelector(selectEventActions)
    // const [eventActions, setEventActions] = useState([])
    const eventActionsRef = useRef<EventAction[]>()
    eventActionsRef.current = eventActions

    const [eventUsers, setEventUsers] = useState([])
    const eventUsersRef = useRef<any>()
    eventUsersRef.current = eventUsers

    const eventUserActions = useAppSelector(selectEventUserActions)
    // const [userActions, setUserActions] = useState([])
    const eventUserActionsRef = useRef<EventUserAction[]>()
    eventUserActionsRef.current = eventUserActions

    let subscriptionEvents = null

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
            // getEventActionsAndSubscribe(+id)
        }

        return async () => {
            // Remove user from event_users list
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

    // useEffect(() => {
    //     console.log('[useEffect] getInitialUserActions id, auth: ', id, auth)
    //     if (auth && auth.id) {
    //         getInitialUserActions(+id, +auth.id)
    //     }
    // }, [id, auth])

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

    const launchAction = async (action: Action) => {
        try {
            console.log('[id] lauchAction: ', action)
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
            console.log('[id] joinAction: ', eventAction)

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

            const userAction: EventUserAction = {
                id: +data[0].id,
                user_id: +auth.id,
                name: eventAction.name,
                event_action: {
                    id: eventAction.id
                },
                inserted_at: data[0].inserted_at,
            }
            console.log('userAction: ', userAction);

            // 2) Increment counter
            const { error: errorIncrement } = await supabase.rpc('increment_participation_count_by_one', { row_id: eventAction.id })
            if (errorIncrement) {
                console.log('errorIncrement: ', errorIncrement)
                throw errorIncrement
            }

            // 3) Update local store
            // setEventActions(oldArray => [...oldArray, eventAction]);
            // setUserActions(oldArray => [...oldArray, userAction]);
            dispatch(addEventUserAction(userAction))
        } catch (error) {
            console.log('error: ', error);
        }
    }

    const eventInProgress = (eventStatus: string) => {
        // return true
        return eventStatus == '1H' || eventStatus == '2H' || eventStatus == 'HT' || eventStatus == 'ET' || eventStatus == 'P'
    }


    return (
        <>
            <div className={classNames('row', styles.backgroundImage)}>
                <div className={classNames('row', styles.header)}>

                    <div className="col col-4 left">Championnat Suisse</div>
                    <div className="col col-4 center text-center">16 Juillet 2022<br />16:00</div>
                    <div className="col col-4 right">Match de Championnat - Regular Season 1</div>
                </div>
                <div className="row">
                    <div className={classNames("col col-md-1", styles.teamFlag)}>
                        <img src="/images/163.png" alt="team flag" width="100%" />
                    </div>
                    <div className={classNames("col col-md-3", styles.scorePF)}>
                        1234.99 PF
                    </div>
                    <div className={classNames("col col-md-4", styles.matchStatus)}>En cours<br />75ème minute</div>
                    <div className={classNames("col col-md-3", styles.scorePF)}>1369.74 PF</div>
                    <div className={classNames("col col-md-1", styles.teamFlag)}>
                        <img src="/images/163.png" alt="team flag" width="100%" />
                    </div>
                </div>
                <div className="row">
                    <div className={classNames("col col-md-5", styles.team)}>Suisse</div>
                    <div className={classNames("col col-md-2", styles.scoreReal)}>Score réel<br />2-1</div>
                    <div className={classNames("col col-md-5", styles.team)}>Brésil</div>
                </div>
                <div className="row">
                    <div className={classNames("col col-md-6", styles.matchInfoLeft)}>But : 12e - Buteur no 1<br />
                        Carton jaune : 25e - Joueur no 12</div>
                    <div className={classNames("col col-md-6", styles.matchInfoRight)}>But : 12e - Buteur no 1<br />
                        Carton jaune : 25e - Joueur no 12</div>
                </div>
                <div className="row">
                    <div className={classNames("col col-md-12", styles.playerScore)}>
                        Ton score<br />
                        0.00 PF
                    </div>
                </div>
                <div className="row">
                    <div className={classNames("col col-md-12", styles.gameScoreProgression)}>
                        Barre de progression du score<br />
                        <div className="progress">
                            {/* <div className="progress-bar w-75" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div> */}
                        </div>
                    </div>
                </div>
            </div>
            <div className={classNames('row', 'mt-3')}>
                <div className="col col-md-6"><button className="btn btn-danger">Retour aux Events</button></div>
                <div className="col col-md-6"><button className="btn btn-success">Je veux voir ce match!</button></div>


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

