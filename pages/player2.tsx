import { ReactElement, useState, useEffect } from 'react'
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classnames"
import styles from '../styles/Player.module.css'


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
					<span className={classNames(styles.menuBox, styles.orangered)}><FontAwesomeIcon
						icon={faStar}
						style={{ fontSize: 20 }}
					/>&nbsp;Niv. 1 -&nbsp;
						<FontAwesomeIcon
							icon={faAngleDoubleUp}
							style={{ fontSize: 20 }}
						/>&nbsp;1/10</span>
				</div>
				<div className="col">
					<span className={classNames(styles.menuBox, styles.green)}><FontAwesomeIcon
						icon={faDollarSign}
						style={{ fontSize: 20 }}
					/>&nbsp;500</span>
				</div>
				<div className="col">
					<span className={classNames(styles.menuBox, styles.yellow)}><FontAwesomeIcon
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
					<div className={styles.boxShadow}>
						<img src="/images/163.png" width="60px" />
						<span className={classNames(styles.textSubTitle)}>CarolineKaeser</span>
						<img src="/images/cup.png" width="60px" />
						<span className={classNames(styles.textSubTitle)}>1863ème</span>
					</div>
				</div>
				<div className="col col-lg-1">
					<div className={styles.boxShadow}>
						<img src="/images/parametre.png" width="100%" />
					</div>
				</div>
			</div>
			<div className="row my-2">
				<div className="col col-sm-12 col-md-6">
					<p className={classNames("text-center", "text-uppercase", "py-4", styles.box, styles.textTitle)}>Tes équipes</p>
				</div>
				<div className="col col-sm-12 col-md-6">
					<p className={classNames("text-center", "text-uppercase", "py-4", styles.box, styles.textTitle)}>Ton inventaire</p>
				</div>
			</div>
			{/* <div className="row justify-content-md-center my-2">
				<div className={classNames("col", "col-sm-8", "text-center", "text-uppercase", styles.box)}>
					<h2 className={classNames(styles.textTitle)}>XP/Actions</h2>
				</div>
			</div> */}

			{/* <div className={classNames("container fixed-bottom", styles.footer)} style={{ height: '100px' }}>
				<div className="row justify-content-md-center align-items-center">
					<div className={"d-flex align-content-center flex-wrap"}>abc</div>
				</div>
			</div> */}

			<div className="d-flex align-content-center flex-wrap" style={{ height: '200px', border: '1px solid orange' }}>
				<ul>
					<li>abc</li>
					<li>def</li>
					<li>ghi</li>
				</ul>
			</div>

			<div className="align-self-center" style={{ height: '100px', border: '1px solid green' }}>Aligned flex item</div>

			<footer className={classNames("container fixed-bottom", styles.footer)}>
				<div className="row">
					<div className="d-flex align-content-center flex-wrap" style={{ height: '200px', border: '1px solid orange' }}>
						<ul className="list-inline mx-auto justify-content-center" style={{ border: '1px dashed white', width: '100%' }}>
							<li className={classNames("list-inline-item", "mx-0", styles.listItem)} style={{ border: '1px solid blue', width: '17%' }}>
								<img src="/images/menuShop.png" width="60" />
								<span className={classNames(styles.textMenu)}>FanShop</span>
							</li>
							<li className={classNames("list-inline-item", "mx-0", styles.listItem)} style={{ border: '1px solid blue', width: '17%' }}>
								<img src="/images/menuCollection.png" width="60" />
								<span className={styles.textMenu}>Collection</span>
							</li>
							<li className={classNames("list-inline-item", "mx-0", styles.listItem)} style={{ border: '1px solid blue', width: '17%' }}>
								<img src="/images/menuHome.png" width="60" />
								<span className={styles.textMenu}>ThisIsFan</span>
							</li>
							<li className={classNames("list-inline-item", "mx-0", styles.listItem)} style={{ border: '1px solid blue', width: '17%' }}>
								<img src="/images/menuSocial.png" width="60" />
								<span className={styles.textMenu}>Social</span>
							</li>
							<li className={classNames("list-inline-item", "mx-0", styles.listItem)} style={{ border: '1px solid blue', width: '17%' }}>
								<img src="/images/menuResultat.png" width="60" />
								<span className={styles.textMenu}>Résultat</span>
							</li>
						</ul>
					</div>
				</div>
			</footer>
		</div>
	)
}
