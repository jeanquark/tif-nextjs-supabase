import { getImageSize } from 'next/dist/server/image-optimizer'
import styles from '../../styles/Home.module.css'

export default function Skin(props) {
    const images = ['0101', '0102', '0103', '0104', '0105', '0106', '0107', '0108', '0109', '0110', '0111', '0112', '0113', '0114', '0115', '0116', '0117', '0118', '0119', '0120', '0121', '0122', '0123']
    return (
        <>
            {images.map((image, index) => (
                <div className="col col-xs-6 col-sm-4 col-md-3 col-lg-2" key={index}>
                    {<img src={`/images/avatars/skin/skin${image}.png`} width="100%" className={styles.image} onClick={() => props.setAvatarImage({ type: 'skin', image: `skin${image}` })} />}
                </div>
            ))}
        </>
    )
}