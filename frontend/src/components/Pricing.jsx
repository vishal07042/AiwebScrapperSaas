import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function Pricing() {
    const navigate = useNavigate();

    return (
        <div className="relative flex flex-col w-full min-h-screen bg-black">
            {/* Background Grid - specific to Pricing but using inline style for consistency */}
            <div
                className="fixed inset-0 z-0 pointer-events-none opacity-20"
                style={{
                    backgroundSize: "40px 40px",
                    backgroundImage:
                        "linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)"
                }}
            />

            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Navbar */}
                {/* Navbar */}
                <Navbar />
                <main className="flex-grow flex flex-col items-center pt-16 pb-24 px-4 sm:px-6">
                    {/* Hero Section */}
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-border-dark bg-surface-dark/50 text-xs font-mono text-primary mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                            </span>
                            SYSTEM ONLINE: V2.4.0 STABLE
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-4 text-white">
                            Initialize Your Instance
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Select your scraping infrastructure capacity.{" "}
                            <br className="hidden sm:block" />
                            Scale up instantly via API with zero downtime.
                        </p>
                    </div>
                    {/* Billing Toggle */}
                    <div className="mb-16">
                        <div className="relative flex bg-surface-dark border border-border-dark p-1 rounded">
                            <div className="relative z-0 flex">
                                <label className="cursor-pointer group">
                                    <input
                                        defaultChecked=""
                                        className="peer sr-only"
                                        name="billing"
                                        type="radio"
                                        defaultValue="monthly"
                                    />
                                    <span className="flex items-center justify-center px-6 py-2 rounded text-sm font-medium text-gray-400 peer-checked:bg-border-dark peer-checked:text-white transition-all duration-200">
                                        Monthly Billing
                                    </span>
                                </label>
                                <label className="cursor-pointer group">
                                    <input
                                        className="peer sr-only"
                                        name="billing"
                                        type="radio"
                                        defaultValue="yearly"
                                    />
                                    <span className="flex items-center justify-center px-6 py-2 rounded text-sm font-medium text-gray-400 peer-checked:bg-border-dark peer-checked:text-white transition-all duration-200">
                                        Yearly{" "}
                                        <span className="ml-2 text-primary text-xs">(Save 20%)</span>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                    {/* Pricing Grid */}
                    <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
                        {/* Free Plan */}
                        <div className="group relative flex flex-col bg-surface-dark/30 border border-border-dark hover:border-gray-600 rounded p-8 transition-colors duration-300">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-gray-300 mb-2">FREE</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">$0</span>
                                    <span className="text-gray-500 font-mono">/mo</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-4 h-10">
                                    Perfect for prototyping and hobby projects.
                                </p>
                            </div>
                            <ul className="space-y-4 mb-8 flex-grow">
                                <li className="flex items-start gap-3 text-sm text-gray-300">
                                    <span className="material-symbols-outlined text-gray-500 text-[20px]">
                                        check_circle
                                    </span>
                                    <span>500 API Calls/mo</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-300">
                                    <span className="material-symbols-outlined text-gray-500 text-[20px]">
                                        check_circle
                                    </span>
                                    <span>Standard Proxy Pool</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-300">
                                    <span className="material-symbols-outlined text-gray-500 text-[20px]">
                                        check_circle
                                    </span>
                                    <span>JSON Output</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-300">
                                    <span className="material-symbols-outlined text-gray-500 text-[20px]">
                                        check_circle
                                    </span>
                                    <span>24h Data Retention</span>
                                </li>
                            </ul>
                            <button onClick={() => navigate('/app')} className="w-full py-3 rounded border border-gray-600 hover:border-white text-white font-bold text-sm transition-colors duration-200">
                                Start Free
                            </button>
                        </div>
                        {/* Pro Plan (Hero) */}
                        <div className="relative flex flex-col bg-background-dark border border-primary glow-effect rounded p-8 z-10 transform lg:-translate-y-4 shadow-neon-purple shadow-sm">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                Recommended
                            </div>
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-primary mb-2">PRO</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-bold text-white">$49</span>
                                    <span className="text-gray-400 font-mono">/mo</span>
                                </div>
                                <p className="text-sm text-gray-400 mt-4 h-10">
                                    For production applications requiring scale.
                                </p>
                            </div>
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-8" />
                            <ul className="space-y-4 mb-8 flex-grow">
                                <li className="flex items-start gap-3 text-sm text-white font-medium">
                                    <span className="material-symbols-outlined text-primary text-[20px]">
                                        terminal
                                    </span>
                                    <span>100,000 API Calls/mo</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-white">
                                    <span className="material-symbols-outlined text-primary text-[20px]">
                                        terminal
                                    </span>
                                    <span>Premium Residential Proxies</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-white">
                                    <span className="material-symbols-outlined text-primary text-[20px]">
                                        terminal
                                    </span>
                                    <span>Live Webhooks</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-white">
                                    <span className="material-symbols-outlined text-primary text-[20px]">
                                        terminal
                                    </span>
                                    <span>10 Concurrent Requests</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-white">
                                    <span className="material-symbols-outlined text-primary text-[20px]">
                                        terminal
                                    </span>
                                    <span>Priority Email Support</span>
                                </li>
                            </ul>
                            <button onClick={() => navigate('/app')} className="w-full py-3 rounded bg-primary hover:bg-white text-black font-bold text-sm transition-all duration-200 shadow-[0_0_20px_rgba(0,208,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                                Deploy Pro
                            </button>
                        </div>
                        {/* Enterprise Plan */}
                        <div className="group relative flex flex-col bg-surface-dark/30 border border-border-dark hover:border-gray-600 rounded p-8 transition-colors duration-300">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-gray-300 mb-2">ENTERPRISE</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">Custom</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-4 h-10">
                                    Dedicated infrastructure for high volume teams.
                                </p>
                            </div>
                            <ul className="space-y-4 mb-8 flex-grow">
                                <li className="flex items-start gap-3 text-sm text-gray-300">
                                    <span className="material-symbols-outlined text-gray-500 text-[20px]">
                                        check_circle
                                    </span>
                                    <span>Unlimited Calls</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-300">
                                    <span className="material-symbols-outlined text-gray-500 text-[20px]">
                                        check_circle
                                    </span>
                                    <span>Dedicated Infrastructure</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-300">
                                    <span className="material-symbols-outlined text-gray-500 text-[20px]">
                                        check_circle
                                    </span>
                                    <span>Custom SLAs</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-300">
                                    <span className="material-symbols-outlined text-gray-500 text-[20px]">
                                        check_circle
                                    </span>
                                    <span>SSO Enforcement</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-300">
                                    <span className="material-symbols-outlined text-gray-500 text-[20px]">
                                        check_circle
                                    </span>
                                    <span>Dedicated Account Manager</span>
                                </li>
                            </ul>
                            <button className="w-full py-3 rounded border border-gray-600 hover:border-white text-white font-bold text-sm transition-colors duration-200">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                    {/* Technical Specifications Table */}
                    <div className="w-full max-w-4xl mt-24">
                        <div className="flex items-center justify-between mb-6 px-4">
                            <h2 className="text-2xl font-bold text-white">
                                Technical Specifications
                            </h2>
                            <span className="text-xs font-mono text-gray-500">manifest.json</span>
                        </div>
                        <div className="border border-border-dark rounded overflow-hidden bg-surface-dark/20">
                            <div className="grid grid-cols-4 bg-surface-dark/80 p-4 border-b border-border-dark text-xs font-mono text-gray-400 uppercase tracking-wider">
                                <div className="col-span-1">Feature</div>
                                <div className="col-span-1 text-center">Free</div>
                                <div className="col-span-1 text-center text-primary">Pro</div>
                                <div className="col-span-1 text-center">Ent</div>
                            </div>
                            <div className="grid grid-cols-4 p-4 border-b border-border-dark/50 hover:bg-surface-dark/40 transition-colors">
                                <div className="col-span-1 text-sm font-medium text-gray-300">
                                    Javascript Rendering
                                </div>
                                <div className="col-span-1 text-center text-sm text-gray-500">
                                    <span className="material-symbols-outlined text-[18px]">
                                        check
                                    </span>
                                </div>
                                <div className="col-span-1 text-center text-sm text-primary">
                                    <span className="material-symbols-outlined text-[18px]">
                                        check
                                    </span>
                                </div>
                                <div className="col-span-1 text-center text-sm text-gray-300">
                                    <span className="material-symbols-outlined text-[18px]">
                                        check
                                    </span>
                                </div>
                            </div>
                            {/* Simplified for brevity - rows would continue here */}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Pricing;