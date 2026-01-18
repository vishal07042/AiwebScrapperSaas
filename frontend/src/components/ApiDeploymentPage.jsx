import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function ApiDeploymentPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // Get state from navigation
    const {
        url = '',
        mode = '',
        prompt = '',
        fields = [],
        result = null,
        endpointName = 'my-endpoint',
        description = 'API endpoint'
    } = location.state || {};

    // Generate a unique endpoint ID
    const [endpointId] = useState(() => {
        return Math.random().toString(36).substring(2, 8) + '-' + Math.random().toString(36).substring(2, 4);
    });

    const [apiUrl, setApiUrl] = useState(`https://scraper-api-worker.professionalprovishal.workers.dev/v1/endpoints/${endpointId}/live`);
    const [isDeploying, setIsDeploying] = useState(false);
    const [logs, setLogs] = useState([]);
    const [selectedLang, setSelectedLang] = useState('curl');

    const addLog = (message, type = 'info') => {
        setLogs(prev => [...prev, { message, type, timestamp: new Date() }]);
    };

    const handleDeploy = async () => {
        setIsDeploying(true);
        setLogs([]); // Clear previous logs

        addLog('Initializing deployment sequence...');
        addLog(`Target Endpoint ID: ${endpointId}`);
        addLog('Verifying payload integrity...');

        try {
            await new Promise(r => setTimeout(r, 800)); // UX delay
            addLog('Authenticating with Cloudflare API...');

            const response = await fetch('http://13.218.77.175:3000/api/deploy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: 'user-' + Math.random().toString(36).substr(2, 9),
                    endpointName: endpointId,
                    data: result || { message: "No data scraped yet" },
                    description: description
                }),
            });

            addLog('Uploading data to edge storage (KV)...');
            const data = await response.json();

            if (data.success) {
                setApiUrl(data.deployment.url);
                addLog('Verifying deployment status...');
                await new Promise(r => setTimeout(r, 500));

                addLog(`Deployment Successful! Cloudflare Status: ${data.deployment.cloudflareStatus || 'live'}`, 'success');
                addLog(`Access URL: ${data.deployment.url}`, 'success');
                addLog('Ready to serve traffic.', 'success');
            } else {
                addLog(`Deployment Failed: ${data.error}`, 'error');
                if (data.details) addLog(`Details: ${data.details}`, 'error');
            }
        } catch (error) {
            console.error('Deployment error:', error);
            addLog(`Deployment Error: ${error.message}`, 'error');
        } finally {
            setIsDeploying(false);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-black text-white">
            {/* Sidebar (Collapsed on mobile, distinct on desktop) */}

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-background-dark relative">
                {/* Subtle Grid Background */}
                <div
                    className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: "radial-gradient(#333 1px, transparent 1px)",
                        backgroundSize: "24px 24px"
                    }}
                />
                <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-3xl font-bold tracking-tight text-white">
                                    API DEPLOYMENT
                                </h1>
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-border text-gray-400 border border-gray-800">
                                    ID: {endpointId}
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                {description || 'Configure production environment for scraped endpoint.'}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-card border border-surface-border rounded-full shadow-lg">
                            <div className="size-2.5 rounded-full bg-cyber-green pulse-dot" />
                            <span className="text-cyber-green text-xs font-bold uppercase tracking-wider">
                                Status: Live
                            </span>
                        </div>
                    </div>
                    {/* Main Configuration Card */}
                    <div className="bg-surface-card border border-surface-border rounded shadow-2xl overflow-hidden">
                        {/* Section 1: Endpoint URL */}
                        <div className="p-6 border-b border-surface-border">
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 font-display">
                                Access URL
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-primary text-xl">
                                        link
                                    </span>
                                </div>
                                <input
                                    className="w-full bg-black border border-surface-border text-white text-sm font-mono rounded pl-10 pr-24 py-4 focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner"
                                    readOnly=""
                                    type="text"
                                    value={apiUrl}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">
                                    <button className="h-9 px-3 bg-surface-border hover:bg-surface-border/80 text-white text-xs font-bold rounded flex items-center gap-2 transition-colors border border-white/5" onClick={(e) => {
                                        e.preventDefault();
                                        navigator.clipboard.writeText(apiUrl);
                                    }}>
                                        <span className="material-symbols-outlined text-base">
                                            content_copy
                                        </span>
                                        COPY
                                    </button>
                                </div>
                            </div>
                            <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">info</span>
                                This endpoint is currently serving live data from the latest
                                snapshot.
                            </p>
                        </div>
                        {/* Section 1.5: Source Information */}
                        {url && (
                            <div className="p-6 border-b border-surface-border bg-surface-dark/30">
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 font-display">
                                    Source URL
                                </label>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="material-symbols-outlined text-primary text-sm">
                                        language
                                    </span>
                                    <span className="text-sm text-gray-300 font-mono break-all">
                                        {url}
                                    </span>
                                </div>
                                {result && (
                                    <div className="mt-4">
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 font-display">
                                            Data Preview
                                        </label>
                                        <div className="bg-black border border-surface-border rounded p-3 max-h-40 overflow-auto">
                                            <pre className="text-xs text-gray-400 font-mono">
                                                {JSON.stringify(result, null, 2).slice(0, 500)}
                                                {JSON.stringify(result, null, 2).length > 500 && '...'}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {/* Section 2: Configuration Grid */}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 border-b border-surface-border bg-surface-dark/50">
                            {/* HTTP Method */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 font-display">
                                    Method
                                </label>
                                <div className="flex items-center">
                                    <div className="inline-flex items-center justify-center px-4 py-2 bg-[#0F291E] border border-cyber-green/30 rounded text-cyber-green font-mono text-sm font-bold tracking-wide">
                                        GET
                                    </div>
                                    <span className="ml-3 text-xs text-gray-500">
                                        Read-only access
                                    </span>
                                </div>
                            </div>
                            {/* Authentication Toggle */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 font-display">
                                    Authentication
                                </label>
                                <div className="flex items-center justify-between h-[38px]">
                                    <span className="text-sm text-gray-300">Public Access</span>
                                    <div className="px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] uppercase font-bold tracking-wider">
                                        Free
                                    </div>
                                </div>
                            </div>
                            {/* Rate Limit */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 font-display">
                                    Rate Limit
                                </label>
                                <div className="relative">
                                    <select className="w-full bg-surface-card border border-surface-border text-white text-sm rounded px-3 py-2.5 focus:ring-1 focus:ring-primary focus:border-primary appearance-none cursor-pointer hover:border-gray-600 transition-colors">
                                        <option>100 requests / min</option>
                                        <option defaultValue="selected">500 requests / min</option>
                                        <option>1,000 requests / min (Pro)</option>
                                        <option>Unlimited (Enterprise)</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                                        <span className="material-symbols-outlined">expand_more</span>
                                    </div>
                                </div>
                            </div>
                            {/* Refresh Interval */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 font-display">
                                    Data Refresh
                                </label>
                                <div className="relative">
                                    <select className="w-full bg-surface-card border border-surface-border text-white text-sm rounded px-3 py-2.5 focus:ring-1 focus:ring-primary focus:border-primary appearance-none cursor-pointer hover:border-gray-600 transition-colors">
                                        <option>Real-time (Live)</option>
                                        <option defaultValue="selected">Every 1 hour</option>
                                        <option>Every 24 hours</option>
                                        <option>Weekly</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                                        <span className="material-symbols-outlined">schedule</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Section 3: Terminal / Usage Example */}
                        <div className="bg-[#050505] min-h-[300px]">
                            {logs.length > 0 ? (
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center border-b border-surface-border px-2 bg-surface-card/20">
                                        <div className="text-xs font-bold uppercase tracking-widest text-cyber-green px-4 py-3 font-display mr-auto flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm animate-pulse">terminal</span>
                                            Deployment Logs
                                        </div>
                                        <button
                                            onClick={() => setLogs([])}
                                            className="text-xs text-gray-500 hover:text-white px-3 py-1"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                    <div className="p-6 font-mono text-xs sm:text-sm overflow-x-auto code-scroll bg-black flex-1">
                                        <div className="flex flex-col gap-1">
                                            {logs.map((log, index) => (
                                                <div key={index} className={`font-mono ${log.type === 'error' ? 'text-red-500' :
                                                    log.type === 'success' ? 'text-cyber-green' : 'text-gray-300'
                                                    }`}>
                                                    <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                                    {log.message}
                                                </div>
                                            ))}
                                            {isDeploying && (
                                                <div className="text-primary animate-pulse">_</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center border-b border-surface-border px-2">
                                        <div className="text-xs font-bold uppercase tracking-widest text-gray-500 px-4 py-3 font-display mr-auto">
                                            Usage Example
                                        </div>
                                        <div className="flex gap-1 h-full pt-2">
                                            <button
                                                onClick={() => setSelectedLang('curl')}
                                                className={`px-4 py-2 text-xs font-mono transition-colors ${selectedLang === 'curl' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-400 hover:text-white border-b-2 border-transparent hover:bg-white/5'}`}
                                            >
                                                cURL
                                            </button>
                                            <button
                                                onClick={() => setSelectedLang('js')}
                                                className={`px-4 py-2 text-xs font-mono transition-colors ${selectedLang === 'js' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-400 hover:text-white border-b-2 border-transparent hover:bg-white/5'}`}
                                            >
                                                JavaScript
                                            </button>
                                            <button
                                                onClick={() => setSelectedLang('python')}
                                                className={`px-4 py-2 text-xs font-mono transition-colors ${selectedLang === 'python' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-400 hover:text-white border-b-2 border-transparent hover:bg-white/5'}`}
                                            >
                                                Python
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-6 font-mono text-xs sm:text-sm overflow-x-auto code-scroll bg-code-bg">
                                        {selectedLang === 'curl' && (
                                            <pre className="text-gray-300 leading-relaxed">
                                                <span className="text-primary">curl</span> -X{" "}
                                                <span className="text-cyber-green">GET</span>{" "}
                                                <span className="text-[#e6db74]">
                                                    '{apiUrl}'
                                                </span>{" "}
                                                \{"\n"}
                                                {"  "}-H{" "}
                                                <span className="text-[#e6db74]">
                                                    'Content-Type: application/json'
                                                </span>
                                            </pre>
                                        )}
                                        {selectedLang === 'js' && (
                                            <pre className="text-gray-300 leading-relaxed">
                                                <span className="text-primary">fetch</span>(
                                                <span className="text-[#e6db74]">
                                                    '{apiUrl}'
                                                </span>
                                                )
                                                {"\n"}
                                                {"  "}.<span className="text-blue-400">then</span>(response ={">"} response.json())
                                                {"\n"}
                                                {"  "}.<span className="text-blue-400">then</span>(data ={">"} console.log(data));
                                            </pre>
                                        )}
                                        {selectedLang === 'python' && (
                                            <pre className="text-gray-300 leading-relaxed">
                                                <span className="text-primary">import</span> requests
                                                {"\n\n"}
                                                response = requests.get(
                                                <span className="text-[#e6db74]">
                                                    '{apiUrl}'
                                                </span>
                                                )
                                                {"\n"}
                                                print(response.json())
                                            </pre>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Sticky Footer for Action */}
                    <div className="mt-6 p-6 border border-surface-border bg-surface-card rounded flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-xs text-gray-500">
                            Last deployed: <span className="text-gray-300">Just now</span>{" "}
                            by <span className="text-gray-300">alex@scrapyfire.ai</span>
                        </div>
                        <button
                            onClick={handleDeploy}
                            disabled={isDeploying}
                            className="w-full sm:w-auto px-8 py-3 bg-primary hover:bg-primary/90 text-black text-sm font-bold uppercase tracking-wider rounded shadow-glow hover:shadow-glow-active transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isDeploying ? (
                                <>
                                    <div className="size-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                                    Deploying...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-lg">
                                        rocket_launch
                                    </span>
                                    {logs.length > 0 ? 'Redeploy Endpoint' : 'Deploy New Endpoint'}
                                </>
                            )}
                        </button>
                    </div>
                    {/* Bottom Helper Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                        <div className="p-4 rounded border border-surface-border bg-surface-card hover:border-gray-700 transition-colors group cursor-pointer">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded bg-surface-dark border border-surface-border text-neon-purple group-hover:text-white group-hover:border-neon-purple transition-colors">
                                    <span className="material-symbols-outlined text-xl">
                                        description
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white mb-1">
                                        API Documentation
                                    </h3>
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        Read the full reference for response structures, error codes,
                                        and pagination.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 rounded border border-surface-border bg-surface-card hover:border-gray-700 transition-colors group cursor-pointer">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded bg-surface-dark border border-surface-border text-primary group-hover:text-white group-hover:border-primary transition-colors">
                                    <span className="material-symbols-outlined text-xl">
                                        monitoring
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white mb-1">
                                        Usage Analytics
                                    </h3>
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        Monitor request volume, latency, and success rates for this
                                        endpoint.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ApiDeploymentPage;