export default function Skin (props) {
    return (
        <>
            <img src="/images/avatars/skin/skin0101.png" width="100" onClick={() => props.setAvatarImage({ type: 'skin', image: 'skin0101' })} />
            <img src="/images/avatars/skin/skin0102.png" width="100" onClick={() => props.setAvatarImage({ type: 'skin', image: 'skin0102' })} />
        </>
    )
}