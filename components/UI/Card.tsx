import { MutableRefObject, useRef } from 'react'
import styles from '../../styles/UI/Card.module.css'
import classNames from "classnames"
import Link from 'next/link'


type CardProps = {
	children: React.ReactNode
}

export const Card = ({ event, children }: any) => {

	return (
		<Link href={`/events/${event.id}`} passHref>
		<div className={classNames("card", styles.card)} style={{}}>
			<div className="card-body" style={{}}>
				<div className="card-text">{children}</div>
			</div>
		</div>
		</Link>
	);
};