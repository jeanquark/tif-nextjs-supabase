import { ReactElement, useState } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import NestedLayout from '../components/LayoutFrontend'
import axios from 'axios'
import { supabase } from '../utils/supabaseClient'
import { Card } from '../components/UI/Card'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'

interface Event {
	id: number,
	home_team_name: string,
	visitor_team_name: string
}

export async function getServerSideProps() {
	// Run on the server everytime the page is visited
	console.log('[getServerSideProps]', new Date());
	const current_timestamp = Math.floor(Date.now() / 1000)
	console.log('current_timestamp: ', current_timestamp - (12 * 60 * 60));
	const { data, error } = await supabase
		.from('events')
		.select('id, home_team_name, visitor_team_name, date, timestamp')
		.gt('timestamp', current_timestamp)
		.order('timestamp', { ascending: true })
		.limit(10)
	console.log('error: ', error);
	// console.log('data: ', data);

	return {
		props: { data }, // will be passed to the page component as props
	}
}

export default function HomePage({ data }) {
	const router = useRouter()


	return (
		<>
			<h1>Current & next games</h1>
			{/* <div style={{ height: '400px', border: '1px dotted grey' }}>Box</div> */}
			<div className={styles.container}>
				{data.map((event: Event) =>
					<Link key={event.id} href={`/events/${event.id}`}>
						<a style={{ textDecoration: 'none' }}>
							<Card>
								{event.home_team_name} - {event.visitor_team_name}&nbsp;
								id: {event.id}
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
