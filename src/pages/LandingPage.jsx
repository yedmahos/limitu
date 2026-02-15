import React from 'react';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { Testimonials } from '../components/landing/Testimonials';
import { FAQ } from '../components/landing/FAQ';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';

const LandingPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <Hero />
            <Features />
            <Testimonials />
            <FAQ />
            <Footer />
        </div>
    );
};

export default LandingPage;
