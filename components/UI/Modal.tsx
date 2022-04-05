import { MutableRefObject, useRef } from 'react'
import styles from '../../styles/Modal.module.css'

type ModalProps = {
	handleClose: () => void
	show: boolean
	children: React.ReactNode
}

// export const Modal = ({ handleClose, show, children }) => {
export const Modal = ({ handleClose, show, children }: ModalProps) => {
	const showHideClassName = show ? styles.modal && styles.modal : styles.modal && styles.displayNone;
	const modalWrapperRef = useRef() as MutableRefObject<HTMLDivElement>;

	function handleClick(e) {
		e.preventDefault();
		const clickedOnBackdrop = !modalWrapperRef.current.contains(e.target)
		if (clickedOnBackdrop) {
			// console.log('Le lien a été cliqué')
			handleClose()
		}
	  }


	return (
		<div className={showHideClassName} onClick={handleClick}>
			<section className={styles.modalMain} ref={modalWrapperRef}>
				<h2>Modal</h2>
				{children}

				<button type="button" onClick={handleClose}>
					Close
				</button>
			</section>
		</div>
	);
};