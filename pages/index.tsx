import { ReactElement, useState } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import NestedLayout from '../components/LayoutFrontend'
import axios from 'axios'
import { supabase } from '../utils/supabaseClient'
import { Card } from '../components/UI/Card'
import { useRouter } from 'next/router'

interface Event {
	id: number,
	home_team_name: string,
	visitor_team_name: string
}

export async function getServerSideProps() {
	// Run on the server everytime the page is visited
	console.log('[getServerSideProps]', new Date());
	const { data, error } = await supabase
		.from('events')
		.select('id, home_team_name, visitor_team_name')
		.order('id', { ascending: true })
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
			<ul>
				{data.map((event: Event) =>
					<Link key={event.id} href={`/events/${event.id}`}>
						<a style={{ textDecoration: 'none' }}>
							<Card>
								{event.home_team_name} - {event.visitor_team_name}
								{event.id}
							</Card>
						</a>
					</Link>
				)}
			</ul>

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
