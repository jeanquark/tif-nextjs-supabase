import { redirect } from 'next/dist/server/api-utils'
import React, { useEffect } from 'react'
import { ReactElement, useState, useRef } from 'react'
import mergeImages from 'merge-images';

import { supabase } from '../utils/supabaseClient'
import { useAppSelector } from '../app/hooks'
import { selectAuth } from '../features/auth/authSlice'

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
    const auth = useAppSelector(selectAuth)
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

    useEffect(() => {
        console.log('[useEffect] objectOfImagesToMerge: ', objectOfImagesToMerge)
        merge()
    }, [objectOfImagesToMerge])

    const merge = async () => {
        try {
            const imagesArray = Object.values(objectOfImagesToMerge)
            console.log('imagesArray: ', imagesArray);
            const b64 = await mergeImages(imagesArray)
            ref.current.src = b64;
            // const b64 = await mergeImages(['/images/body.png', '/images/eyes.png', '/images/mouth.png'])
            // ref.current.src = b64;
        } catch (error) {
            console.log('error: ', error);
        }
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

        const { data, error } = await supabase
            .storage
            .from('avatars')
            .upload(`public/${auth.id}.png`, file)
    }

    const updateAvatar = async () => {
        try {
            const avatarFile = ref.current.src
            const url = avatarFile;
            const res = await fetch(url)
            const blob = await res.blob()
            const file = new File([blob], "File name", { type: "image/png" })
            console.log('file: ', file)

            const { data, error } = await supabase
                .storage
                .from('avatars')
                .update(`public/${auth.id}.png`, file, {
                    cacheControl: '3600',
                    upsert: true
                })
        } catch (error) {
            console.log('error: ', error);
        }
    }

    const deleteAvatar = async () => {
        try {
            const { data, error } = await supabase
                .storage
                .from('avatars')
                .remove([`public/${auth.id}.png`])
            console.log('error: ', error);
            console.log('data: ', data);
        } catch (error) {
            console.log('error: ', error);
        }
    }

    const setAvatarImage2 = (value) => {
        // console.log('setAvatarImage2: ', value);
        // console.log('value.type: ', value.type)
        setObjectOfImagesToMerge({
            ...objectOfImagesToMerge, ...{
                [value.type]: `/images/avatars/${value.type}/${value.image}.png`
            }
        })

        // setState({objectOfImagesToMerge: {...objectOfImagesToMerge, ...{
        //     [value.type]: `/images/avatars/${value.type}/${value.image}.png`
        // }}}, function () {
        //     console.log('objectOfImagesToMerge: ', objectOfImagesToMerge);
        // });


        console.log('objectOfImagesToMerge: ', objectOfImagesToMerge);
        // merge()
    }

    return (
        <>
            <h1>Avatar</h1>

            <BackgroundImages setAvatarImage={setAvatarImage2} />
            <SkinImages setAvatarImage={setAvatarImage2} />

            <img src="" ref={ref} width="200" height="200" style={{ border: '1px solid red' }} /><br />
            <button onClick={() => saveImage()}>Save image</button><br />
            <button onClick={() => updateAvatar()}>Update image</button><br />
            <button onClick={() => deleteAvatar()}>Delete image</button><br />
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