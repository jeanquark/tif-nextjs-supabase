import styles from '../../styles/Home.module.css'

export default function Background(props) {

    return (
        <>
            <img src="/images/avatars/background/background01002.png" width="100" className={styles.image} onClick={() => props.setAvatarImage({ type: 'background', image: 'background01002' })} />
            <img src="/images/avatars/background/background01003.png" width="100" className={styles.image} onClick={() => props.setAvatarImage({ type: 'background', image: 'background01003' })} />
        </>
    )
}