import React from 'react';
import { useNavigate } from 'react-router-dom';

function ScrapeHistory() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen bg-black text-white">
            {/* Side Navigation */}
            <aside className="w-64 border-r border-[#222] hidden lg:flex flex-col fixed h-full bg-background-dark z-20">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="size-8 bg-primary rounded-sm flex items-center justify-center">
                            <span className="material-symbols-outlined text-black font-bold">
                                terminal
                            </span>
                        </div>
                        <h2 className="text-xl font-bold tracking-tighter uppercase text-white">
                            ScrapyFire<span className="text-primary">.Ai</span>
                        </h2>
                    </div>
                    <nav className="space-y-1">
                        <button
                            onClick={() => navigate('/app')}
                            className="flex items-center gap-4 px-3 py-3 text-white/50 hover:text-white transition-colors group w-full text-left"
                        >
                            <span className="material-symbols-outlined">grid_view</span>
                            <span className="text-sm font-medium">Dashboard</span>
                        </button>
                        <button
                            className="flex items-center gap-4 px-3 py-3 bg-white/5 border-l-2 border-primary text-white transition-colors w-full text-left"
                        >
                            <span className="material-symbols-outlined text-primary">
                                history
                            </span>
                            <span className="text-sm font-medium">Scrape History</span>
                        </button>
                        <button
                            onClick={() => navigate('/deploy')}
                            className="flex items-center gap-4 px-3 py-3 text-white/50 hover:text-white transition-colors w-full text-left"
                        >
                            <span className="material-symbols-outlined">api</span>
                            <span className="text-sm font-medium">API Endpoints</span>
                        </button>
                        <button
                            className="flex items-center gap-4 px-3 py-3 text-white/50 hover:text-white transition-colors w-full text-left"
                        >
                            <span className="material-symbols-outlined">database</span>
                            <span className="text-sm font-medium">Dataset Hub</span>
                        </button>
                    </nav>
                </div>
                <div className="mt-auto p-8 border-t border-[#222]">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full border border-primary/30 p-0.5 bg-gradient-to-tr from-primary/20 to-transparent">
                            <div className="rounded-full w-full h-full bg-gray-700 flex items-center justify-center text-xs">
                                DM
                            </div>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold truncate text-white">DEV_MODE_ACTIVE</p>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest">
                                Enterprise Plan
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
            {/* Main Content */}
            <main className="flex-1 lg:ml-64 flex flex-col bg-background-dark">
                {/* Header */}
                <header className="h-20 border-b border-[#222] flex items-center justify-between px-8 sticky top-0 bg-background-dark/80 backdrop-blur-md z-10">
                    <div className="flex items-center flex-1 max-w-xl">
                        <div className="relative w-full group">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors">
                                search
                            </span>
                            <input
                                className="w-full bg-[#111] border-[#222] focus:border-primary focus:ring-0 text-xs font-mono tracking-widest rounded-sm pl-10 h-10 placeholder:text-white/20 text-white"
                                placeholder="FILTER_BY_URL_OR_ID..."
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end text-right">
                            <span className="text-[10px] text-white/40 uppercase tracking-widest">
                                Network Status
                            </span>
                            <span className="flex items-center gap-2 text-xs text-primary">
                                <span className="size-1.5 bg-primary rounded-full animate-pulse" />
                                ACTIVE_NODES: 12
                            </span>
                        </div>
                        <button className="size-10 flex items-center justify-center border border-[#222] hover:border-white/20 transition-all rounded-sm">
                            <span className="material-symbols-outlined text-white/60">
                                notifications
                            </span>
                        </button>
                        <button onClick={() => navigate('/app')} className="h-10 px-6 bg-primary text-black text-xs font-bold uppercase tracking-widest hover:bg-white transition-all rounded-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">add</span>
                            New Scrape
                        </button>
                    </div>
                </header>
                {/* Page Title Area */}
                <div className="p-8 pb-0">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight uppercase text-white">
                                Scrape <span className="text-white/40">History</span>
                            </h1>
                            <p className="text-white/40 text-sm mt-1">
                                Audit log of all AI-powered extraction cycles.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <div className="px-4 py-2 bg-[#111] border border-[#222] rounded-sm text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 text-white/40">
                                <span>Total Usage:</span> <span className="text-white">1.2M Tokens</span>
                            </div>
                            <button className="px-4 py-2 bg-[#111] border border-[#222] hover:border-white/40 rounded-sm text-[10px] uppercase font-bold tracking-widest transition-all text-white">
                                Export CSV
                            </button>
                        </div>
                    </div>
                </div>
                {/* Content Area: Table */}
                <div className="p-8 flex-1 overflow-auto">
                    <div className="border border-[#222] rounded-sm bg-[#050505] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[#222] bg-[#0A0A0A]">
                                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white/40 font-bold">
                                            Source URL
                                        </th>
                                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white/40 font-bold">
                                            Timestamp
                                        </th>
                                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white/40 font-bold">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white/40 font-bold">
                                            Compute Usage
                                        </th>
                                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white/40 font-bold text-right">
                                            Operations
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#111]">
                                    {/* Row 1 */}
                                    <tr className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-white/20 group-hover:text-primary">
                                                    link
                                                </span>
                                                <span className="text-xs font-mono truncate max-w-[280px] text-white/80">
                                                    https://techcrunch.com/2023/latest-ai-trends
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-xs text-white/50 font-mono">
                                            2023-10-24 14:30:12
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="inline-flex items-center gap-2 px-2 py-1 rounded-sm bg-[#00ff88]/10 border border-[#00ff88]/20">
                                                <span className="size-1.5 bg-[#00ff88] rounded-full shadow-[0_0_8px_#00ff88]" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider status-success">
                                                    Success
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-xs font-mono text-white/70">
                                            1,240 tokens
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-end gap-1">
                                                <button className="action-icon p-2 rounded transition-all text-white/40" title="View JSON">
                                                    <span className="material-symbols-outlined">data_object</span>
                                                </button>
                                                <button className="action-icon p-2 rounded transition-all text-white/40" title="Redeploy">
                                                    <span className="material-symbols-outlined">refresh</span>
                                                </button>
                                                <button className="action-icon p-2 rounded transition-all text-white/40 hover:!text-red-500" title="Delete">
                                                    <span className="material-symbols-outlined">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* Row 2 */}
                                    <tr className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-white/20 group-hover:text-primary">
                                                    link
                                                </span>
                                                <span className="text-xs font-mono truncate max-w-[280px] text-white/80">
                                                    https://blog.openai.com/devday-recap-2023
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-xs text-white/50 font-mono">
                                            2023-10-24 12:15:45
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="inline-flex items-center gap-2 px-2 py-1 rounded-sm bg-[#ff3e3e]/10 border border-[#ff3e3e]/20">
                                                <span className="size-1.5 bg-[#ff3e3e] rounded-full shadow-[0_0_8px_#ff3e3e]" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider status-failed">
                                                    Failed
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-xs font-mono text-white/70">
                                            0 tokens
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-end gap-1">
                                                <button className="action-icon p-2 rounded transition-all text-white/40" title="View Error Log">
                                                    <span className="material-symbols-outlined">bug_report</span>
                                                </button>
                                                <button className="action-icon p-2 rounded transition-all text-white/40" title="Redeploy">
                                                    <span className="material-symbols-outlined">refresh</span>
                                                </button>
                                                <button className="action-icon p-2 rounded transition-all text-white/40 hover:!text-red-500" title="Delete">
                                                    <span className="material-symbols-outlined">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* Row 3 */}
                                    <tr className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-white/20 group-hover:text-primary">
                                                    link
                                                </span>
                                                <span className="text-xs font-mono truncate max-w-[280px] text-white/80">
                                                    https://news.ycombinator.com/item?id=379123
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-xs text-white/50 font-mono">
                                            2023-10-23 09:45:22
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="inline-flex items-center gap-2 px-2 py-1 rounded-sm bg-[#00ff88]/10 border border-[#00ff88]/20">
                                                <span className="size-1.5 bg-[#00ff88] rounded-full shadow-[0_0_8px_#00ff88]" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider status-success">
                                                    Success
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-xs font-mono text-white/70">
                                            850 tokens
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-end gap-1">
                                                <button className="action-icon p-2 rounded transition-all text-white/40" title="View JSON">
                                                    <span className="material-symbols-outlined">data_object</span>
                                                </button>
                                                <button className="action-icon p-2 rounded transition-all text-white/40" title="Redeploy">
                                                    <span className="material-symbols-outlined">refresh</span>
                                                </button>
                                                <button className="action-icon p-2 rounded transition-all text-white/40 hover:!text-red-500" title="Delete">
                                                    <span className="material-symbols-outlined">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {/* Footer Meta */}
                <footer className="p-8 pt-0 flex justify-between items-center opacity-50 text-[10px] uppercase tracking-[0.2em] text-white">
                    <div className="flex gap-6">
                        <a className="hover:text-primary" href="#">
                            Security Docs
                        </a>
                        <a className="hover:text-primary" href="#">
                            API v2.4.0
                        </a>
                        <a className="hover:text-primary" href="#">
                            System Status
                        </a>
                    </div>
                    <div>© 2023 ScrapyFire.Ai // LOG_LEVEL: VERBOSE</div>
                </footer>
            </main>
        </div>
    );
}

export default ScrapeHistory;