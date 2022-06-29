import Navbar from './Navbar'
// import '../styles/frontend-layout.css'
// import '../styles/Layout.module.css'
import styles from '../styles/Layout.module.css'
import Standing from './Standing'
import { useTranslation } from "next-i18next";


export default function LayoutFrontend({ children }) {
	const { t } = useTranslation(['home']);

	return (
		<>
			<div className={styles.container}>
				{/* <h1>LayoutFrontend</h1> */}
				<header id="pageHeader" className={styles.pageHeader}><Navbar /></header>
				<article id="mainArticle" className={styles.mainArticle}>{children}</article>
				{/* <nav id="mainNav" className={styles.mainNav}><Standing /></nav> */}
				<nav id="mainNav" className={styles.mainNav}>
					{/* {t('standing')} */}
					<Standing />
				</nav>
				<div id="siteAds" className={styles.siteAds}>{t('ads')}</div>
				<footer id="pageFooter" className={styles.pageFooter}>{t('footer')}</footer>
			</div>
		</>
	)
}

// const globalStyle = `body {
//     background-color: red;
// }`

