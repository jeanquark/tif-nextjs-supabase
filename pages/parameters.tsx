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
                                <div className={classNames("btn", music ? "btn-success" : "btn-danger")} onClick={() => setMusic(!music)}>{music ? 'Oui' : 'Non'}</div>
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

                    <div className="accordion accordion-flush mx-0 px-0" id="accordionFlushExample">
                        <div className="accordion-item my-1">
                            <h2 className="accordion-header" id="flush-headingOne">
                                <button className={classNames("accordion-button collapsed rounded py-2", styles.accordionButton)} type="button" data-bs-toggle="collapse" data-bs-target="#help" aria-expanded="false" aria-controls="help">
                                    Aide/Assistance
                                </button>
                            </h2>
                            <div id="help" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                                <div className="accordion-body">Contenu Aide/Assistance</div>
                            </div>
                        </div>
                        <div className="accordion-item my-1">
                            <h2 className="accordion-header" id="flush-headingTwo">
                                <button className={classNames("accordion-button collapsed rounded py-2", styles.accordionButton)} type="button" data-bs-toggle="collapse" data-bs-target="#confidentiality" aria-expanded="false" aria-controls="confidentiality">
                                    Confidentialité
                                </button>
                            </h2>
                            <div id="confidentiality" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                                <div className="accordion-body">Contenu Confidentialité</div>
                            </div>
                        </div>
                        <div className="accordion-item my-1">
                            <h2 className="accordion-header" id="flush-headingTwo">
                                <button className={classNames("accordion-button collapsed rounded py-2", styles.accordionButton)} type="button" data-bs-toggle="collapse" data-bs-target="#conditions" aria-expanded="false" aria-controls="conditions">
                                    Conditions d'utilisation
                                </button>
                            </h2>
                            <div id="conditions" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                                <div className="accordion-body">Contenu Conditions d'utilisation</div>
                            </div>
                        </div>
                        <div className="accordion-item my-1">
                            <h2 className="accordion-header" id="flush-headingTwo">
                                <button className={classNames("accordion-button collapsed rounded py-2", styles.accordionButton)} type="button" data-bs-toggle="collapse" data-bs-target="#credit" aria-expanded="false" aria-controls="credit">
                                    Crédit
                                </button>
                            </h2>
                            <div id="credit" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                                <div className="accordion-body">Contenu Crédit</div>
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