import { ReactElement, useEffect, useState, useRef } from 'react'
import moment from 'moment'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

import { supabase } from '../../utils/supabaseClient'
import Layout from '../../components/Layout'
import NestedLayout from '../../components/LayoutFrontend'
import { Card } from '../../components/UI/Card'
import EventActions from '../../components/EventActions'
import EventUserActions from '../../components/EventUserActions'
import EventUsers from '../../components/EventUsers'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { selectAuth, incrementPoints } from '../../features/auth/authSlice'
import { selectActions, fetchActions } from '../../features/actions/actionsSlice'
import { selectEventActions, setEventActions } from '../../features/eventActions/eventActionsSlice'
import { selectEventUserActions, setEventUserActions, addEventUserAction } from '../../features/eventUserActions/eventUserActionsSlice'
import { Event, Action, EventAction, EventUserAction } from '../../app/interfaces'
import styles from '../../styles/Event.module.css'

type EffectCallback = () => void | (() => void | undefined)

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['actions', 'common', 'home'])),
            // Will be passed to the page component as props
        },
    }
}

export default function EventPage() {
    const dispatch = useAppDispatch()
    const auth = useAppSelector(selectAuth)
    const router = useRouter()
    const { id } = router.query
    const [isLoading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState(null)
    const [event, setEvent] = useState<Event>(null)
    const [updateEvent, handleUpdateEvent] = useState(null)
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    const [userAction, setUserAction] = useState<Action>(null)
    const [userActionModal, setUserActionModal] = useState<boolean>(false)
    const [userTeam, setUserTeam] = useState<number>(null)

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

    const { t } = useTranslation(['actions', 'common', 'home'])

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
            dispatch(fetchActions())
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
            // .select('*')
            .select(`id, home_team_id, home_team_name, home_team_image, home_team_score, visitor_team_id, visitor_team_name, visitor_team_image, visitor_team_score, status, date, timestamp, round, league:leagues (id, name, image)`)
            .eq('id', id)
        if (error) {
            console.log('error: ', error)
            supabase.removeSubscription(subscriptionEvents)
            subscriptionEvents = null
            return
        }
        console.log('data2: ', data)
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

            // 1) Add user to eventUsers
            const { data: data1, error: error1 } = await supabase.from('event_users').upsert({ event_id: event.id, team_id: userTeam, user_id: auth.id, username: auth.username, user_points: auth.points, inserted_at: new Date() }, { onConflict: 'event_id,user_id' })
            console.log('data1: ', data1);
            if (error1) {
                throw error1
            }

            // 2) Add action to eventActions
            const { data, error } = await supabase.from('event_actions').insert([
                {
                    event_id: event.id,
                    action_id: action.id,
                    user_id: auth.id,
                    team_id: userTeam,
                    username: auth.username ? auth.username : auth.id,
                    number_participants: 0,
                    participation_threshold: 2,
                    points: 100,
                }
            ])
            console.log('launchAction data: ', data)
            if (error) {
                throw error
            }
            data[0]['number_participants'] = 1
            data[0]['name'] = action.name
            // setEventActions([...eventActions, { action: {
            //     name: action.name,
            //     image: action.image,
            // }, user: { id: auth.id, username: auth.username }, ...data[0] }])
            await joinAction(data[0])
            setUserActionModal(false)
        } catch (error) {
            console.log('error: ', error)
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
            const { data, error: errorInsert } = await supabase.from('event_actions_users').insert({
                event_action_id: eventAction.id,
                user_id: auth.id,
            })
            if (errorInsert) {
                console.log('errorInsert: ', errorInsert)
                throw errorInsert
            }
            console.log('data: ', data)

            const userAction: EventUserAction = {
                id: +data[0].id,
                user_id: +auth.id,
                name: eventAction.name,
                event_action: {
                    id: eventAction.id,
                },
                inserted_at: data[0].inserted_at,
            }
            console.log('userAction: ', userAction)

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
            console.log('error: ', error)
        }
    }

    const eventInProgress = (eventStatus: string) => {
        // return true
        return eventStatus == '1H' || eventStatus == '2H' || eventStatus == 'HT' || eventStatus == 'ET' || eventStatus == 'P'
    }

    const selectTeam = async (eventId: number, teamId: number) => {
        try {
            const { data, error } = await supabase
            .from('event_users')
            .update({ team_id: teamId })
            .match({ event_id: eventId, user_id: auth.id })
            console.log('data: ', data);
            if (error) {
                throw error
            }
        } catch (error) {
            console.log('error: ', error);
        }
    }

    return (
        <>
            <Modal show={userActionModal} onHide={() => setUserActionModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Action {userAction?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="row justify-content-center align-items-center">
                    <div className="col col-md-6 text-center">
                        <Image src={`/images/actions/${userAction?.image}`} width="100%" height="100%" alt="action image" className="" />
                    </div>
                    <div className="col col-md-6">
                        Coût: 20$<br />
                        Nb de participants min: 2<br />
                        userTeam: {userTeam}
                    </div>
                    <div className="col col-md-12 text-center mt-2">
                        <h5>Choisis ton camp!</h5>
                        <div className="row justify-content-center align-items-center">
                            <div className={classNames("col col-md-6", styles.teamSelect, userTeam === event?.home_team_id && styles.selected)} onClick={() => setUserTeam(event?.home_team_id)}>
                                <Image src={`/images/teams/${event?.home_team_image}`} alt="home team flag" width="50px" height="50px" />
                                <h6>{event?.home_team_name}</h6>
                                {/* <h6>{event?.home_team_id}</h6> */}
                            </div>
                            <div className={classNames("col col-md-6", styles.teamSelect, userTeam === event?.visitor_team_id && styles.selected)} onClick={() => setUserTeam(event?.visitor_team_id)}>
                                <Image src={`/images/teams/${event?.visitor_team_image}`} alt="visitor team flag" width="50px" height="50px" />
                                <h6>{event?.visitor_team_name}</h6>
                                {/* <h6>{event?.visitor_team_id}</h6> */}
                            </div>
                        </div>
                    </div>
                    <div className="col col-md-12 text-center mt-2">
                        <div className={classNames("btn btn-md", !userTeam && "disabled")} style={{ background: 'orangered', color: '#fff' }} onClick={() => launchAction(userAction)}>{t('launch')}</div>
                    </div>
                </Modal.Body>
            </Modal>

            {
                event && (
                    <div className={classNames('row', styles.backgroundImage)}>
                        <div className={classNames('row gx-0 mb-2 px-2 py-3', styles.header)} style={{ border: '2px solid white' }}>
                            <div className={classNames('col col-4 text-start', styles.textShadow)}>{event.league.name}</div>
                            <div className={classNames('col col-4 text-center', styles.textShadow)}>
                                {moment(event.date).format('ll')}&nbsp;{moment(event.date).format('HH:mm')}
                            </div>
                            <div className={classNames('col col-4 text-end', styles.textShadow)}>{event.round} Round</div>
                        </div>
                        <div className={classNames('row gx-0 my-2 align-items-center py-3')} style={{ border: '2px solid orange' }}>
                            <div className={classNames('col col-md-1', styles.teamFlag)}>
                                <Image src={`/images/teams/${event.home_team_image}`} alt="home team flag" width="100%" height="100%" />
                            </div>
                            <div className={classNames('col col-md-3')}>
                                <div className={classNames('mx-3 py-2', styles.scorePF)}>1234.99 PF</div>
                            </div>
                            <div className={classNames('col col-md-4')}>
                                <div className={classNames('mx-5', styles.matchStatus)}>
                                    {event.status}
                                    <br />
                                    {event.elapsed_time}min
                                </div>
                            </div>
                            <div className={classNames('col col-md-3')}>
                                <div className={classNames('mx-3 py-2', styles.scorePF)}>1369.74 PF</div>
                            </div>
                            <div className={classNames('col col-md-1', styles.teamFlag)}>
                                <Image src={`/images/teams/${event.visitor_team_image}`} alt="visitor team flag" width="100%" height="100%" />
                            </div>
                        </div>
                        <div className="row gx-0 my-3 px-0 align-items-center" style={{ border: '2px solid blue' }}>
                            <div className={classNames('col col-md-5')}>
                                <div className={classNames('mx-2', styles.team)}>{event.home_team_name}</div>
                            </div>
                            <div className={classNames('col col-md-2')}>
                                <div className={classNames('mx-2', styles.scoreRealtime)}>
                                    Score réel
                                    <br />
                                    {event.home_team_score}-{event.visitor_team_score}
                                </div>
                            </div>
                            <div className={classNames('col col-md-5')}>
                                <div className={classNames('mx-2', styles.team)}>{event.visitor_team_name}</div>
                            </div>
                        </div>
                        <div className="row gx-0 my-3" style={{ border: '2px solid purple' }}>
                            <div className={classNames('col col-md-6', styles.matchInfoLeft)}>
                                <ul>
                                    {event.events &&
                                        event.events
                                            .sort((a, b) => b.time.elapsed - a.time.elapsed)
                                            .map((event, index) => {
                                                return (
                                                    <li key={index} style={{ border: '1px solid black', marginBottom: '10px' }}>
                                                        Type: {event.type}
                                                        <br />
                                                        Time: {event.time?.elapsed}
                                                        <br />
                                                        Team: {event.team?.name}
                                                        <br />
                                                        Player: {event.player?.name}
                                                        <br />
                                                    </li>
                                                )
                                            })}
                                </ul>
                            </div>
                        </div>
                        <div className="row justify-content-center gx-0 my-3" style={{ border: '2px solid green' }}>
                            <div className={classNames('col col-md-4', styles.playerScore)}>
                                Ton score
                                <br />
                                <span style={{ color: 'orangered' }}>0.00 PF</span>
                            </div>
                        </div>
                        <div className="row gx-0 my-3" style={{ border: '2px solid grey' }}>
                            <div className={classNames('col col-md-12', styles.gameScoreProgression, styles.textShadow)}>
                                <div className="mb-2">Barre de progression du score</div>
                                <div className="progress" style={{ height: '20px', backgroundColor: 'red' }}>
                                    <div className="progress-bar w-50" role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            <div className={classNames('row gx-0', styles.actions)}>
                <div className="row gx-0 py-2">
                    <div className="col col-md-6">
                        <div className="text-end">
                            <button className="btn btn-danger text-end mx-2">Retour aux Events</button>
                        </div>
                    </div>
                    <div className="col col-md-6">
                        <div className="text-start">
                            <button className="btn btn-success text-start mx-2">Je veux voir ce match!</button>
                        </div>
                    </div>
                </div>
                <div className="row gx-0">
                    <div className={classNames('col col-md-12', styles.banner)}>
                        <h2 className={classNames('text-center py-1', styles.textShadow)}>Fans participants à l event</h2>
                    </div>
                    <EventUsers event={event} />
                </div>
                <div className="row gx-0">
                    <div className={classNames('col col-md-12', styles.banner)}>
                        <h2 className={classNames('text-center py-1', styles.textShadow)}>Actions à utiliser durant l event</h2>
                    </div>
                    {auth.id ? (
                        <div className="col col-md-12 mt-1 mb-3">
                            <div className="row justify-content-center">
                                {actions.map((action, index) => {
                                    return (
                                        <div key={index} className={classNames("col col-md-1", styles.actionButton)}>
                                            <Image src={`/images/actions/${action.image}`} width="100%" height="100%" alt={action.name} className={classNames("")} onClick={() => (setUserActionModal(true), setUserAction(action))} />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="col col-md-12 text-center">
                            <h5 className={classNames(styles.textPrimary)}>Tu n as pas encore participé au match !</h5>
                        </div>
                    )}
                </div>
                <div className="row gx-0">
                    <div className={classNames('col col-md-12', styles.banner)}>
                        <h2 className={classNames('text-center py-1', styles.textShadow)}>Actions collectives réalisées par les fans</h2>
                    </div>
                    <EventActions homeTeamId={event?.home_team_id} visitorTeamId={event?.visitor_team_id} />
                </div>
                <div className="row gx-0">
                    <div className={classNames('col col-md-12', styles.banner)}>
                        <h2 className={classNames('text-center py-1', styles.textShadow)}>Liste de tes actions</h2>
                    </div>
                    <div className="col col-md-12 text-center">
                        {/* <h5 className={classNames(styles.textPrimary)}>Il faut que tu aies participés au match pour pouvoir prendre part aux actions collectives!</h5> */}
                        <EventUserActions />
                    </div>
                </div>
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
