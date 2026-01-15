import React from "react";

function Landing2() {
    return (
        <div className="relative flex flex-col min-h-screen w-full bg-[#000000]">
            {/* Custom Animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes blink {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0; }
                    }
                    .animate-blink {
                        animation: blink 1s step-end infinite;
                    }
                    
                    @keyframes scanline {
                        0% { transform: translateY(-100%); }
                        100% { transform: translateY(100%); }
                    }
                    .scanline::after {
                        content: " ";
                        display: block;
                        position: absolute;
                        top: 0;
                        left: 0;
                        bottom: 0;
                        right: 0;
                        background: linear-gradient(to bottom, rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
                        z-index: 2;
                        background-size: 100% 2px, 3px 100%;
                        pointer-events: none;
                    }

                    .custom-scrollbar::-webkit-scrollbar {
                        width: 8px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: #0A0A0A; 
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #333; 
                        border-radius: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #444; 
                    }
                    
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `
            }} />

           
            <div className="absolute inset-0 z-0 bg-grid-pattern bg-[length:40px_40px] opacity-40 pointer-events-none h-[100vh]" />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none h-[100vh]" />
          
            {/* Main Content */}
            <main className="relative z-10 flex-grow flex flex-col items-center">
               
              
                {/* Terminal Mockup Section */}
                <section className="w-full max-w-6xl px-4 md:px-6 pb-24">
                    <div className="relative w-full rounded-lg border border-[#333] bg-[#0A0A0A] shadow-2xl overflow-hidden font-mono text-sm md:text-base group">
                        {/* Terminal Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-[#222] bg-[#111]">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                            </div>
                            <div className="text-gray-500 text-xs select-none">
                                bash — 80x24
                            </div>
                            <div className="w-10" /> {/* Spacer for centering */}
                        </div>
                        {/* Terminal Body */}
                        <div className="p-6 md:p-8 min-h-[400px] flex flex-col gap-4 text-gray-300">
                            {/* Command Input */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-neon-green">user@dev:~$</span>
                                <span className="text-white">scraper extract</span>
                                <span className="text-[#4FB8FF] underline decoration-dashed underline-offset-4">
                                    https://store.brand.com/products/running-shoe-v4
                                </span>
                            </div>
                            {/* Processing State */}
                            <div className="flex flex-col gap-1 mt-2">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <span className="material-symbols-outlined text-sm animate-spin">
                                        progress_activity
                                    </span>
                                    <span>Analyzing DOM structure &amp; semantic hierarchy...</span>
                                </div>
                                <div className="w-full max-w-md h-1 bg-[#222] rounded-full mt-1 overflow-hidden">
                                    <div className="h-full bg-primary w-[85%] rounded-full shadow-[0_0_10px_#00d0ff]" />
                                </div>
                            </div>
                            {/* Output Area (Grid on larger screens) */}
                            <div className="grid md:grid-cols-2 gap-8 mt-6 pt-6 border-t border-[#222] opacity-0 animate-[fadeIn_0.5s_ease-out_0.5s_forwards]">
                                {/* Source Preview (Abstract representation) */}
                                <div className="hidden md:flex flex-col gap-2 opacity-50 select-none pointer-events-none grayscale blur-[1px]">
                                    <div className="text-xs text-gray-500 mb-2 uppercase tracking-widest">
                  // Raw HTML Source
                                    </div>
                                    <div className="pl-2 border-l border-[#333] text-xs leading-relaxed text-gray-600">
                                        &lt;div class="p-prod-wrap_x72"&gt;
                                        <br />
                                        &nbsp;&nbsp;&lt;h1 id="main-title-88"&gt;Velocity Runner
                                        V4&lt;/h1&gt;
                                        <br />
                                        &nbsp;&nbsp;&lt;span
                                        data-currency="USD"&gt;$149.00&lt;/span&gt;
                                        <br />
                                        &nbsp;&nbsp;&lt;div class="specs-list-container"&gt;
                                        <br />
                                        &nbsp;&nbsp;&nbsp;&nbsp;&lt;ul&gt;
                                        <br />
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;li&gt;Weight:
                                        240g&lt;/li&gt;
                                        <br />
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;li&gt;Drop:
                                        8mm&lt;/li&gt;
                                        <br />
                                        &nbsp;&nbsp;&nbsp;&nbsp;&lt;/ul&gt;
                                        <br />
                                        &nbsp;&nbsp;&lt;/div&gt;
                                        <br />
                                        &lt;/div&gt;
                                    </div>
                                </div>
                                {/* JSON Output */}
                                <div className="flex flex-col relative">
                                    <div className="absolute -right-2 -top-2">
                                        <div className="bg-[#1a1a1a] border border-[#333] px-2 py-1 rounded text-[10px] text-neon-green flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[12px]">
                                                check_circle
                                            </span>
                                            JSON VALID
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 mb-2 uppercase tracking-widest">
                  // Structured Output
                                    </div>
                                    <pre className="text-sm md:text-base leading-relaxed overflow-x-auto custom-scrollbar">
                                        <span className="text-gray-500">{"{"}</span>
                                        {"\n"}
                                        {"  "}
                                        <span className="text-neon-purple">"product_name"</span>:{" "}
                                        <span className="text-[#F1FA8C]">"Velocity Runner V4"</span>,
                                        {"\n"}
                                        {"  "}
                                        <span className="text-neon-purple">"price"</span>:{" "}
                                        <span className="text-primary">149.00</span>,{"\n"}
                                        {"  "}
                                        <span className="text-neon-purple">"currency"</span>:{" "}
                                        <span className="text-[#F1FA8C]">"USD"</span>,{"\n"}
                                        {"  "}
                                        <span className="text-neon-purple">
                                            "specifications"
                                        </span>: <span className="text-gray-500">{"{"}</span>
                                        {"\n"}
                                        {"    "}
                                        <span className="text-neon-purple">"weight"</span>:{" "}
                                        <span className="text-[#F1FA8C]">"240g"</span>,{"\n"}
                                        {"    "}
                                        <span className="text-neon-purple">"heel_drop"</span>:{" "}
                                        <span className="text-[#F1FA8C]">"8mm"</span>,{"\n"}
                                        {"    "}
                                        <span className="text-neon-purple">"terrain"</span>:{" "}
                                        <span className="text-[#F1FA8C]">"Road/Track"</span>
                                        {"\n"}
                                        {"  "}
                                        <span className="text-gray-500">{"}"}</span>,{"\n"}
                                        {"  "}
                                        <span className="text-neon-purple">"in_stock"</span>:{" "}
                                        <span className="text-[#FF79C6]">true</span>
                                        {"\n"}
                                        <span className="text-gray-500">{"}"}</span>
                                        <span className="inline-block w-2 h-4 bg-primary ml-1 animate-blink align-middle" />
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
            </main>
           
        </div>
    );
}

export default Landing2;