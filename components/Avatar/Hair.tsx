import styles from '../../styles/Home.module.css'

export default function Hair(props) {
    const images = ['0101', '0102', '0103', '0104', '0105', '0106', '0107', '0108', '0109', '0110', '0111', '0112']
    return (
        <>
            {images.map((image, index) => (
                <div className="col col-xs-6 col-sm-4 col-md-3 col-lg-2" key={index}>
                    {<img src={`/images/avatars/hair/hair${image}.png`} width="100%" className={styles.image} onClick={() => props.setAvatarImage({ type: 'hair', image: `hair${image}` })} />}
                </div>
            ))}
        </>
    )
}