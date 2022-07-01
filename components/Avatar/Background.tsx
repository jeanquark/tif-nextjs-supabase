import styles from '../../styles/Home.module.css'

export default function Background(props) {
    const images = ['01001', '01002', '01003', '01004', '01005', '01006', '01007', '01008', '01009', '01010', '01011', '01012']
    return (
        <>
            {images.map((image, index) => (
                <div className="col col-xs-6 col-sm-4 col-md-3 col-lg-2" key={index}>
                    {<img src={`/images/avatars/background/background${image}.png`} width="100%" className={styles.image} onClick={() => props.setAvatarImage({ type: 'background', image: `background${image}` })} />}
                </div>
            ))}
        </>
    )
}