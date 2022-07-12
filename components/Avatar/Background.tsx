import styles from '../../styles/Home.module.css'

export default function Background(props) {
    const images = ['0101', '0102', '0103', '0104', '0105', '0106', '0107', '0108', '0109', '0110', '0111', '0112', '0113', '0114', '0115', '0116', '0117', '0118', '0119', '0120', '0201', '0202', '0203', '0204', '0205', '0206', '0207', '0208', '0209', '0210', '0211', '0212', '0213', '0214', '0215', '0216', '0217', '0218', '0219', '0220']
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