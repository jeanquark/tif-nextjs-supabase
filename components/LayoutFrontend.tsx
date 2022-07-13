import { useTranslation } from "next-i18next";
import { ReactElement, useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import Image from 'next/image';

import Navbar from './Navbar'
import styles from '../styles/Layout.module.css'
import {
	faStar,
	faAngleDoubleUp,
	faDollarSign,
	faCertificate
} from "@fortawesome/free-solid-svg-icons"
import Link from 'next/link'

export default function LayoutFrontend({ children }) {
	return (
		<div className="min-vh-100" style={{ background: '#000' }}>
			<div className="container" style={{ border: "0px solid red" }}>
				<Navbar />

				<main className="" style={{ paddingBottom: '70px', border: '0px solid green' }}>
					{children}
				</main>

				<div className={classNames("fixed-bottom")}>
					<div className="container">
						<div className={classNames("row gx-0 mx-0", styles.footer)}>
							<div className="col col-md-12" style={{}}>
								<div className="d-flex align-content-center flex-wrap" style={{ height: '60px', border: '0px solid orange' }}>
									<ul className="list-inline mx-auto justify-content-center text-center" style={{ border: '0px dashed white', width: '100%' }}>
										<li className={classNames("list-inline-item", "mx-0", styles.listItem)} style={{ border: '0px solid blue', width: '17%' }}>
											<img src="/images/menuShop.png" width="60" />
											<span className={classNames(styles.textMenu)}>FanShop</span>
										</li>
										<li className={classNames("list-inline-item", "mx-0", styles.listItem)} style={{ border: '0px solid blue', width: '17%' }}>
											<img src="/images/menuCollection.png" width="60" />
											<span className={styles.textMenu}>Collection</span>
										</li>
										<li className={classNames("list-inline-item", "mx-0", styles.listItem)} style={{ border: '0px solid blue', width: '17%' }}>
											<Link href="/">
												<a>
													<img src="/images/menuHome.png" width="60" />
													{/* <Image src="/images/menuHome.png" width="60px" height="60px" alt="Home menu" /> */}
													<span className={styles.textMenu}>ThisIsFan</span>
												</a>
											</Link>
										</li>
										<li className={classNames("list-inline-item", "mx-0", styles.listItem)} style={{ border: '0px solid blue', width: '17%' }}>
											<img src="/images/menuSocial.png" width="60" />
											<span className={styles.textMenu}>Social</span>
										</li>
										<li className={classNames("list-inline-item", "mx-0", styles.listItem)} style={{ border: '0px solid blue', width: '17%' }}>
											<img src="/images/menuResultat.png" width="60" />
											<span className={styles.textMenu}>Résultat</span>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
