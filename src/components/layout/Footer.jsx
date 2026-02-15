import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="border-t border-white/10 bg-background pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <img src="/logo.png" alt="Limit U Logo" className="w-8 h-8 object-contain" />
                            <span className="text-xl font-bold tracking-tight">Limit U</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Empowering students to master their finances through smart daily limits and AI guidance.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Product</h4>
                        <ul className="space-y-2 text-muted-foreground">
                            <li><Link to="/how-it-works" className="hover:text-primary transition-colors">How it Works</Link></li>
                            <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>

                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Company</h4>
                        <ul className="space-y-2 text-muted-foreground">
                            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link to="/team" className="hover:text-primary transition-colors">Team</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h4 className="font-semibold mb-4 text-foreground">Contact Us</h4>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <i className="fi fi-rr-envelope text-lg"></i>
                                    <a href="mailto:team.limitu@gmail.com" className="hover:text-primary transition-colors">team.limitu@gmail.com</a>
                                </li>
                                <li className="flex items-center gap-2">
                                    <i className="fi fi-rr-phone-call text-lg"></i>
                                    <a href="tel:+919475565982" className="hover:text-primary transition-colors">+91 94755 65982</a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4 text-foreground">Follow Us</h4>
                            <div className="flex gap-4">
                                <Link to="#" className="p-2 rounded-full bg-secondary hover:bg-primary/20 hover:text-primary transition-all">
                                    <i className="fi fi-brands-instagram text-xl"></i>
                                </Link>
                                <Link to="#" className="p-2 rounded-full bg-secondary hover:bg-primary/20 hover:text-primary transition-all">
                                    <i className="fi fi-brands-linkedin text-xl"></i>
                                </Link>
                                <Link to="#" className="p-2 rounded-full bg-secondary hover:bg-primary/20 hover:text-primary transition-all">
                                    <i className="fi fi-brands-facebook text-xl"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 text-center text-muted-foreground text-sm">
                    © {new Date().getFullYear()} Limit U. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export { Footer };
