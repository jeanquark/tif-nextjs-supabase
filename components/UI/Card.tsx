import { MutableRefObject, useRef } from 'react'
import styles from '../../styles/Card.module.css'
import classNames from "classnames"


type CardProps = {
	children: React.ReactNode
}

export const Card = ({ event, children }: any) => {

	return (
		// <div className={styles.card}>
		// 	{children}
		// </div>

		<div className={classNames("card", styles.card)} style={{ backgroundColor: 'LightSlateGray' }}>
			<div className="card-body" style={{ backgroundColor: 'whitesmoke' }}>
				<div className="card-text">{children}</div>
			</div>
		</div>
	);
};