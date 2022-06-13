import { redirect } from 'next/dist/server/api-utils'
import React, { useEffect } from 'react'
import { ReactElement, useState, useRef } from 'react'
import mergeImages from 'merge-images';

import { supabase } from '../utils/supabaseClient'
import Layout from '../components/Layout'
import NestedLayout from '../components/LayoutFrontend'
import BackgroundImages from '../components/Avatar/Background'
import SkinImages from '../components/Avatar/Skin'

type ImagesToMerge = {
    background: string
    skin: string
}

export default function AvatarPage() {
    const ref = useRef(null);
    const [arrayOfImagesToMerge, setArrayOfImagesToMerge] = useState<any>([])
    const [objectOfImagesToMerge, setObjectOfImagesToMerge] = useState<ImagesToMerge>({
        background: '',
        skin: ''
    })
    const [background, setBackground] = useState<string>('')
    const [skin, setSkin] = useState<string>('')

    useEffect(() => {
        const el2 = ref.current;
        console.log('el2: ', el2);
        merge()
    }, []);

    const merge = () => {
        mergeImages(['/body.png', '/eyes.png', '/mouth.png']).then(b64 => ref.current.src = b64);
    }

    const saveImage = async () => {
        console.log('saveImage')
        const avatarFile = ref.current.src
        console.log('avatarFile: ', avatarFile)

        const url = avatarFile;
        const res = await fetch(url)
        const blob = await res.blob()
        const file = new File([blob], "File name", { type: "image/png" })
        console.log('file: ', file)

        const {data, error } = await supabase
            .storage
            .from('avatars')
            .upload('public/avatar1.png', file)
        console.log('error: ', error);
        console.log('data: ', data);
    }

    const setAvatarImage2 = (value) => {
        console.log('setAvatarImage2: ', value);
        setObjectOfImagesToMerge({...objectOfImagesToMerge })
        console.log('objectOfImagesToMerge: ', objectOfImagesToMerge);
    }

    return (
        <>
            <h1>Avatar</h1>

            <BackgroundImages setAvatarImage={setAvatarImage2}/>
            <SkinImages />

            <img src="" ref={ref} width="200" height="200" style={{ border: '1px solid red' }} />
            <button onClick={() => saveImage()}>Save image</button><br />
        </>
    )


}

AvatarPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            <NestedLayout>{page}</NestedLayout>
        </Layout>
    )
}