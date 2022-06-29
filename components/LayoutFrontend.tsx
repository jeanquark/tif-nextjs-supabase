import Navbar from './Navbar'
import Standing from './Standing'
import { useTranslation } from "next-i18next";
import { ReactElement, useState, useEffect } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classnames"
import styles from '../styles/Player.module.css'

import {
	faStar,
	faAngleDoubleUp,
	faDollarSign,
	faCertificate
} from "@fortawesome/free-solid-svg-icons"
import Link from 'next/link'

export default function LayoutFrontend({ children }) {
	return (
		<div className="container" style={{ border: "1px solid red" }}>
			<div className="row my-2">
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

			<div className="row align-items-center">
				<div className="col col-lg-1">
					<div className={classNames(styles.link, styles.boxShadow)}>
						<Link href="/avatar">
							<img src="/images/avatar.png" width="100px" className="p-1" />
						</Link>
					</div>
				</div>
				<div className={classNames("col col-lg-10 align-self-stretch align-items-center", styles.boxShadow)} style={{ border: '1px dashed grey' }}>
					<div className="d-flex flex-row justify-content-center" style={{ border: '1px dashed pink' }}>
						<div className="d-flex align-items-center" style={{ border: '2px dashed grey' }}>
							<img src="/images/163.png" width="60px" style={{}} />
							<span className={classNames(styles.textSubTitle)} style={{ border: '1px dashed purple' }}>CarolineKaeser</span>
						</div>
						<div className="d-flex align-items-center" style={{ border: '2px dashed grey' }}>
							<img src="/images/cup.png" width="60px" />
							<span className={classNames(styles.textSubTitle)} style={{ border: '1px dashed purple' }}>1863ème</span>
						</div>
					</div>
				</div>
				<div className="col col-lg-1">
					<div className={styles.boxShadow} style={{ border: '1px dashed grey' }}>
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

			<main>
				{children}
			</main>

			<footer className={classNames("container fixed-bottom", styles.footer)}>
				<div className="row">
					<div className="d-flex align-content-center flex-wrap" style={{ height: '80px', border: '1px solid orange' }}>
						<ul className="list-inline mx-auto justify-content-center text-center" style={{ border: '1px dashed white', width: '100%' }}>
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
