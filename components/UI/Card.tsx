import { MutableRefObject, useRef } from 'react'
import styles from '../../styles/Card.module.css'

type CardProps = {
	children: React.ReactNode
}

export const Card = ({ event, children }: any) => {

	return (
		<div className={styles.card}>
			{/* {event.home_team_name} - {event.visitor_team_name}
			{event.id}<br /> */}
			{children}
		</div>
	);
};