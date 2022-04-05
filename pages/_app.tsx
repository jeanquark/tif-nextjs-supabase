// import '../styles/globals.css'

// function MyApp({ Component, pageProps }) {
//   return <Component {...pageProps} />
// }

// export default MyApp




// import '../styles/globals.css'
// import { Provider } from 'react-redux'
// import type { AppProps } from 'next/app'
// import store from '../app/store'

// // function MyApp({ Component, pageProps }) {
// export default function MyApp({ Component, pageProps }: AppProps) {

// 	return (
// 		<Provider store={store}>
// 			<Component {...pageProps} />
// 		</Provider>
// 	)
// }




import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import store from '../app/store'
import '../styles/globals.css'


type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	// Use the layout defined at the page level, if available
	const getLayout = Component.getLayout ?? ((page) => page)

	//   return getLayout(<Component {...pageProps} />)
	return <Provider store={store}>{getLayout(<Component {...pageProps} />)}</Provider>
}