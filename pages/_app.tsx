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




import { ReactElement, ReactNode, useEffect } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { appWithTranslation } from "next-i18next"
import store from '../app/store'
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css'

// Font Awesome
import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout
}

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
	// Use the layout defined at the page level, if available
	const getLayout = Component.getLayout ?? ((page) => page)

	useEffect(() => {
		import("bootstrap/dist/js/bootstrap");
	}, [])

	//   return getLayout(<Component {...pageProps} />)
	return <Provider store={store}>{getLayout(<Component {...pageProps} />)}</Provider>
}

export default appWithTranslation(MyApp)