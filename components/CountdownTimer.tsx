import { useState, useEffect } from 'react'
import Countdown, { zeroPad } from 'react-countdown';


type ChildProps = {
	timestamp: number
}

const timeToKickOff = (timestamp: number) => {
	// if (process.browser) {
	return Date.now() + (timestamp * 1000 - Date.now())
	// }
}

export default function CountdownTimer(props: any) {
	return (
		<Countdown
			date={timeToKickOff(props.timestamp)}
			intervalDelay={0}
			precision={0}
			renderer={({ hours, minutes, seconds }) => (
				<span>
					{hours}h{zeroPad(minutes)}:{zeroPad(seconds)}
				</span>
			)}
		/>
	)
}