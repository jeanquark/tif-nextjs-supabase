import styles from '../../styles/Home.module.css'

export default function Mouth(props) {
    const images = ['0101', '0201', '0301', '0401', '0501', '0601', '0701', '0801', '0901', '1001', '1101', '1201']
    return (
        <>
            {images.map((image, index) => (
                <div className="col col-xs-6 col-sm-4 col-md-3 col-lg-2" key={index}>
                    {<img src={`/images/avatars/mouth/mouth${image}.png`} width="100%" className={styles.image} onClick={() => props.setAvatarImage({ type: 'mouth', image: `mouth${image}` })} />}
                </div>
            ))}
        </>
    )
}