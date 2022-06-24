import { ReactElement, useState, useEffect } from 'react'
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import styles from '../styles/Player.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// import the icons you need
import {
	faStar,
	faAngleDoubleUp,
	faDollarSign,
	faCertificate
} from "@fortawesome/free-solid-svg-icons"

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ['common', 'home']))
		},
	}
}

export default function PlayerPage({ data }) {

	useEffect(() => {
		console.log('[useEffect]')
	}, [])

	return (
		<div className="container" style={{ border: "1px solid red" }}>
			<div className="row mt-2">
				<div className="col">
					<span className={styles.levelBox}><FontAwesomeIcon
						icon={faStar}
						style={{ fontSize: 20 }}
					/>&nbsp;Niv. 1 -&nbsp;
					<FontAwesomeIcon
						icon={faAngleDoubleUp}
						style={{ fontSize: 20 }}
					/>&nbsp;1/10</span>
				</div>
				<div className="col">
					<span className={styles.dollarBox}><FontAwesomeIcon
						icon={faDollarSign}
						style={{ fontSize: 20 }}
					/>&nbsp;500</span>
				</div>
				<div className="col">
					<span className={styles.tokenBox}><FontAwesomeIcon
						icon={faCertificate}
						style={{ fontSize: 20 }}
					/>&nbsp;5</span>
				</div>
			</div>

			<div className="row">
				<div className="col col-lg-1">
					<div className={styles.boxShadow}>
						<img src="/images/avatar.png" width="100%" className="p-1" />
					</div>
				</div>
				<div className="col col-lg-10 text-center" style={{ border: "1px solid red" }}>
					{/* flex-container-modalProfil */}
					{/* <a href="monProfil.html" className={styles.boxShadow} style={{flexGrow: 1 }}>
						<div className="columnProfil"><img src="/images/163.png" className="imgModalProprieteFlags"/> <span className="modalPropriete">CarolineKaeser</span> <span className="modalProprietePlace boxShadow"><img src="/images/cup.png" className="imgModalProprieteCup"/> 1863ème</span></div>
					</a> */}
					<div className={styles.boxShadow}>
						<img src="/images/163.png" width="60px" />
						<span>CarolineKaeser</span>
						<img src="/images/cup.png" width="60px" />
						<span>1863ème</span>
					</div>
				</div>
				<div className="col col-lg-1">
					{/* <a href="mesPreferences.html" className={styles.boxShadow} style={{flexBasis: "60px"}}><img src="/images/parametre.png" className={styles.imgParametre}/></a> */}
					<div className={styles.boxShadow}>
						<img src="/images/parametre.png" width="100%" />
					</div>
				</div>
			</div>
			{/* <div id="header" className="col-12 col-sm-12 col-md-12 col-lg-12 top-fixed">
				<div className="flex-container-header">
					<div className="column">
						<span className="level-box"><i className="fas fa-star"></i> Niv. 1 - <i className="fas fa-angle-double-up"></i> 1 / 10</span>						
					</div>
					<div className="column">
						<div className="dollar-box"><i className="fas fa-dollar-sign"></i> 500</div>						
					</div>
					<div className="column">
						<div className="token-box"><i className="fas fa-certificate"></i> 5</div>					
					</div>
				</div>
			</div> */}
		</div>
	)
}
