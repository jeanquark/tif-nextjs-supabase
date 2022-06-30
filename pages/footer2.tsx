import { ReactElement } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import Layout from '../components/Layout'
import NestedLayout from '../components/LayoutFrontend'
import Navbar from '../components/Navbar'
import styles from '../styles/Home.module.css'

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'home'])),
            // Will be passed to the page component as props
        },
    };
}

export default function FooterPage() {
    const { t } = useTranslation(['common', 'home']);

    return (
        <div className="container">
            <div className="fixed-top" style={{ border: '2px solid orange' }}>
                <div style={{ height: '100px' }}>
                    Navbar
                </div>
            </div>
            <div className="content app-content" style={{ border: '2px solid green' }}>
                <div className="content-wrapper" style={{ height: '500px' }}>
                    Main
                </div>
            </div>
            <div className="fixed-bottom" style={{ border: '2px solid purple' }}>
                <div style={{ height: '200px' }}>
                    Footer
                </div>
            </div>
        </div>
    )
}