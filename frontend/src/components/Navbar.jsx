import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleScroll = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Check if we are already on home page but element missing (top part?) 
            // Or if we are on another page, navigate to home with hash
            if (window.location.pathname !== '/') {
                navigate('/#' + id);
            } else {
                // On home page but maybe element not found? 
                // Try scrolling to it using hash anyway which LandingPage useEffect catches
                window.location.hash = id;
            }
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[#1A1A1A] bg-black/80 backdrop-blur-md">
            <div className="flex items-center justify-between px-6 py-4 max-w-[1200px] mx-auto">
                <div className="flex items-center gap-2">
                    <div className="size-8 flex items-center justify-center bg-primary/10 rounded border border-primary/20 text-primary">
                        <span className="material-symbols-outlined text-[20px]">
                            dataset
                        </span>
                    </div>
                    <Link to="/" className="text-white text-lg font-bold tracking-tight hover:text-white/90 transition-colors">
                        ScrapyFire.Ai
                    </Link>
                </div>
                <nav className="hidden md:flex items-center gap-8">
                    <button
                        className="text-sm font-medium text-gray-400 hover:text-primary transition-colors bg-transparent border-0 cursor-pointer"
                        onClick={() => handleScroll('features')}
                    >
                        Features
                    </button>
                    <button
                        className="text-sm font-medium text-gray-400 hover:text-primary transition-colors bg-transparent border-0 cursor-pointer"
                        onClick={() => handleScroll('workflow')}
                    >
                        Workflow
                    </button>
                    <Link
                        className="text-sm font-medium text-gray-400 hover:text-primary transition-colors"
                        to="/pricing"
                    >
                        Pricing
                    </Link>
                    <button
                        className="text-sm font-medium text-gray-400 hover:text-primary transition-colors bg-transparent border-0 cursor-pointer"
                        onClick={() => handleScroll('features')}
                    >
                        Docs
                    </button>
                </nav>
                <div className="flex gap-3">
                    {/* <button className="hidden sm:flex h-9 items-center justify-center rounded px-4 text-sm font-bold bg-[#1A1A1A] text-white hover:bg-[#252525] border border-white/10 transition-colors">
                        
                    </button> */}
                    <button
                        onClick={() => navigate("/app")}
                        className="flex h-9 items-center justify-center rounded px-4 text-sm font-bold bg-primary text-black hover:bg-primary/90 transition-colors shadow-[0_0_15px_-3px_rgba(0,208,255,0.4)]"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
