import styles from '../../styles/Home.module.css'

export default function Beard(props) {
    const images = ['0101', '0201', '0301', '0401']
    return (
        <>
            {images.map((image, index) => (
                <div className="col col-xs-6 col-sm-4 col-md-3 col-lg-2" key={index}>
                    {<img src={`/images/avatars/beard/beard${image}.png`} width="100%" className={styles.image} onClick={() => props.setAvatarImage({ type: 'beard', image: `beard${image}` })} />}
                </div>
            ))}
        </>
    )
}