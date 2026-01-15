import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Landing2 from "./Landing2";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <main className="relative z-10 flex-grow flex flex-col items-center">
        <header className="sticky top-0 z-50 w-full border-b border-[#1A1A1A] bg-black/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4 max-w-[1200px] mx-auto">
          <div className="flex items-center gap-2">
            <div className="size-8 flex items-center justify-center bg-primary/10 rounded border border-primary/20 text-primary">
              <span className="material-symbols-outlined text-[20px]">
                dataset
              </span>
            </div>
            <h2 className="text-white text-lg font-bold tracking-tight">
              Scrape.AI
            </h2>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a
              className="text-sm font-medium text-gray-400 hover:text-primary transition-colors"
              href="#"
            >
              Features
            </a>
            <a
              className="text-sm font-medium text-gray-400 hover:text-primary transition-colors"
              href="#"
            >
              Workflow
            </a>
            <Link
              className="text-sm font-medium text-gray-400 hover:text-primary transition-colors"
              to="/pricing"
            >
              Pricing
            </Link>
            <a
              className="text-sm font-medium text-gray-400 hover:text-primary transition-colors"
              href="#"
            >
              Docs
            </a>
          </nav>
          <div className="flex gap-3">
            <button className="hidden sm:flex h-9 items-center justify-center rounded px-4 text-sm font-bold bg-[#1A1A1A] text-white hover:bg-[#252525] border border-white/10 transition-colors">
              Log In
            </button>
            <button
              onClick={() => navigate("/app")}
              className="flex h-9 items-center justify-center rounded px-4 text-sm font-bold bg-primary text-black hover:bg-primary/90 transition-colors shadow-[0_0_15px_-3px_rgba(0,208,255,0.4)]"
            >
              Get API Key
            </button>
          </div>
        </div>
      </header>
        {/* Hero Section */}
        <section className="w-full max-w-7xl px-6 pt-20 pb-12 md:pt-32 md:pb-20 flex flex-col items-center text-center gap-8">
          <div className="flex flex-col gap-4 max-w-4xl animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold leading-[0.9] tracking-tighter uppercase bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
              Turn Any Web Page <br /> into Structured JSON
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-normal max-w-2xl mx-auto mt-4">
              AI-assisted scraping. No selectors. No brittle scripts.{" "}
              <br className="hidden md:block" />
              Just data, formatted exactly how you need it.
            </p>
          </div>
          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
            {/* Neon Purple Demo Button */}
            <button className="group relative flex items-center justify-center px-8 py-3 bg-transparent text-white text-base font-bold tracking-wide overflow-hidden transition-all duration-300 rounded border border-[#B800FF] shadow-[0_0_15px_rgba(184,0,255,0.3)] hover:shadow-[0_0_25px_rgba(184,0,255,0.6)] hover:bg-[#B800FF]/10">
              <span className="material-symbols-outlined mr-2 text-[#B800FF] group-hover:text-white transition-colors">
                play_circle
              </span>
              Try Live Demo
            </button>
            {/* Solid White Button */}
            <button className="flex items-center justify-center px-8 py-3 bg-white text-black text-base font-bold tracking-wide rounded hover:bg-gray-200 transition-colors">
              Get Started Free
            </button>
          </div>
        </section>
        {/* Terminal Mockup Section */}
       <Landing2 />
        {/* Features Grid */}
        
        {/* Map/Global Section (Context filler) */}
       
      </main>
    <div className="relative flex flex-col w-full min-h-screen">
      {/* Subtle Grid Background */}
      <div
        className="fixed inset-0 z-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundSize: "40px 40px",
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
        }}
      />
      {/* Navbar */}
      
      <main className="relative z-10 flex flex-col items-center w-full">
        {/* Hero Section */}
        <section className="w-full max-w-[1000px] px-6 py-20 md:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <span className="size-2 rounded-full bg-cyber-green shadow-neon-green animate-pulse" />
            <span className="text-xs font-mono text-gray-300 uppercase tracking-wider">
              v2.0 Extraction Engine Live
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8 uppercase text-white">
            Raw HTML to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary text-gradient-primary">
              Live API
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl font-light leading-relaxed mb-10">
            The only AI-native scraper that understands{" "}
            <span className="text-white font-medium">intent</span>. Turn any
            website into a structured JSON endpoint without writing fragile
            selectors.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/app")}
              className="h-12 px-8 bg-primary text-black font-bold rounded flex items-center gap-2 hover:bg-primary/90 transition-all hover:scale-105"
            >
              <span className="material-symbols-outlined text-[20px]">bolt</span>
              Start Building
            </button>
            <button className="h-12 px-8 bg-transparent text-white border border-white/20 font-bold rounded flex items-center gap-2 hover:bg-white/5 transition-all">
              <span className="material-symbols-outlined text-[20px]">
                terminal
              </span>
              View Documentation
            </button>
          </div>
        </section>
        {/* Terminal / AI Section */}
        <section className="w-full max-w-[1000px] px-6 mb-32">
          <div className="w-full rounded-lg border border-white/10 bg-[#050505] overflow-hidden shadow-2xl relative group">
            {/* Glow behind */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-neon-purple/20 to-cyber-green/20 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
            <div className="relative bg-[#050505] z-10 rounded-lg">
              {/* Terminal Header */}
              <div className="flex items-center px-4 py-3 border-b border-white/10 bg-[#0A0A0A]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>
                <div className="ml-4 text-xs font-mono text-gray-500">
                  user@scrape-ai:~/projects/demo
                </div>
              </div>
              {/* Terminal Content */}
              <div className="p-6 md:p-8 font-mono text-sm md:text-base leading-loose">
                <div className="flex flex-col gap-2">
                  <div className="text-gray-400">
                    # Describe what you want in plain English
                  </div>
                  <div className="flex flex-wrap items-center">
                    <span className="text-cyber-green mr-3">➜</span>
                    <span className="text-primary font-bold">scrape</span>
                    <span className="text-white mx-2">--url</span>
                    <span className="text-[#E6DB74]">
                      "https://competitor.com/pricing"
                    </span>
                    <span className="text-white mx-2">--extract</span>
                    <span className="text-[#E6DB74]">
                      "all pricing tiers and feature lists"
                    </span>
                    <span className="w-2.5 h-5 bg-primary ml-1 animate-blink" />
                  </div>
                  <div className="mt-4 border-t border-white/5 pt-4 opacity-0 animate-[fadeIn_0.5s_ease-out_1s_forwards]">
                    <div className="text-gray-500 mb-2">
                      // Output generated in 420ms
                    </div>
                    <div className="text-neon-purple">{"{"}</div>
                    <div className="pl-4">
                      <span className="text-primary">"data"</span>: [
                      <div className="pl-4">
                        <span className="text-neon-purple">{"{"}</span>
                        <div className="pl-4">
                          <span className="text-white">"tier"</span>:{" "}
                          <span className="text-[#E6DB74]">"Starter"</span>,<br />
                          <span className="text-white">"price"</span>:{" "}
                          <span className="text-[#E6DB74]">"$29/mo"</span>,<br />
                          <span className="text-white">"features"</span>: [
                          <span className="text-[#E6DB74]">"5 Projects"</span>,{" "}
                          <span className="text-[#E6DB74]">"API Access"</span>
                          ]
                        </div>
                        <span className="text-neon-purple">{"}"},</span>
                      </div>
                      <div className="pl-4 text-gray-600">...</div>]
                    </div>
                    <div className="text-neon-purple">{"}"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Workflow Section */}
        <section className="w-full max-w-[1200px] px-6 py-20 flex flex-col items-center">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wide mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              From unstructured web data to production-ready API endpoints in four
              autonomous steps.
            </p>
          </div>
          <div className="relative w-full max-w-[800px]">
            {/* Connecting Line (Vertical) */}
            <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-[2px] bg-[#333] -translate-x-1/2 md:translate-x-0" />
            {/* Active neon line progress */}
            <div className="absolute left-[24px] md:left-1/2 top-0 h-[75%] w-[2px] bg-neon-purple shadow-[0_0_15px_#B800FF] -translate-x-1/2 md:translate-x-0 z-0" />
            {/* Step 1 */}
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8 mb-16 group">
              <div className="md:w-1/2 md:text-right flex flex-col items-start md:items-end order-2 md:order-1 pl-16 md:pl-0 md:pr-12">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                  Paste Target URL
                </h3>
                <p className="text-sm text-gray-400">
                  Input any URL. Scrape.AI handles dynamic rendering, JS
                  execution, and captchas automatically.
                </p>
              </div>
              <div className="absolute left-[24px] md:left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
                <div className="size-12 rounded-full bg-black border-2 border-neon-purple shadow-[0_0_15px_rgba(184,0,255,0.6)] flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-[24px]">
                    link
                  </span>
                </div>
              </div>
              <div className="hidden md:block md:w-1/2 order-3" />
            </div>
            {/* Step 2 */}
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8 mb-16 group">
              <div className="hidden md:block md:w-1/2 order-1" />
              <div className="absolute left-[24px] md:left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
                <div className="size-12 rounded-full bg-black border-2 border-neon-purple shadow-[0_0_15px_rgba(184,0,255,0.6)] flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-[24px]">
                    data_object
                  </span>
                </div>
              </div>
              <div className="md:w-1/2 order-2 pl-16 md:pl-12">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                  Describe Data Schema
                </h3>
                <p className="text-sm text-gray-400">
                  Define your desired output format in JSON or plain text. No CSS
                  selectors required.
                </p>
              </div>
            </div>
            {/* Step 3 */}
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8 mb-16 group">
              <div className="md:w-1/2 md:text-right flex flex-col items-start md:items-end order-2 md:order-1 pl-16 md:pl-0 md:pr-12">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                  AI Extraction Engine
                </h3>
                <p className="text-sm text-gray-400">
                  Our LLM traverses the DOM, understanding context to extract
                  precise data points with 99.8% accuracy.
                </p>
              </div>
              <div className="absolute left-[24px] md:left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
                <div className="size-12 rounded-full bg-black border-2 border-neon-purple shadow-[0_0_15px_rgba(184,0,255,0.6)] flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-[24px]">
                    psychology
                  </span>
                </div>
              </div>
              <div className="hidden md:block md:w-1/2 order-3" />
            </div>
            {/* Step 4 */}
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8 mb-4 group">
              <div className="hidden md:block md:w-1/2 order-1" />
              <div className="absolute left-[24px] md:left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
                <div className="size-12 rounded-full bg-black border-2 border-gray-600 group-hover:border-neon-purple group-hover:shadow-[0_0_15px_rgba(184,0,255,0.6)] flex items-center justify-center text-white group-hover:scale-110 transition-all duration-300">
                  <span className="material-symbols-outlined text-[24px]">
                    cloud_upload
                  </span>
                </div>
              </div>
              <div className="md:w-1/2 order-2 pl-16 md:pl-12">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                  Deploy REST Endpoint
                </h3>
                <p className="text-sm text-gray-400">
                  Get a persistent API endpoint that scrapes on-demand or on a
                  schedule. Webhooks included.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Features Grid */}
        <section className="w-full max-w-[1200px] px-6 py-24">
          <div className="flex flex-col gap-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wide">
              Technical Specs
            </h2>
            <div className="h-1 w-20 bg-cyber-green shadow-neon-green" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group relative p-6 bg-[#0A0A0A]/80 backdrop-blur-sm border border-white/5 rounded hover:border-cyber-green/50 transition-colors overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-cyber-green">
                  shield
                </span>
              </div>
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Anti-Bot Bypass
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Built-in residental proxies and browser fingerprint rotation.
                    We handle Cloudflare, Akamai, and Datadome challenges
                    silently.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2">
                  <span className="size-2 rounded-full bg-cyber-green shadow-neon-green" />
                  <span className="text-xs font-mono text-cyber-green">
                    ACTIVE PROTECTION
                  </span>
                </div>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="group relative p-6 bg-[#0A0A0A]/80 backdrop-blur-sm border border-white/5 rounded hover:border-cyber-green/50 transition-colors overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-cyber-green">
                  healing
                </span>
              </div>
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Auto-Healing Scripts
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    When site layouts change, our AI detects the drift and
                    auto-adjusts the extraction logic. Zero downtime maintenance.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2">
                  <span className="size-2 rounded-full bg-cyber-green shadow-neon-green" />
                  <span className="text-xs font-mono text-cyber-green">
                    SELF-REPAIR ENABLED
                  </span>
                </div>
              </div>
            </div>
            {/* Feature 3 */}
            <div className="group relative p-6 bg-[#0A0A0A]/80 backdrop-blur-sm border border-white/5 rounded hover:border-cyber-green/50 transition-colors overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-cyber-green">
                  webhook
                </span>
              </div>
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Webhook Integrations
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Push data directly to your database, Slack, or Zapier as soon
                    as extraction completes. Event-driven architecture ready.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2">
                  <span className="size-2 rounded-full bg-cyber-green shadow-neon-green" />
                  <span className="text-xs font-mono text-cyber-green">
                    REAL-TIME PUSH
                  </span>
                </div>
              </div>
            </div>
            {/* Feature 4 */}
            <div className="group relative p-6 bg-[#0A0A0A]/80 backdrop-blur-sm border border-white/5 rounded hover:border-cyber-green/50 transition-colors overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-cyber-green">
                  public
                </span>
              </div>
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Global Proxy Network
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Access geo-restricted content with 40M+ IPs across 195
                    countries. Specify country or city level targeting in your API
                    call.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2">
                  <span className="size-2 rounded-full bg-cyber-green shadow-neon-green" />
                  <span className="text-xs font-mono text-cyber-green">
                    195 REGIONS
                  </span>
                </div>
              </div>
            </div>
            {/* Feature 5 */}
            <div className="group relative p-6 bg-[#0A0A0A]/80 backdrop-blur-sm border border-white/5 rounded hover:border-cyber-green/50 transition-colors overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-cyber-green">
                  schedule
                </span>
              </div>
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Scheduled Jobs
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Set it and forget it. Configure CRON jobs to scrape
                    periodically and receive diff reports on data changes.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2">
                  <span className="size-2 rounded-full bg-cyber-green shadow-neon-green" />
                  <span className="text-xs font-mono text-cyber-green">
                    CRON READY
                  </span>
                </div>
              </div>
            </div>
            {/* Feature 6 */}
            <div className="group relative p-6 bg-[#0A0A0A]/80 backdrop-blur-sm border border-white/5 rounded hover:border-cyber-green/50 transition-colors overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-cyber-green">
                  api
                </span>
              </div>
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Headless Browser
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Full browser automation capabilities. Click buttons, scroll
                    infinite feeds, and fill forms before extraction.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2">
                  <span className="size-2 rounded-full bg-cyber-green shadow-neon-green" />
                  <span className="text-xs font-mono text-cyber-green">
                    FULL DOM CONTROL
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

          <section className="w-full max-w-7xl px-6 py-20 border-t border-[#222]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-8 rounded bg-[#111] border border-[#222] hover:border-[#333] transition-colors group">
                <div className="w-12 h-12 rounded bg-[#1A1A1A] flex items-center justify-center mb-6 group-hover:bg-[#222] transition-colors">
                  <span className="material-symbols-outlined text-white text-2xl">
                    code_off
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  No CSS Selectors
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Stop breaking your scraper every time a class name changes. Our AI
                  focuses on the visual rendering and semantic data, not the DOM
                  spaghetti.
                </p>
              </div>
              {/* Feature 2 */}
              <div className="p-8 rounded bg-[#111] border border-[#222] hover:border-neon-purple/30 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-6xl">
                    psychology
                  </span>
                </div>
                <div className="w-12 h-12 rounded bg-[#1A1A1A] flex items-center justify-center mb-6 group-hover:bg-[#222] transition-colors">
                  <span className="material-symbols-outlined text-white text-2xl">
                    auto_awesome
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  AI Understands Structure
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Lists, tables, pricing grids, and product details are
                  automatically detected and normalized into clean arrays and
                  objects.
                </p>
              </div>
              {/* Feature 3 */}
              <div className="p-8 rounded bg-[#111] border border-[#222] hover:border-[#333] transition-colors group">
                <div className="w-12 h-12 rounded bg-[#1A1A1A] flex items-center justify-center mb-6 group-hover:bg-[#222] transition-colors">
                  <span className="material-symbols-outlined text-white text-2xl">
                    rocket_launch
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">One-Click API</h3>
                <p className="text-gray-400 leading-relaxed">
                  Don't just scrape once. Pipe the live extraction directly into a
                  persistent REST endpoint or webhook with a single CLI command.
                </p>
              </div>
            </div>
          </section>

           <section className="w-full max-w-7xl px-6 pb-20 pt-10 flex flex-col items-center">
          <div className="w-full relative h-[300px] rounded-lg overflow-hidden border border-[#222]">
            <img
              alt="Abstract dark global network map showing connectivity nodes"
              className="w-full h-full object-cover opacity-30 grayscale"
              data-alt="Abstract dark global network map showing connectivity nodes"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuArGvpZy_RTt55fOdZhZiYg-aXA7AD_nVjCUVV_CL0J-HPhJhE6JCP02rh-ZQhnrCx7DQGAsDjT2foVMZDzKHU_ghhcyBjLlHj8s5e957D-6OOwy6R_laZlHGq-_ZwUx8-0lP9q692p_IeePoFr7mopeUFmTwItqSSlxb6slJFqqWO4b7YOFpTlBCf7D3sIC9N83DtPqrn1FndkQ8aXzvJ64VdggSvpWMrCWBcNM_s3_I7PcR_OQ_BuXmBDQavKm_WF42iTWebkZXg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h3 className="text-2xl font-bold text-white">
                Global Proxy Network Included
              </h3>
              <p className="text-gray-400">
                Rotate IPs automatically. Never get blocked.
              </p>
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className="w-full border-t border-white/10 bg-[#050505]">
          <div className="max-w-[1200px] mx-auto px-6 py-20 flex flex-col items-center text-center">
            <h2 className="text-3xl md:text-5xl font-bold uppercase mb-6">
              Stop maintaining scrapers.
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl">
              Start building your data product today with the only AI that thinks
              like a developer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button
                onClick={() => navigate("/app")}
                className="h-12 px-8 bg-primary text-black font-bold rounded flex items-center justify-center gap-2 hover:bg-primary/90 transition-all"
              >
                Start Free Trial
              </button>
              <button className="h-12 px-8 bg-[#1A1A1A] text-white border border-white/10 font-bold rounded flex items-center justify-center gap-2 hover:bg-[#252525] transition-all">
                Contact Sales
              </button>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t border-white/5 bg-black py-10">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              dataset
            </span>
            <span className="text-white font-bold">Scrape.AI</span>
          </div>
          <div className="text-gray-500 text-sm">
            © 2023 Scrape AI Inc. All systems operational.
          </div>
          <div className="flex gap-6">
            <a
              className="text-gray-500 hover:text-white transition-colors"
              href="#"
            >
              Terms
            </a>
            <a
              className="text-gray-500 hover:text-white transition-colors"
              href="#"
            >
              Privacy
            </a>
            <a
              className="text-gray-500 hover:text-white transition-colors"
              href="#"
            >
              Status
            </a>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}

export default LandingPage;