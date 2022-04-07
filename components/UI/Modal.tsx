import { MutableRefObject, useRef } from 'react'
import styles from '../../styles/Modal.module.css'

type ModalProps = {
	handleClose: () => void
	show: Boolean
	children: React.ReactNode
}

// export const Modal = ({ handleClose, show, children }) => {
export const Modal = ({ handleClose, show, children }: ModalProps) => {
	const showHideClassName = show ? styles.modal : styles.modal && styles.displayNone;
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
				{children}

				<div style={{ margin: '20px 0px', textAlign: 'center' }}>
					<button type="button" onClick={handleClose}>
						Close
					</button>
				</div>
			</section>
		</div>
		// <>
		// 	<label htmlFor="checkbox">Toggle modal</label>
		// 	<input hidden type="checkbox" id="checkbox"></input>

		// 	<div className={styles.modalOverlay2}>
		// 		<div className={styles.modal2}>
		// 			Modal contents
		// 			<div>X</div>
		// 		</div>
		// 	</div>
		// </>
	);
};