import { ReactElement, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import moment from 'moment'
import 'moment/locale/fr';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import classNames from "classnames"

import styles from '../styles/Player.module.css'
import Layout from '../components/Layout'
import { Card } from '../components/UI/Card'
import NestedLayout from '../components/LayoutFrontend'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { selectEvents, fetchEvents } from '../features/events/eventsSlice'
import Link from 'next/link';



const CountdownTimer = dynamic(
	() => import('../components/CountdownTimer'),
	{ ssr: false }
)
const DateSelection = dynamic(
	() => import('../components/DateSelection'),
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

	// const { data, error } = await supabase
	// 	.from('events')
	// 	.select('id, home_team_name, visitor_team_name, home_team_score, visitor_team_score, status, date, timestamp, updated_at')
	// 	.gt('timestamp', (current_timestamp - 240 * 60))
	// 	// .gt('timestamp', (current_timestamp))
	// 	.order('timestamp', { ascending: true })
	// 	.limit(12)
	// console.log('error: ', error);
	// console.log('data: ', data);
	// const data = []

	return {
		props: {
			// data,
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
	// console.log('timestamp: ', timestamp);
	// console.log('timestamp*1000: ', timestamp*1000)
	// console.log('Date.now(): ', Date.now())
	// console.log('diff: ', timestamp*1000 - Date.now())
	// console.log('12 * 60 * 60 * 1000: ', 12 * 60 * 60 * 1000)
	// console.log('(timestamp*1000 - Date.now()) < 12 * 60 * 60 * 1000: ', (timestamp*1000 - Date.now()) < 12 * 60 * 60 * 1000)
	return (timestamp * 1000 - Date.now() > 0 && timestamp * 1000 - Date.now() < 12 * 60 * 60 * 1000)
}




export default function HomePage({ data }) {
	const router = useRouter()
	const { t } = useTranslation(['home']);
	const events = useAppSelector(selectEvents)
	const dispatch = useAppDispatch()
	const [date, setDate] = useState<Date>();
	// const date = new Date();


	// useEffect((timestamp) => {
	// 	setCountdown(0);
	// }, [countdown]);

	useEffect(() => {
		console.log('[useEffect] fetchEvents')

		const datesInterval = {
			// date1: moment().add(-1, 'd').unix(),
			date1: moment().add(-2, 'days').startOf('day').unix(),
			// date2: moment().add(+1, 'd').unix()
			date2: moment().add(2, 'days').endOf('day').unix()
		}
		console.log('datesInterval: ', datesInterval);
		// if (events && events.length < 1) {
		dispatch(fetchEvents(datesInterval));
		// }
	}, [])

	return (
		<div className="">
			<div className="row my-2">
				<div className="col col-sm-12 col-md-6">
					<p className={classNames("text-center", "text-uppercase", "py-4", styles.box, styles.textTitle)}>Tes équipes</p>
				</div>
				<div className="col col-sm-12 col-md-6">
					<p className={classNames("text-center", "text-uppercase", "py-4", styles.box, styles.textTitle)}>Ton inventaire</p>
				</div>
			</div>
			<div className="row" style={{ height: '500px', border: '2px solid white' }}>
				{events && events.map((event: any) =>
					<div className="col col-md-3" key={event.id}>
						<Card>
							<h5 className="text-center">{event.home_team_name} - {event.visitor_team_name}</h5>
							<p>ID: {event.id}</p>
						</Card>
					</div>
				)}
			</div>
		</div>
	)
}

HomePage.getLayout = function getLayout(page: ReactElement) {
	return (
		<Layout>
			<NestedLayout>{page}</NestedLayout>
		</Layout>
	)
}
