import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { motion } from 'framer-motion';

import sohamImg from '../assets/soham.jpg';

const teamMembers = [
    {
        name: "Soham Dey",
        role: "Founder & Lead Developer",
        bio: "Building the future of student finance.",
        socials: {
            instagram: "https://www.instagram.com/yedmahos/",
            linkedin: "https://www.linkedin.com/in/yedmahos/"
        }
    },
    {
        name: "Suparna Raha",
        role: "Co-Founder & Backend Developer",
        bio: "Obsessed with logics.",
        socials: {
            instagram: "https://www.instagram.com/ewwwwwsuparna/",
            linkedin: "https://www.linkedin.com/in/suparna-raha-96345a343/"
        }
    },
];

const Team = () => {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-6">
                <div className="container mx-auto px-6 max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-20"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Meet the <span className="text-primary">Team</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            The minds behind Limit U, working together to empower students worldwide.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {teamMembers.map((member, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="group"
                            >
                                <div className="relative overflow-hidden rounded-3xl bg-secondary/30 border border-white/5 hover:border-primary/50 transition-all duration-300">
                                    <div className="aspect-square bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center relative group-hover:bg-primary/5 transition-colors">
                                        {/* Placeholder Avatar - Dynamic Initials */}
                                        <div className="w-32 h-32 rounded-full bg-background border-4 border-secondary flex items-center justify-center text-4xl font-bold text-primary shadow-xl">
                                            {member.name.split(' ').map(n => n[0]).join('')}
                                        </div>

                                        {/* Overlay Socials */}
                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                            {Object.entries(member.socials).map(([platform, link]) => (
                                                <a
                                                    key={platform}
                                                    href={link}
                                                    className="p-3 rounded-full bg-white/10 hover:bg-primary hover:text-white transition-colors text-white"
                                                >
                                                    <i className={`fi fi-brands-${platform} text-xl`}></i>
                                                </a>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-6 text-center">
                                        <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                                        <div className="text-primary text-sm font-medium mb-4">{member.role}</div>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            {member.bio}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Team;
