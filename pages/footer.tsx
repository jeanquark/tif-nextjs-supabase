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
        <div className="d-flex flex-column h-100">
            <main className="flex-shrink-0">
                <div className="container">
                    <h1 className="mt-5">Sticky footer</h1>
                    <p className="lead">Pin a footer to the bottom of the viewport in desktop browsers with this custom HTML and CSS.</p>
                    <p>Use <a href="/docs/5.0/examples/sticky-footer-navbar/">the sticky footer with a fixed navbar</a> if need be, too.</p>
                </div>
            </main>

            <footer className="footer mt-auto py-3 bg-light">
                <div className="container">
                    <span className="text-muted">Place sticky footer content here.</span>
                </div>
            </footer>
        </div>
    )
}