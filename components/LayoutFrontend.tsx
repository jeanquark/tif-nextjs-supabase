import Navbar from './Navbar'
// import '../styles/frontend-layout.css'
// import '../styles/Layout.module.css'
import styles from '../styles/Layout.module.css'
import { Head } from "next/document";
import Standing from './Standing'


export default function LayoutFrontend({ children }) {


	return (
		<>
			<div className={styles.container}>
				{/* <h1>LayoutFrontend</h1> */}
				<header id="pageHeader" className={styles.pageHeader}><Navbar /></header>
				<article id="mainArticle" className={styles.mainArticle}>{children}</article>
				<nav id="mainNav" className={styles.mainNav}><Standing /></nav>
				<div id="siteAds" className={styles.siteAds}>Ads</div>
				<footer id="pageFooter" className={styles.pageFooter}>Footer</footer>
			</div>
		</>
	)
}

// const globalStyle = `body {
//     background-color: red;
// }`

