import { redirect } from 'next/dist/server/api-utils'
import React, { ReactElement, useState, useRef, useEffect } from 'react'
// import { ReactElement, useState, useRef } from 'react';
import mergeImages from 'merge-images'
import classNames from 'classnames'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'

import { supabase } from '../utils/supabaseClient'
import { useAppSelector } from '../app/hooks'
import { selectAuth } from '../features/auth/authSlice'
import styles from '../styles/Avatar.module.css'

import Layout from '../components/Layout'
import NestedLayout from '../components/LayoutFrontend'
import SkinImages from '../components/Avatar/Skin'
import EyesImages from '../components/Avatar/Eyes'
import MouthImages from '../components/Avatar/Mouth'
import BeardImages from '../components/Avatar/Beard'
import HairImages from '../components/Avatar/Hair'
import BackgroundImages from '../components/Avatar/Background'

type ImagesToMerge = {
    background: string
    skin: string
    eyes: string
    mouth: string
    beard: string
    hair: string
}

export default function AvatarPage() {
    const ref = useRef(null)
    const auth = useAppSelector(selectAuth)
    const [arrayOfImagesToMerge, setArrayOfImagesToMerge] = useState<any>([])
    const [objectOfImagesToMerge, setObjectOfImagesToMerge] = useState<ImagesToMerge>({
        background: '/images/avatars/background/background0101.png',
        // background: 'background01001',
        skin: '/images/avatars/skin/skin0101.png',
        eyes: '/images/avatars/eyes/eyes0101.png',
        mouth: '/images/avatars/mouth/mouth0101.png',
        beard: '/images/avatars/beard/beard0101.png',
        hair: '/images/avatars/hair/hair0101.png',
    })
    const [type, setType] = useState<string>('skin')
    // const [background, setBackground] = useState<string>('')
    // const [skin, setSkin] = useState<string>('')

    useEffect(() => {
        const el2 = ref.current
        console.log('el2: ', el2)
        merge()

        // updateUser()
    }, [])

    useEffect(() => {
        console.log('auth.image: ', auth.image)
        let abc
        if (auth.image) {
            abc = JSON.parse(JSON.stringify(auth.image))
            console.log('auth.image.background: ', abc.background)

            setObjectOfImagesToMerge({
                ...objectOfImagesToMerge,
                ...{
                    ['background']: `/images/avatars/background/${abc['background']}.png`,
                    ['skin']: `/images/avatars/skin/${abc['skin']}.png`,
                    ['eyes']: `/images/avatars/eyes/${abc['eyes']}.png`,
                    ['mouth']: `/images/avatars/mouth/${abc['mouth']}.png`,
                    ['beard']: `/images/avatars/beard/${abc['beard']}.png`,
                    ['hair']: `/images/avatars/hair/${abc['hair']}.png`,
                },
            })
        }
    }, [auth])

    useEffect(() => {
        console.log('[useEffect] objectOfImagesToMerge: ', objectOfImagesToMerge)
        merge()
    }, [objectOfImagesToMerge])

    const updateUser = async () => {
        // const { data, error } = await supabase.from('actions').select()
        const { data, error } = await supabase.from('users').upsert({ id: 4, image: 'hola.png' })
        console.log('data fetchUsers: ', data)
    }

    const merge = async () => {
        try {
            const imagesArray = Object.values(objectOfImagesToMerge)
            console.log('imagesArray: ', imagesArray)
            const b64 = await mergeImages(imagesArray)
            ref.current.src = b64
            // const b64 = await mergeImages(['/images/body.png', '/images/eyes.png', '/images/mouth.png'])
            // ref.current.src = b64;
        } catch (error) {
            console.log('error: ', error)
        }
    }

    const saveImage = async () => {
        console.log('saveImage')
        const avatarFile = ref.current.src
        console.log('avatarFile: ', avatarFile)

        const url = avatarFile
        const res = await fetch(url)
        const blob = await res.blob()
        const file = new File([blob], 'File name', { type: 'image/png' })
        console.log('file: ', file)

        const { data, error } = await supabase.storage.from('avatars').upload(`public/${auth.id}.png`, file)
        // .upload(`public/abc.png`, file)
        console.log('data: ', data)
        console.log('error: ', error)
    }

    const updateImage = async () => {
        try {
            console.log('updateImage')
            const avatarFile = ref.current.src
            const url = avatarFile
            const res = await fetch(url)
            const blob = await res.blob()
            const file = new File([blob], 'File name', { type: 'image/png' })
            console.log('file: ', file)

            const { data, error } = await supabase.storage.from('avatars').update(`public/${auth.id}.png`, file, {
                cacheControl: '3600',
                upsert: true,
            })
            console.log('data: ', data)
            console.log('error: ', error)

            const { publicURL } = supabase.storage.from('avatars').getPublicUrl(`public/${auth.id}.png`)
            console.log('publicURL: ', publicURL)

            // const { data: data2, error: error2 } = await supabase.from('users').update({ image: publicURL }).match({ id: auth.id })
            // console.log('data2: ', data2)
            // console.log('error2: ', error2)

            console.log('objectOfImagesToMerge: ', objectOfImagesToMerge)
            let obj = {}
            for (let key in objectOfImagesToMerge) {
                let a = objectOfImagesToMerge[key].substring(0, objectOfImagesToMerge[key].lastIndexOf('.'))
                obj[key] = a.substring(objectOfImagesToMerge[key].lastIndexOf('/') + 1)
            }
            console.log('obj: ', obj)
            const { data: data3, error: error3 } = await supabase.from('users').update({ image: obj }).match({ id: auth.id })
            console.log('data3: ', data3)
            console.log('error3: ', error3)
        } catch (error) {
            console.log('error: ', error)
        }
    }

    const deleteAvatar = async () => {
        try {
            const { data, error } = await supabase.storage.from('avatars').remove([`public/${auth.id}.png`])
            console.log('error: ', error)
            console.log('data: ', data)
        } catch (error) {
            console.log('error: ', error)
        }
    }

    const setAvatarImage = (value) => {
        // console.log('setAvatarImage2: ', value);
        // console.log('value.type: ', value.type)
        setObjectOfImagesToMerge({
            ...objectOfImagesToMerge,
            ...{
                [value.type]: `/images/avatars/${value.type}/${value.image}.png`,
            },
        })

        // setState({objectOfImagesToMerge: {...objectOfImagesToMerge, ...{
        //     [value.type]: `/images/avatars/${value.type}/${value.image}.png`
        // }}}, function () {
        //     console.log('objectOfImagesToMerge: ', objectOfImagesToMerge);
        // });

        console.log('objectOfImagesToMerge: ', objectOfImagesToMerge)
        // merge()
    }

    return (
        <>
            <Head>
                <title>TIF - Avatar</title>
            </Head>
            <div className="container" style={{ backgroundColor: 'LightSlateGray' }}>
                <div className="row">
                    <div className="col col-sm-12">
                        <h2 className={classNames('my-0 py-2', styles.title)}>Ton Avatar</h2>
                    </div>
                </div>
                <div className="row justify-content-center rounded mx-1" style={{ backgroundColor: 'whitesmoke' }}>
                    <div className="col col-sm-12">
                        <h3 className={classNames('mt-2 py-2', styles.subtitle)}>Envie de changer de tête ?</h3>
                    </div>
                    <div className="col col-sm-12 col-md-4">
                        <img src="" ref={ref} width="100%" style={{ border: '1px solid red' }} />
                        {/* <Image src="" ref={ref} width="100%" height="100%" style={{ border: '1px solid red' }} /> */}
                    </div>
                    <div className="row justify-content-evenly">
                        <div className={classNames('col col-sm-2 text-center')} onClick={() => setType('skin')}>
                            <div className={classNames(styles.box, type === 'skin' && styles.active)}>
                                <span className={styles.boxTitle}>Peau</span>
                            </div>
                        </div>
                        <div className={classNames('col col-sm-2 text-center')} onClick={() => setType('eyes')}>
                            <div className={classNames(styles.box, type === 'eyes' && styles.active)}>
                                <span className={styles.boxTitle}>Yeux</span>
                            </div>
                        </div>
                        <div className={classNames('col col-sm-2 text-center')} onClick={() => setType('mouth')}>
                            <div className={classNames(styles.box, type === 'mouth' && styles.active)}>
                                <span className={styles.boxTitle}>Bouche</span>
                            </div>
                        </div>

                        <div className={classNames('col col-sm-2 text-center')} onClick={() => setType('beard')}>
                            <div className={classNames(styles.box, type === 'beard' && styles.active)}>
                                <span className={styles.boxTitle}>Poils</span>
                            </div>
                        </div>
                        <div className={classNames('col col-sm-2 text-center')} onClick={() => setType('hair')}>
                            <div className={classNames(styles.box, type === 'hair' && styles.active)}>
                                <span className={styles.boxTitle}>Cheveux</span>
                            </div>
                        </div>
                        <div className={classNames('col col-sm-2 text-center')} onClick={() => setType('background')}>
                            <div className={classNames(styles.box, type === 'background' && styles.active)}>
                                <span className={styles.boxTitle}>Arrière-fond</span>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {type === 'skin' && <SkinImages setAvatarImage={setAvatarImage} />}
                        {type === 'eyes' && <EyesImages setAvatarImage={setAvatarImage} />}
                        {type === 'mouth' && <MouthImages setAvatarImage={setAvatarImage} />}
                        {type === 'beard' && <BeardImages setAvatarImage={setAvatarImage} />}
                        {type === 'hair' && <HairImages setAvatarImage={setAvatarImage} />}
                        {type === 'background' && <BackgroundImages setAvatarImage={setAvatarImage} />}
                    </div>
                </div>

                <div className="row align-items-center py-2" style={{}}>
                    <div className="col col-sm-6">
                        <Link href="/" passHref>
                            <button className={classNames('btn btn-danger text-uppercase float-end', styles.text1)}>Annule tout!</button>
                        </Link>
                    </div>
                    <div className="col col-sm-6">
                        <button className={classNames('btn btn-success text-uppercase float-start', styles.text1)} onClick={() => updateImage()}>
                            Allez, valide!
                        </button>
                    </div>
                </div>

                {/* <button onClick={() => saveImage()}>Save image</button><br />
            <button onClick={() => updateAvatar()}>Update image</button><br />
            <button onClick={() => deleteAvatar()}>Delete image</button><br /> */}
            </div>
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
