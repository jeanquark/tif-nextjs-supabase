import { ReactElement, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import moment from 'moment';
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Badge from 'react-bootstrap/Badge';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import classNames from 'classnames';

import { supabase } from '../utils/supabaseClient'
import Layout from './Layout'
import NestedLayout from './LayoutFrontend'
import styles from '../styles/Event.module.css'

import { useAppSelector, useAppDispatch } from '../app/hooks'
import { selectAuth, incrementPoints } from '../features/auth/authSlice'
import { selectActions } from '../features/actions/actionsSlice'
import { selectEventActions, setEventActions, addEventAction } from '../features/eventActions/eventActionsSlice'
import { selectEventUserActions, setEventUserActions, addEventUserAction } from '../features/eventUserActions/eventUserActionsSlice'
import { Event, EventUser, Action, EventAction, EventUserAction } from '../app/interfaces'

type EffectCallback = () => void | (() => void | undefined)

export default function EventUsers({ event }) {
    const dispatch = useAppDispatch()
    const auth = useAppSelector(selectAuth)
    const router = useRouter()
    const { id } = router.query
    const [eventUsers, setEventUsers] = useState<EventUser[]>(null)

    // const [eventUsers, setEventUsers] = useState([])
    // const eventUsersRef = useRef<any>()
    // eventUsersRef.current = eventUsers

    let subscriptionEventUsers = null

    const { t } = useTranslation(['actions', 'common', 'home'])

    useEffect((): ReturnType<EffectCallback> => {
        console.log('[useEffect] subscribeToEvents id, auth: ', id)
        if (id != undefined) {
            // getEventUsersAndSubscribe(+id, +auth.id, username)
            getEventUsersAndSubscribe(+id)
        }
    }, [id])

    const getInitialEventUsers = async (id: number) => {
        console.log('getInitialEventUsers')
        const { data, error } = await supabase
            .from('event_users')
            .select('*')
            .eq('event_id', id)
            .order('id', { ascending: false })
        if (error) {
            return
        }
        console.log('event users data: ', data)
        setEventUsers(data)
        // dispatch(setEventUsers(data))
    }

    const getEventUsersAndSubscribe = async (id: number) => {
        console.log('getEventUsersAndSubscribe. id: ', id)
        getInitialEventUsers(id)
        if (!subscriptionEventUsers) {
            console.log('Not subscribed to eventUsers')
            subscriptionEventUsers = supabase
                .from(`event_users:event_id=eq.${id}`)
                .on('INSERT', (payload) => {
                    console.log('[INSERT] subscriptionEventUsers payload: ', payload.new)
                    // setEventUsers([...eventUsers, payload.new])
                    setEventUsers((a) => [payload.new, ...a])
                })
                .on('UPDATE', (payload) => {
                    console.log('[UPDATE] subscriptionEventUsers payload: ', payload.new)
                })
                .subscribe()
        } else {
            console.log('[removeSubscription] getEventUsersAndSubscribe')
            supabase.removeSubscription(subscriptionEventUsers)
        }
    }

    return (
        <div className="col col-sm-12">
            {/* teamId: {teamId} */}
            {/*  */}
            {eventUsers && eventUsers.length < 1
                ?
                <h5>Pas de fans pour {event?.home_team_name}</h5>
                :
                <div className="row">
                    <div className={classNames('col col-md-6 my-3 px-5', styles.borderRight)}>
                        {eventUsers && eventUsers.filter((user) => user.team_id == event?.home_team_id).map((user, index) => {
                            return (
                                <div
                                    key={index}
                                    className={classNames('col col-md-2 mx-2', styles.eventButton)}
                                    style={{ position: 'relative' }}
                                >
                                    <OverlayTrigger
                                        placement="right"
                                        overlay={
                                            <Tooltip id="tooltip-right" className="show">
                                                {user.username}
                                            </Tooltip>
                                        }
                                    >
                                        <div>
                                            <Image src={`https://buzgvkhmtkqhimaziafs.supabase.co/storage/v1/object/public/avatars/public/${user.user_id}.png`} width="100%" height="100%" />
                                            <Badge bg="primary" style={{ position: 'absolute', top: '0px', right: '0px' }}>
                                                {user.user_points}
                                            </Badge>
                                        </div>
                                    </OverlayTrigger>
                                </div>
                            )
                        })}
                    </div>
                    <div className={classNames('col col-md-6 my-3 px-5')}>
                        {eventUsers && eventUsers.filter((user) => user.team_id == event?.visitor_team_id).map((user, index) => {
                            return (
                                <div
                                    key={index}
                                    className={classNames('col col-md-2 mx-2', styles.eventButton)}
                                    style={{ position: 'relative' }}
                                >
                                    <OverlayTrigger
                                        placement="right"
                                        overlay={
                                            <Tooltip id="tooltip-right" className="show">
                                                {user.username}
                                            </Tooltip>
                                        }
                                    >
                                        <div>
                                            <Image src={`https://buzgvkhmtkqhimaziafs.supabase.co/storage/v1/object/public/avatars/public/${user.user_id}.png`} width="100%" height="100%" />
                                            <Badge bg="primary" style={{ position: 'absolute', top: '0px', right: '0px' }}>
                                                {user.user_points}
                                            </Badge>
                                        </div>
                                    </OverlayTrigger>
                                </div>
                            )
                        })}
                    </div>
                </div>
            }
        </div>
    )
}

EventUsers.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            <NestedLayout>{page}</NestedLayout>
        </Layout>
    )
}
