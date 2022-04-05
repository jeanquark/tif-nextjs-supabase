import { ReactElement, useState } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import NestedLayout from '../components/LayoutFrontend'
import axios from 'axios'
import { supabase } from '../utils/supabaseClient'
import { Modal } from '../components/UI/Modal'

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
		.limit(10)
	console.log('error: ', error);
	// console.log('data: ', data);

	return {
		props: { data }, // will be passed to the page component as props
	}
}

export default function HomePage({ data }) {
	const [modal, setModal] = useState(false)
	const toggleModal = () => {
		setModal(!modal)
	}
	const closeModal = () => {
		setModal(false)
	}

	return (
		<>
			<h1>Current & next games</h1>
			{/* <div style={{ height: '400px', border: '1px dotted grey' }}>Box</div> */}
			<ul>
				{data.map((event: Event) =>
					<li key={event.id}>
						<Link href={`/events/${event.id}`}>
							<a>{ event.home_team_name} - {event.visitor_team_name}</a>
						</Link>
					</li>
				)}
			</ul>
			<Modal show={modal} handleClose={closeModal}>
				<p>Modal</p>
			</Modal>
			<button type="button" onClick={toggleModal}>Open modal</button>
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
