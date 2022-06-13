export default function Background(props) {

    return (
        <>
            <img src="/images/avatars/background/background01002.png" width="100" onClick={() => props.setAvatarImage({ type: 'background', image: 'background01002' })} />
            <img src="/images/avatars/background/background01003.png" width="100" onClick={() => props.setAvatarImage({ type: 'background', image: 'background01003' })} />
        </>
    )
}