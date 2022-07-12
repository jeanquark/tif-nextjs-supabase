import { ReactElement, useState } from 'react';
import classNames from 'classnames';
import Head from 'next/head';
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from 'next/image';

import Layout from '../components/Layout'
import NestedLayout from '../components/LayoutFrontend'
import Navbar from '../components/Navbar'
import styles from '../styles/Profile.module.css'

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'home'])),
        },
    };
}

export default function ParameterPage() {
    const { t } = useTranslation(['common', 'home']);
    const [music, setMusic] = useState<boolean>(false);
    const [sound, setSound] = useState<boolean>(true);

    const setParams = (params) => {
        console.log('setParams: ', params)
    }

    return (
        <>
            <Head>
                <title>TIF - Profil</title>
            </Head>

            <div className="container pb-3" style={{ backgroundColor: 'LightSlateGray' }}>
                <div className="row gx-0" style={{ border: '1px solid green' }}>
                    <div className="col col-sm-12" style={{ border: '1px solid purple' }}>
                        <h2 className={classNames('my-0 py-2', styles.title)}>Ton profil</h2>
                    </div>
                    <div className="row justify-content-center mb-4">
                        <div className="col col-md-6 py-2 rounded" style={{ background: 'WHITESMOKE', border: '1px solid red' }}>
                            <div className="d-flex align-items-center">
                                <div className="">
                                    <Image src="/images/163.png" alt="country flag" width="100%" height="100%" className="text-start" />
                                </div>
                                <div className="flex-grow-1">
                                    <h3 className="text-center">Fan1234567/20</h3>
                                </div>
                                <div className="">
                                    <Image src="/images/avatar.png" alt="country flag" width="100%" height="100%" className="text-end" />
                                </div>
                            </div>

                            <div className="d-flex align-items-center rounded p-3" style={{ background: '#000' }}>
                                <div className="">
                                    <Image src="/images/cup.png" alt="country flag" width="100%" height="100%" />
                                </div>
                                <div className="flex-grow-1">
                                    <h2 className="text-center text-white">1234567ème</h2>
                                </div>
                                <div className="">
                                    <Image src="/images/cup.png" alt="country flag" width="100%" height="100%" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center rounded gx-0" style={{ backgroundColor: 'whitesmoke' }}>
                    <div className="row align-items-center" style={{ background: 'orangered' }}>
                        <div className="col col-md-12">
                            <h4 className="text-center text-white my-0 py-0">
                                Niveau / PF / Competences
                            </h4>
                        </div>
                    </div>
                    <div className="row gx-0 align-items-center my-4">
                        <div className="col col-md-5 px-5">
                            <div className="rounded mx-5 py-2" style={{ background: '#000' }}>
                                <h4 className="text-center text-white">Point Ferveur</h4>
                                <h2 className="text-center text-white">1.00</h2>
                                <h4 className="text-center text-white">Tes équipes</h4>
                            </div>
                        </div>
                        <div className="col col-md-2 text-center">
                            <div className={classNames("text-center", styles.levelImageBox)}>
                                <Image src="/images/level.png" alt="level logo" width="100%" height="150px" />
                                <h4 className={classNames("text-center", styles.levelNumberBox)}>1</h4>
                            </div>
                        </div>
                        <div className="col col-md-5 px-5">
                            <div className="rounded mx-5 py-2" style={{ background: '#000' }}>
                                <h4 className="text-center text-white">Point Ferveur</h4>
                                <h2 className="text-center text-white">00.25</h2>
                                <h4 className="text-center text-white">Autres équipes</h4>
                            </div>
                        </div>
                    </div>
                    <div className="row gx-0 px-5">
                        <div className="col col-md-6" >
                            <div className="d-flex align-items-center rounded m-1" style={{ border: '1px solid #000', background: '#FF0000' }}>
                                <div className="text-center rounded" style={{ width: "20%" }}>
                                    <svg className="svg-inline--fa fa-star fa-w-18" aria-hidden="true" data-prefix="fas" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path></svg>
                                </div>
                                <div className="flex-grow-1" style={{ background: '#fff' }}><h4 className="text-center my-0">Force</h4></div>
                                <div className="text-center rounded" style={{ background: '#FF0000', width: "20%" }}><span>1</span>
                                </div>
                            </div>
                        </div>
                        <div className="col col-md-6">
                            <div className="d-flex align-items-center rounded m-1" style={{ border: '1px solid #000', background: '#FF0000' }}>
                                <div className="text-center rounded" style={{ width: "20%" }}>
                                    <svg className="svg-inline--fa fa-star fa-w-18" aria-hidden="true" data-prefix="fas" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path></svg>
                                </div>
                                <div className="flex-grow-1" style={{ background: '#fff' }}><h4 className="text-center my-0">Endurance</h4></div>
                                <div className="text-center rounded" style={{ background: '#FF0000', width: "20%" }}><span>1</span></div>
                            </div>
                        </div>
                        <div className="col col-md-6">
                            <div className="d-flex align-items-center rounded m-1" style={{ border: '1px solid #000', background: '#FF0000' }}>
                                <div className="text-center rounded" style={{ width: "20%" }}>
                                    <svg className="svg-inline--fa fa-star fa-w-18" aria-hidden="true" data-prefix="fas" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path></svg>
                                </div>
                                <div className="flex-grow-1" style={{ background: '#fff' }}><h4 className="text-center my-0">Intelligence</h4></div>
                                <div className="text-center rounded" style={{ background: '#FF0000', width: "20%" }}><span>1</span></div>
                            </div>
                        </div>
                        <div className="col col-md-6">
                            <div className="d-flex align-items-center rounded m-1" style={{ border: '1px solid #000', background: '#FF0000' }}>
                                <div className="text-center rounded" style={{ width: "20%" }}>
                                    <svg className="svg-inline--fa fa-star fa-w-18" aria-hidden="true" data-prefix="fas" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path></svg>
                                </div>
                                <div className="flex-grow-1" style={{ background: '#fff' }}><h4 className="text-center my-0">Social</h4></div>
                                <div className="text-center rounded" style={{ background: '#FF0000', width: "20%" }}><span>1</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="row gx-0 justify-content-center">
                        <div className="col col-sm-12 text-center">
                            <h3 className={classNames('mt-2 py-1', styles.subtitle)}>Statistiques "Actions"</h3>
                        </div>
                        <div className="col col-md-10">
                            <div className="row gx-0 my-1 align-items-center border border-dark rounded">
                                <div className={classNames("col col-md-7 p-2", styles.columnActionText)}>
                                    <div>Nombre de cartes "Action" débloquées</div>
                                </div>
                                <div className={classNames("col col-md-5 p-2", styles.columnActionNumber)}>
                                    <div className={classNames("")}>12/50</div>
                                </div>
                            </div>
                            <div className="row gx-0 my-1 align-items-center border border-dark rounded">
                                <div className={classNames("col col-md-7 p-2", styles.columnActionText)}>
                                    <div>Nombre de cartes "Event" débloquées
                                    </div>
                                </div>
                                <div className={classNames("col col-md-5 p-2", styles.columnActionNumber)}>
                                    <div className={classNames("")}>5/50</div>
                                </div>
                            </div>
                            <div className="row gx-0 my-1 align-items-center border border-dark rounded">
                                <div className={classNames("col col-md-7 p-2", styles.columnActionText)}>
                                    <div>Nombre de cartes "Goodies" achetées
                                    </div>
                                </div>
                                <div className={classNames("col col-md-5 p-2", styles.columnActionNumber)}>
                                    <div className={classNames("")}>12/50</div>
                                </div>
                            </div>
                            <div className="row gx-0 my-1 align-items-center border border-dark rounded">
                                <div className={classNames("col col-md-7 p-2", styles.columnActionText)}>
                                    <div>Nombre de cartes "Spéciales" achetées</div>
                                </div>
                                <div className={classNames("col col-md-5 p-2", styles.columnActionNumber)}>
                                    <div className={classNames("")}>12/50</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row gx-0 justify-content-center">
                        <div className="col col-sm-12 text-center">
                            <h3 className={classNames('mt-2 py-1', styles.subtitle)}>Statistiques "Jeux"</h3>
                        </div>
                        <div className="col col-md-10">
                            <div className="row gx-0 my-1 align-items-center border border-dark rounded">
                                <div className={classNames("col col-md-7 p-2", styles.columnActionText)}>
                                    <div>Tu es Fan de ?</div>
                                </div>
                                <div className={classNames("col col-md-5 p-2", styles.columnGameNumber)}>
                                    <div className={classNames("")}>1 équipe</div>
                                </div>
                            </div>
                            <div className="row gx-0 my-1 align-items-center border border-dark rounded">
                                <div className={classNames("col col-md-7 p-2", styles.columnActionText)}>
                                    <div>Event - Nb de participations</div>
                                </div>
                                <div className={classNames("col col-md-5 p-2", styles.columnGameNumber)}>
                                    <div className={classNames("")}>0</div>
                                </div>
                            </div>
                            <div className="row gx-0 my-1 align-items-center border border-dark rounded">
                                <div className={classNames("col col-md-7 p-2", styles.columnActionText)}>
                                    <div>Compétition - Nb de compétitions jouées</div>
                                </div>
                                <div className={classNames("col col-md-5 p-2", styles.columnGameNumber)}>
                                    <div className={classNames("")}>0</div>
                                </div>
                            </div>
                            <div className="row gx-0 my-1 align-items-center border border-dark rounded">
                                <div className={classNames("col col-md-7 p-2", styles.columnActionText)}>
                                    <div>Action - Nb d'actions réalisées</div>
                                </div>
                                <div className={classNames("col col-md-5 p-2", styles.columnGameNumber)}>
                                    <div className={classNames("")}>0</div>
                                </div>
                            </div>
                            <div className="row gx-0 my-1 align-items-center border border-dark rounded">
                                <div className={classNames("col col-md-7 p-2", styles.columnActionText)}>
                                    <div>Trophée - Nb de trophées gagnés</div>
                                </div>
                                <div className={classNames("col col-md-5 p-2", styles.columnGameNumber)}>
                                    <div className={classNames("")}>1</div>
                                </div>
                            </div>
                            <div className="row gx-0 my-1 align-items-center border border-dark rounded">
                                <div className={classNames("col col-md-7 p-2", styles.columnActionText)}>
                                    <div>Action collective - Nb d'actions lancées</div>
                                </div>
                                <div className={classNames("col col-md-5 p-2", styles.columnGameNumber)}>
                                    <div className={classNames("")}>0</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

ParameterPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            <NestedLayout>{page}</NestedLayout>
        </Layout>
    )
}