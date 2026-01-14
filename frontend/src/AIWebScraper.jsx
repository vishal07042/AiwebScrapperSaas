import React, { useState } from 'react';
import { Terminal, Globe, Zap, Settings, Code, Trash2, Plus, ChevronDown, ChevronUp, Copy, Check, Sparkles, Activity } from 'lucide-react';

export default function AIWebScraper() {
    const [url, setUrl] = useState('');
    const [fields, setFields] = useState([
        { name: 'title', type: 'string', description: 'Page title', optional: false }
    ]);
    const [options, setOptions] = useState({
        maxChars: 15000,
        waitTime: 2000,
        selector: '',
        fullPage: false
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showOptions, setShowOptions] = useState(false);
    const [copied, setCopied] = useState(false);

    const addField = () => {
        setFields([...fields, { name: '', type: 'string', description: '', optional: false }]);
    };

    const removeField = (index) => {
        setFields(fields.filter((_, i) => i !== index));
    };

    const updateField = (index, key, value) => {
        const newFields = [...fields];
        newFields[index][key] = value;
        setFields(newFields);
    };

    const handleScrape = async () => {
        if (!url || fields.some(f => !f.name || !f.description)) {
            setError('Please fill in URL and all field details');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const payload = {
                url,
                fields: fields.map(f => ({
                    name: f.name,
                    type: f.type,
                    description: f.description,
                    ...(f.optional && { optional: true })
                })),
                options: {
                    maxChars: parseInt(options.maxChars),
                    waitTime: parseInt(options.waitTime),
                    ...(options.selector && { selector: options.selector }),
                    fullPage: options.fullPage
                }
            };

            const response = await fetch('http://localhost:3000/api/scrape/smart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                setResult(data.data);
            } else {
                setError(data.error || 'Scraping failed');
            }
        } catch (err) {
            setError('Failed to connect to scraper API. Make sure the server is running on http://localhost:3000');
        } finally {
            setLoading(false);
        }
    };

    const loadPreset = (preset) => {
        switch (preset) {
            case 'leetcode':
                setUrl('https://leetcode.com/username/');
                setFields([
                    { name: 'problemsSolved', type: 'number', description: 'Total problems solved', optional: false },
                    { name: 'ranking', type: 'number', description: 'Global ranking', optional: false },
                    { name: 'acceptanceRate', type: 'number', description: 'Acceptance rate percentage', optional: true }
                ]);
                break;
            case 'github':
                setUrl('https://github.com/username');
                setFields([
                    { name: 'repositories', type: 'number', description: 'Number of public repositories', optional: false },
                    { name: 'followers', type: 'number', description: 'Number of followers', optional: false },
                    { name: 'contributions', type: 'number', description: 'Contributions this year', optional: true }
                ]);
                break;
            case 'product':
                setUrl('https://example.com/product');
                setFields([
                    { name: 'name', type: 'string', description: 'Product name', optional: false },
                    { name: 'price', type: 'number', description: 'Price in USD', optional: false },
                    { name: 'rating', type: 'number', description: 'Product rating out of 5', optional: true },
                    { name: 'inStock', type: 'boolean', description: 'Whether product is in stock', optional: true }
                ]);
                break;
        }
    };

    const copyResult = () => {
        navigator.clipboard.writeText(JSON.stringify(result, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-black text-gray-100">
            {/* Subtle grid background */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(75,75,75,0.03)_1px,_transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <div className="relative z-10">
                {/* Header */}
                <div className="border-b border-gray-900 bg-black/50 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                    <Terminal className="w-5 h-5 text-black" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">AI Web Scraper</h1>
                                    <p className="text-xs text-gray-500">Intelligent data extraction platform</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                    <Activity className="w-3 h-3 text-emerald-400" />
                                    <span className="text-emerald-400">API Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Panel - Configuration */}
                        <div className="space-y-5">
                            {/* URL Input */}
                            <div className="bg-zinc-950 rounded-xl shadow-2xl shadow-black/50 border border-gray-900">
                                <div className="p-5 border-b border-gray-900">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Globe className="w-4 h-4 text-emerald-400" />
                                        <h2 className="text-sm font-semibold text-white">Target URL</h2>
                                    </div>
                                    <p className="text-xs text-gray-600">Enter the website you want to scrape</p>
                                </div>
                                <div className="p-5">
                                    <input
                                        type="text"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="https://example.com"
                                        className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-gray-700"
                                    />

                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={() => loadPreset('leetcode')}
                                            className="px-3 py-1.5 text-xs bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-md transition-colors text-gray-400 hover:text-gray-300"
                                        >
                                            LeetCode
                                        </button>
                                        <button
                                            onClick={() => loadPreset('github')}
                                            className="px-3 py-1.5 text-xs bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-md transition-colors text-gray-400 hover:text-gray-300"
                                        >
                                            GitHub
                                        </button>
                                        <button
                                            onClick={() => loadPreset('product')}
                                            className="px-3 py-1.5 text-xs bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-md transition-colors text-gray-400 hover:text-gray-300"
                                        >
                                            Product
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Fields Configuration */}
                            <div className="bg-zinc-950 rounded-xl shadow-2xl shadow-black/50 border border-gray-900">
                                <div className="p-5 border-b border-gray-900">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Code className="w-4 h-4 text-emerald-400" />
                                                <h2 className="text-sm font-semibold text-white">Fields to Extract</h2>
                                            </div>
                                            <p className="text-xs text-gray-600">Define what data you want to scrape</p>
                                        </div>
                                        <button
                                            onClick={addField}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors text-xs font-medium text-black"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            Add
                                        </button>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                                        {fields.map((field, index) => (
                                            <div key={index} className="bg-black rounded-lg p-4 border border-gray-900 hover:border-gray-800 transition-colors">
                                                <div className="grid grid-cols-2 gap-3 mb-3">
                                                    <input
                                                        type="text"
                                                        value={field.name}
                                                        onChange={(e) => updateField(index, 'name', e.target.value)}
                                                        placeholder="Field name"
                                                        className="bg-zinc-950 border border-gray-800 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 placeholder:text-gray-700"
                                                    />
                                                    <select
                                                        value={field.type}
                                                        onChange={(e) => updateField(index, 'type', e.target.value)}
                                                        className="bg-zinc-950 border border-gray-800 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
                                                    >
                                                        <option value="string">String</option>
                                                        <option value="number">Number</option>
                                                        <option value="boolean">Boolean</option>
                                                        <option value="array">Array</option>
                                                    </select>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={field.description}
                                                    onChange={(e) => updateField(index, 'description', e.target.value)}
                                                    placeholder="Description (what to extract)"
                                                    className="w-full bg-zinc-950 border border-gray-800 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 mb-3 placeholder:text-gray-700"
                                                />
                                                <div className="flex items-center justify-between">
                                                    <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer hover:text-gray-400">
                                                        <input
                                                            type="checkbox"
                                                            checked={field.optional}
                                                            onChange={(e) => updateField(index, 'optional', e.target.checked)}
                                                            className="w-3.5 h-3.5 rounded bg-zinc-950 border-gray-800 text-emerald-500 focus:ring-emerald-500/20"
                                                        />
                                                        Optional field
                                                    </label>
                                                    <button
                                                        onClick={() => removeField(index)}
                                                        className="text-red-400 hover:text-red-300 transition-colors p-1"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Advanced Options */}
                            <div className="bg-zinc-950 rounded-xl shadow-2xl shadow-black/50 border border-gray-900">
                                <button
                                    onClick={() => setShowOptions(!showOptions)}
                                    className="w-full p-5 flex items-center justify-between hover:bg-zinc-900/50 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <Settings className="w-4 h-4 text-gray-500" />
                                        <h2 className="text-sm font-semibold text-white">Advanced Options</h2>
                                    </div>
                                    {showOptions ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                                </button>

                                {showOptions && (
                                    <div className="p-5 pt-0 space-y-4 border-t border-gray-900">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-2">Max Characters</label>
                                            <input
                                                type="number"
                                                value={options.maxChars}
                                                onChange={(e) => setOptions({ ...options, maxChars: e.target.value })}
                                                className="w-full bg-black border border-gray-800 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
                                            />
                                            <p className="text-xs text-gray-600 mt-1">Default: 15000</p>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-2">Wait Time (ms)</label>
                                            <input
                                                type="number"
                                                value={options.waitTime}
                                                onChange={(e) => setOptions({ ...options, waitTime: e.target.value })}
                                                className="w-full bg-black border border-gray-800 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
                                            />
                                            <p className="text-xs text-gray-600 mt-1">Wait for JavaScript to load</p>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-2">CSS Selector</label>
                                            <input
                                                type="text"
                                                value={options.selector}
                                                onChange={(e) => setOptions({ ...options, selector: e.target.value })}
                                                placeholder="e.g., main, #content"
                                                className="w-full bg-black border border-gray-800 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 placeholder:text-gray-700"
                                            />
                                            <p className="text-xs text-gray-600 mt-1">Target specific element (optional)</p>
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer hover:text-gray-300">
                                                <input
                                                    type="checkbox"
                                                    checked={options.fullPage}
                                                    onChange={(e) => setOptions({ ...options, fullPage: e.target.checked })}
                                                    className="w-3.5 h-3.5 rounded bg-zinc-950 border-gray-800 text-emerald-500 focus:ring-emerald-500/20"
                                                />
                                                Send full page content (slower)
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Scrape Button */}
                            <button
                                onClick={handleScrape}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:from-gray-800 disabled:to-gray-800 rounded-lg py-4 font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 disabled:shadow-none disabled:cursor-not-allowed text-black disabled:text-gray-600"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-4 h-4" />
                                        Start Extraction
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Right Panel - Results */}
                        <div className="space-y-5">
                            {/* Error Display */}
                            {error && (
                                <div className="bg-zinc-950 border border-red-500/20 rounded-xl p-5 shadow-2xl shadow-red-500/5">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                            <span className="text-red-400 text-lg">!</span>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-red-400 mb-1">Extraction Failed</h3>
                                            <p className="text-xs text-gray-400 leading-relaxed">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Result Display */}
                            {result && (
                                <div className="bg-zinc-950 rounded-xl shadow-2xl shadow-black/50 border border-gray-900">
                                    <div className="p-5 border-b border-gray-900 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-emerald-400" />
                                            <h2 className="text-sm font-semibold text-white">Extracted Data</h2>
                                        </div>
                                        <button
                                            onClick={copyResult}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-md transition-colors text-xs text-gray-400"
                                        >
                                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                            {copied ? 'Copied' : 'Copy'}
                                        </button>
                                    </div>

                                    <div className="p-5">
                                        {/* JSON View */}
                                        <div className="bg-black rounded-lg p-4 overflow-x-auto border border-gray-900 mb-4">
                                            <pre className="text-xs text-emerald-400 font-mono leading-relaxed">
                                                {JSON.stringify(result, null, 2)}
                                            </pre>
                                        </div>

                                        {/* Table View */}
                                        <div className="space-y-2">
                                            <p className="text-xs text-gray-600 mb-3">Structured View</p>
                                            {Object.entries(result).map(([key, value]) => (
                                                <div key={key} className="bg-black rounded-lg p-3 border border-gray-900 hover:border-gray-800 transition-colors">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <span className="text-xs font-mono text-emerald-400">{key}</span>
                                                        <span className="text-xs text-gray-400 text-right font-mono">
                                                            {Array.isArray(value)
                                                                ? `[${value.length} items]`
                                                                : typeof value === 'object'
                                                                    ? JSON.stringify(value)
                                                                    : String(value)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Info Panel */}
                            {!result && !error && !loading && (
                                <div className="bg-zinc-950 rounded-xl shadow-2xl shadow-black/50 border border-gray-900">
                                    <div className="p-5 border-b border-gray-900">
                                        <h3 className="text-sm font-semibold text-white">Getting Started</h3>
                                    </div>
                                    <div className="p-5">
                                        <div className="space-y-4 text-xs text-gray-500">
                                            <div className="flex gap-3">
                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-xs text-emerald-400 font-semibold">1</div>
                                                <p className="pt-0.5">Enter the URL of the webpage you want to scrape</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-xs text-emerald-400 font-semibold">2</div>
                                                <p className="pt-0.5">Define the fields you want to extract with clear descriptions</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-xs text-emerald-400 font-semibold">3</div>
                                                <p className="pt-0.5">Configure advanced options for better accuracy (optional)</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-xs text-emerald-400 font-semibold">4</div>
                                                <p className="pt-0.5">Click "Start Extraction" and get structured JSON data</p>
                                            </div>
                                        </div>

                                        <div className="mt-6 p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                                            <p className="text-xs text-emerald-400/80 leading-relaxed">
                                                <strong className="text-emerald-400">💡 Quick Start:</strong> Use preset buttons above to see example configurations for popular sites like LeetCode, GitHub, and e-commerce products.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Features */}
                            <div className="bg-zinc-950 rounded-xl shadow-2xl shadow-black/50 border border-gray-900">
                                <div className="p-5">
                                    <h3 className="text-sm font-semibold text-white mb-4">Platform Features</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                                            AI-Powered Extraction
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                                            Universal Compatibility
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                                            No HTML Knowledge
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                                            Structured Output
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                                            Real-time Processing
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                                            JSON Export
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}