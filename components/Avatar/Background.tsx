import styles from '../../styles/Home.module.css'

export default function Background(props) {

    return (
        <>
            <div className="col col-sm-1">
                <img src="/images/avatars/background/background01002.png" width="100%" className={styles.image} onClick={() => props.setAvatarImage({ type: 'background', image: 'background01002' })} />
            </div>
            <div className="col col-sm-1">
                <img src="/images/avatars/background/background01003.png" width="100%" className={styles.image} onClick={() => props.setAvatarImage({ type: 'background', image: 'background01003' })} />
            </div>
        </>
    )
}