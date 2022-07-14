import { ReactElement, useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Badge from 'react-bootstrap/Badge'
import moment from 'moment'
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import classNames from 'classnames'

import { supabase } from '../utils/supabaseClient'
import Layout from './Layout'
import NestedLayout from './LayoutFrontend'
import styles from '../styles/Event.module.css'

import { useAppSelector, useAppDispatch } from '../app/hooks'
import { selectAuth, incrementPoints } from '../features/auth/authSlice'
import { selectActions } from '../features/actions/actionsSlice'
import { selectEventActions, setEventActions, addEventAction } from '../features/eventActions/eventActionsSlice'
import { selectEventUserActions, setEventUserActions, addEventUserAction } from '../features/eventUserActions/eventUserActionsSlice'

import { decrement, increment, incrementByAmount, incrementAsync, incrementIfOdd, selectCount } from '../features/counter/counterSlice'

import { Event, Action, EventAction, EventUserAction } from '../app/interfaces'

type EffectCallback = () => void | (() => void | undefined)

export default function EventUsers() {
    const dispatch = useAppDispatch()
    const auth = useAppSelector(selectAuth)
    const router = useRouter()
    const { id } = router.query
    const [isLoading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState(null)
    const [event, setEvent] = useState(null)
    const [updateEvent, handleUpdateEvent] = useState(null)
    const [eventUsers, setEventUsers] = useState<any>(null)
    const [eventAction, setEventAction] = useState<any>(null)
    const [eventActionModal, setEventActionModal] = useState<boolean>(false)

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
            .select(`id, event_id, user_id`)
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
                .subscribe()
        } else {
            console.log('[removeSubscription] getEventActionsAndSubscribe')
            supabase.removeSubscription(subscriptionEventActions)
        }
    }


    return (
        <div className="row">
            {eventUsers &&
                eventUsers.map((user, index) => {
                    return (
                        <div
                            key={index}
                            className={classNames('col col-md-2 mx-2', styles.eventButton)}
                            style={{ position: 'relative' }}
                        >
                            <Image src={`https://buzgvkhmtkqhimaziafs.supabase.co/storage/v1/object/public/avatars/public/${user.user_id}.png`} width="100%" height="100%" />
                            {/* user.user_id: {user.user_id} */}
                        </div>
                    )
                })}
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
