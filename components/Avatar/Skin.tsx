import styles from '../../styles/Home.module.css'

export default function Skin(props) {
    return (
        <>
            <div className="col col-sm-1">
                <img src="/images/avatars/skin/skin0101.png" width="100" className={styles.image} onClick={() => props.setAvatarImage({ type: 'skin', image: 'skin0101' })} />
            </div>
            <div className="col col-sm-1">
                <img src="/images/avatars/skin/skin0102.png" width="100" className={styles.image} onClick={() => props.setAvatarImage({ type: 'skin', image: 'skin0102' })} />
            </div>
        </>
    )
}