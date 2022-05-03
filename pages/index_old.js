import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import Counter from '../features/counter/Counter'

export default function Home() {
	const [session, setSession] = useState(null)

	useEffect(() => {
		console.log('useEffect()')
		setSession(supabase.auth.session())

		// supabase.auth.onAuthStateChange((_event, session) => {
		// 	console.log('onAuthStateChange')
		// 	setSession(session)
		// })

		// Listen for changes on auth state (logged in, signed out, etc.)
		const { data: authListener } = supabase.auth.onAuthStateChange(
			async (_event, session) => {
				console.log('onAuthStateChange')
				//   setUser(session?.user ?? null)
				//   setLoading(false)
				setSession(session)
			}
		)

		console.log('authListener: ', authListener)
		return () => {
			console.log('unsubscribe')
			authListener.unsubscribe()
		}
	}, [])

	// useEffect(() => {
	// 	setSession(supabase.auth.session())
	// 	const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
    //         console.log('[Login] onAuthStateChange event: ', event)
	// 		setSession(session)
    //         // Send session to /api/auth route to set the auth cookie.
    //         // NOTE: this is only needed if you're doing SSR (getServerSideProps)!
    //         // fetch('/api/auth', {
    //         //     method: 'POST',
    //         //     headers: new Headers({ 'Content-Type': 'application/json' }),
    //         //     credentials: 'same-origin',
    //         //     body: JSON.stringify({ event, session }),
    //         // })
    //         //     .then((res) => res.json())
    //         //     .then(() => {
    //         //         setModal({ open: false })
    //         //         if (event === 'SIGNED_IN') {
    //         //             console.log('SIGNED_IN')
    //         //             userContext.setUser()
    //         //         }
    //         //     })
    //     })
    //     return () => {
	// 		console.log('authListener.unsubscribe()')
    //         authListener.unsubscribe()
    //     }
	// }, [])

	return (
		// <div className="container" style={{ padding: '50px 0 100px 0' }}>
		// 	{!session ? <Auth /> : <Account key={session.user.id} session={session} />}
		// </div>

		<div>
			<Counter />
		</div>
	)
}