import { MutableRefObject, useRef, useState } from 'react'
import styles from '../../styles/Modal2.module.css'

export const Modal2 = ({ children, handleClose }) => {
	const modalWrapperRef = useRef() as MutableRefObject<HTMLDivElement>;
	const [isModalOpen, setModalOpen] = useState(true)
	const closeModal = () => {
		console.log('closeModal')
		setModalOpen(false)
		handleClose()
	}

	return (
		<div className={isModalOpen ? `${styles.modal} ${styles.animateOpen}` : `${styles.modal} ${styles.animateClose}`}>
			<section className={styles.modalMain} ref={modalWrapperRef}>
				{children}

				<div style={{ margin: '20px 0px', textAlign: 'center' }}>
					<button type="button" onClick={closeModal}>
						Close
					</button>
				</div>
			</section>
		</div>
	)
}