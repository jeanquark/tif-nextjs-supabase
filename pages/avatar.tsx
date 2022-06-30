import { redirect } from 'next/dist/server/api-utils'
import React, { useEffect } from 'react'
import { ReactElement, useState, useRef } from 'react'
import mergeImages from 'merge-images'
import classNames from "classnames"

import { supabase } from '../utils/supabaseClient'
import { useAppSelector } from '../app/hooks'
import { selectAuth } from '../features/auth/authSlice'
import styles from '../styles/Avatar.module.css'

import Layout from '../components/Layout'
import NestedLayout from '../components/LayoutFrontend'
import BackgroundImages from '../components/Avatar/Background'
import SkinImages from '../components/Avatar/Skin'
import Link from 'next/link'

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
    const [type, setType] = useState<string>('skin')
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
        <div className="container" style={{ backgroundColor: 'LightSlateGray' }}>
            <div className="row">
                <div className="col col-sm-12" >
                    <h2 className={classNames('my-0 py-2', styles.title)}>Ton Avatar</h2>
                </div>
            </div>
            <div className="row justify-content-center rounded mx-1" style={{ backgroundColor: 'whitesmoke' }}>
                <div className="col col-sm-12">
                    <h3 className={classNames('my-0 py-2', styles.subtitle)}>Envie de changer de tête ?</h3>
                </div>
                <div className="col col-sm-12 col-md-4">
                    <img src="" ref={ref} width="100%" style={{ border: '1px solid red' }} />
                </div>
                <div className="row justify-content-evenly">
                    <div className={classNames('col col-sm-2 text-center')} onClick={() => setType('skin')}>
                        <div className={styles.box}>
                            <span className={styles.boxTitle}>Peau</span>
                        </div>
                    </div>
                    <div className={classNames('col col-sm-2 text-center')} onClick={() => setType('background')}>
                        <div className={styles.box}>
                            <span className={styles.boxTitle}>Yeux</span>
                        </div>
                    </div>
                    <div className={classNames('col col-sm-2 text-center')}>
                        <div className={styles.box}>
                            <span className={styles.boxTitle}>Bouche</span>
                        </div>
                    </div>

                    <div className={classNames('col col-sm-2 text-center')}>
                        <div className={styles.box}>
                            <span className={styles.boxTitle}>Poils</span>
                        </div>
                    </div>
                    <div className={classNames('col col-sm-2 text-center')}>
                        <div className={styles.box}>
                            <span className={styles.boxTitle}>Cheveux</span>
                        </div>
                    </div>
                    <div className={classNames('col col-sm-2 text-center')}>
                        <div className={styles.box}>
                            <span className={styles.boxTitle}>Arrière</span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {type === 'background' && <BackgroundImages setAvatarImage={setAvatarImage2} />}
                    {type === 'skin' && <SkinImages setAvatarImage={setAvatarImage2} />}
                </div>
            </div>

            <div className="row align-items-center py-2" style={{}}>
                <div className="col col-sm-6">
                    <Link href="/" passHref>
                        <button className={classNames('btn btn-danger text-uppercase float-end', styles.text1)}>Annule tout!</button>
                    </Link>
                </div>
                <div className="col col-sm-6">
                    <button className={classNames('btn btn-success text-uppercase float-start', styles.text1)} onClick={() => saveImage()}>Allez, valide!</button>
                </div>
            </div>



            {/* <button onClick={() => saveImage()}>Save image</button><br />
            <button onClick={() => updateAvatar()}>Update image</button><br />
            <button onClick={() => deleteAvatar()}>Delete image</button><br /> */}
        </div>
    )


}

AvatarPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            <NestedLayout>{page}</NestedLayout>
        </Layout>
    )
}