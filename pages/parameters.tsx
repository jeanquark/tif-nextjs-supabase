import { ReactElement, useState } from 'react';
import classNames from 'classnames';
import Head from 'next/head';
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Layout from '../components/Layout'
import NestedLayout from '../components/LayoutFrontend'
import Navbar from '../components/Navbar'
import styles from '../styles/Avatar.module.css'

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'home'])),
            // Will be passed to the page component as props
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
                <title>TIF - Params</title>
            </Head>

            <div className="container" style={{ backgroundColor: 'LightSlateGray' }}>
                <div className="row">
                    <div className="col col-sm-12" >
                        <h2 className={classNames('my-0 py-2', styles.title)}>Tes paramètres</h2>
                    </div>
                </div>
                <div className="row justify-content-center rounded mx-0 px-2" style={{ backgroundColor: 'whitesmoke' }}>
                    <div className="col col-md-12">
                        <div className="col col-sm-12 text-center">
                            <h3 className={classNames('mt-2 py-2', styles.subtitle)}>Infos et/ou besoin d aide?</h3>
                        </div>
                        <div className="row align-items-center my-1 px-0 border border-dark rounded">
                            <div className="col col-sm-12 col-md-7" style={{ fontSize: '120%' }}>
                                <div>Musique</div>
                            </div>
                            <div className="col col-sm-12 col-md-5 d-grid m-0 p-0">
                                <div className={classNames("btn", music ? "btn-success" : "btn-danger")} onClick={() => setMusic(!music) }>{music ? 'Oui' : 'Non'}</div>
                            </div>
                        </div>
                        <div className="row align-items-center my-1 px-0 border border-dark rounded">
                            <div className="col col-sm-12 col-md-7" style={{ fontSize: '120%' }}>
                                <div>Son</div>
                            </div>
                            <div className="col col-sm-12 col-md-5 d-grid m-0 p-0">
                                <div className={classNames("btn", sound ? "btn-success" : "btn-danger")} onClick={() => setSound(!sound)}>{sound ? 'Oui' : 'Non'}</div>
                            </div>
                        </div>
                    </div>





                    <div className="accordion mx-0 px-0" id="accordionExample">
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingOne">
                                <button className={classNames("accordion-button text-center py-2", styles.accordionButton)} style={{ background: 'orangered', color: '#fff' }} type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    Aide/Assistance
                                </button>
                            </h2>
                            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                    Contenu
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