import { ReactElement, useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Moment from 'react-moment';
import 'moment/locale/fr';

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import Layout from '../components/Layout'
import NestedLayout from '../components/LayoutFrontend'
import axios from 'axios'
import { supabase } from '../utils/supabaseClient'
import { Card } from '../components/UI/Card'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'

import { Event } from '../app/interfaces'
const CountdownTimer = dynamic(
    () => import('../components/CountdownTimer'),
    { ssr: false }
)


// interface Event {
// 	id: number,
// 	home_team_name: string,
// 	visitor_team_name: string,
// 	home_team_score: number,
// 	visitor_team_score: number,
// 	status: string,
// 	date: Date,
// 	timestame: number,
// 	updated_at: Date
// }

export async function getServerSideProps({ locale }) {
	// Run on the server everytime the page is visited
	console.log('[getServerSideProps]', new Date());
	const current_timestamp = Math.floor(Date.now() / 1000)
	console.log('current_timestamp: ', current_timestamp - (12 * 60 * 60));
	console.log('Supabase url: ', process.env.NEXT_PUBLIC_SUPABASE_URL)
	// console.log('Supabase anon key: ', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
	console.log('API_FOOTBALL_KEY: ', process.env.API_FOOTBALL_KEY)
	// const { data, error } = await supabase
	// 	.from('events')
	// 	.select('*')

	const { data, error } = await supabase
		.from('events')
		.select('id, home_team_name, visitor_team_name, home_team_score, visitor_team_score, status, date, timestamp, updated_at')
		.gt('timestamp', (current_timestamp - 240 * 60))
		// .gt('timestamp', (current_timestamp))
		.order('timestamp', { ascending: true })
		.limit(12)
	console.log('error: ', error);
	// console.log('data: ', data);
	// const data = []

	return {
		props: {
			data,
			...(await serverSideTranslations(locale, ['common', 'home']))
		}, // will be passed to the page component as props
	}
}

// const renderer = ({ hours, minutes, seconds }) => (
// 	<span>
// 	  {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
// 	</span>
// );

const eventInLessThan12Hours = (timestamp: number) => {
	return (timestamp*1000 - Date.now()) < 12 * 60 * 60 * 1000
}

const timeToKickOff = (timestamp: number) => {
	// if (process.browser) {

		return Date.now() + (timestamp*1000 - Date.now())
	// }
}



export default function HomePage({ data }) {
	const router = useRouter()
	const { t } = useTranslation(['home']);
	// const [countdown, setCountdown] = useState<number>();


	// useEffect((timestamp) => {
	// 	setCountdown(0);
	// }, [countdown]);

	return (
		<>
			<h1>{t('current_and_next_games')}</h1>
			{/* <div style={{ height: '400px', border: '1px dotted grey' }}>Box</div> */}
			{/* {Date()}<br /> */}
			{/* Date.now(): {Date.now()}<br />
					event.timestamp: {event.timestamp}<br /> */}
			Dernier déploiement: Jeudi 02 Juin, 15h44.
			<div className={styles.container}>
				{data && data.map((event: Event) =>
					<Link key={event.id} href={`/events/${event.id}`}>
						<a style={{ textDecoration: 'none' }}>
							<Card>
								<p style={{ textAlign: 'center' }}>{event.home_team_name} - {event.visitor_team_name}</p>
								<p style={{ textAlign: 'center' }}><Moment locale={router.locale} format="ll HH:mm">{event.date}</Moment></p>
								{/* eventInLessThan12Hours: {eventInLessThan12Hours(event.timestamp)} */}

							{event && eventInLessThan12Hours(event.timestamp) && <p style={{ textAlign: 'center' }}>
									{/* event.timestamp: {event.timestamp*1000 - Date.now()}<br /> */}
									{t('kick_off_in')}&nbsp;
									<CountdownTimer timestamp={event.timestamp} />
									{/* <Countdown
										date={timeToKickOff(event.timestamp)}
    									intervalDelay={0}
    									precision={0}
										renderer={({ hours, minutes, seconds }) => (
											<span>
											  {hours}h{zeroPad(minutes)}:{zeroPad(seconds)}
											</span>
										  )}
									/> */}
								</p>}
								{event && event.status != 'NS' && <p style={{ textAlign: 'center' }}>
									{event.home_team_score} - {event.visitor_team_score}
								</p>}
								<p style={{ textAlign: 'center' }}>Id: {event.id}</p>
							</Card>
						</a>
					</Link>
				)}

			</div>

		</>
	)
}

HomePage.getLayout = function getLayout(page: ReactElement) {
	return (
		<Layout>
			<NestedLayout>{page}</NestedLayout>
		</Layout>
	)
}
