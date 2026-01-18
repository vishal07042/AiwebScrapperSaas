import React, { useState, useEffect } from 'react';
import { Terminal, Globe, Zap, Settings, Code, Trash2, Plus, ChevronDown, ChevronUp, Copy, Check, Sparkles, Activity, FileJson, AlignLeft, Box, FileText, Type, Rocket, ExternalLink, X } from 'lucide-react';

export default function AIWebScraper() {
    const [url, setUrl] = useState('');
    const [mode, setMode] = useState('smart'); // smart, custom, product, article
    const [prompt, setPrompt] = useState('');
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
    const [editableJson, setEditableJson] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showOptions, setShowOptions] = useState(false);
    const [copied, setCopied] = useState(false);

    // Deployment states
    const [showDeployModal, setShowDeployModal] = useState(false);
    const [deploymentConfig, setDeploymentConfig] = useState({
        userId: 'demo-user',
        endpointName: '',
        description: ''
    });
    const [deploymentResult, setDeploymentResult] = useState(null);
    const [deploying, setDeploying] = useState(false);

    useEffect(() => {
        if (result) {
            setEditableJson(JSON.stringify(result, null, 2));
        }
    }, [result]);

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
        if (!url) {
            setError('Please enter a URL');
            return;
        }

        if (mode === 'smart' && fields.some(f => !f.name || !f.description)) {
            setError('Please fill in all field details');
            return;
        }

        if (mode === 'custom' && !prompt) {
            setError('Please enter a description of what to extract');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);
        setEditableJson('');

        try {
            let endpoint = '';
            let body = {
                url, options: {
                    maxChars: parseInt(options.maxChars),
                    waitTime: parseInt(options.waitTime),
                    ...(options.selector && { selector: options.selector }),
                    fullPage: options.fullPage
                }
            };

            switch (mode) {
                case 'smart':
                    endpoint = '/api/scrape/smart';
                    body.fields = fields.map(f => ({
                        name: f.name,
                        type: f.type,
                        description: f.description,
                        ...(f.optional && { optional: true })
                    }));
                    break;
                case 'custom':
                    endpoint = '/api/scrape';
                    body.prompt = prompt;
                    break;
                case 'product':
                    endpoint = '/api/scrape/products';
                    break;
                case 'article':
                    endpoint = '/api/scrape/article';
                    break;
                default:
                    throw new Error('Invalid mode selected');
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
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
                setMode('smart');
                setFields([
                    { name: 'problemsSolved', type: 'number', description: 'Total problems solved', optional: false },
                    { name: 'ranking', type: 'number', description: 'Global ranking', optional: false },
                    { name: 'acceptanceRate', type: 'number', description: 'Acceptance rate percentage', optional: true }
                ]);
                break;
            case 'github':
                setUrl('https://github.com/username');
                setMode('smart');
                setFields([
                    { name: 'repositories', type: 'number', description: 'Number of public repositories', optional: false },
                    { name: 'followers', type: 'number', description: 'Number of followers', optional: false },
                    { name: 'contributions', type: 'number', description: 'Contributions this year', optional: true }
                ]);
                break;
            case 'product':
                setUrl('https://amazon.com/dp/B08...');
                setMode('product');
                break;
        }
    };

    const copyResult = () => {
        navigator.clipboard.writeText(editableJson);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatJson = () => {
        try {
            const parsed = JSON.parse(editableJson);
            setEditableJson(JSON.stringify(parsed, null, 2));
            setResult(parsed); // Sync internal state
        } catch (e) {
            setError('Invalid JSON: Cannot format');
        }
    };

    const minifyJson = () => {
        try {
            const parsed = JSON.parse(editableJson);
            setEditableJson(JSON.stringify(parsed));
            setResult(parsed); // Sync internal state
        } catch {
            setError('Invalid JSON: Cannot minify');
        }
    };

    const handleDeploy = async () => {
        if (!editableJson || !result) {
            setError('No data to deploy. Please scrape some data first.');
            return;
        }

        if (!deploymentConfig.endpointName) {
            setError('Please enter an endpoint name');
            return;
        }

        setDeploying(true);
        setError('');

        try {
            const response = await fetch('/api/deploy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: deploymentConfig.userId,
                    endpointName: deploymentConfig.endpointName.toLowerCase().replace(/\s+/g, '-'),
                    description: deploymentConfig.description || `Deployed from ${url}`,
                    data: JSON.parse(editableJson)
                })
            });

            const data = await response.json();

            if (data.success) {
                setDeploymentResult(data.deployment);
                setShowDeployModal(false);
                // Show success notification
                setTimeout(() => {
                    alert(`✅ Deployment successful!\n\nYour data is now available at:\n${data.deployment.url}`);
                }, 100);
            } else {
                setError(data.error || 'Deployment failed');
            }
        } catch {
            setError('Failed to connect to deployment API. Make sure the server is running.');
        } finally {
            setDeploying(false);
        }
    };

    const openDeployModal = () => {
        // Auto-generate endpoint name from URL if possible
        const autoName = url.split('/')[2]?.replace(/\./g, '-') || 'my-endpoint';
        setDeploymentConfig({
            ...deploymentConfig,
            endpointName: autoName,
            description: `Data from ${url}`
        });
        setShowDeployModal(true);
    };

    return (
        <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-emerald-500/20">
            {/* Subtle grid background */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(75,75,75,0.03)_1px,_transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Header */}
                <div className="border-b border-gray-900 bg-black/50 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-8 py-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                    <Terminal className="w-6 h-6 text-black" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white tracking-tight">ScrapyFire.Ai</h1>
                                    <p className="text-sm text-gray-500 mt-0.5">Intelligent data extraction platform</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium">
                                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-emerald-400 tracking-wide">API ACTIVE</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-8 py-10 w-full flex-grow">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Left Panel - Configuration */}
                        <div className="space-y-8">
                            {/* URL and Mode */}
                            <div className="bg-zinc-950 rounded-2xl shadow-2xl shadow-black/50 border border-gray-900">
                                <div className="p-8 border-b border-gray-900">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-gray-900 rounded-lg">
                                            <Globe className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <h2 className="text-base font-bold text-white">Target & Mode</h2>
                                    </div>
                                    <p className="text-sm text-gray-500 ml-12">Enter URL and select extraction method</p>
                                </div>
                                <div className="p-8 space-y-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider ml-1">Target URL</label>
                                        <input
                                            type="text"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            placeholder="https://example.com"
                                            className="w-full bg-black border border-gray-800 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-gray-700"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Mode Buttons */}
                                        <button
                                            onClick={() => setMode('smart')}
                                            className={`flex items-center gap-3 px-5 py-4 rounded-xl border text-sm font-medium transition-all ${mode === 'smart' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-black border-gray-800 text-gray-400 hover:border-gray-700 hover:bg-gray-900/50'}`}
                                        >
                                            <Code className="w-5 h-5" />
                                            <span>Smart Fields</span>
                                        </button>
                                        <button
                                            onClick={() => setMode('custom')}
                                            className={`flex items-center gap-3 px-5 py-4 rounded-xl border text-sm font-medium transition-all ${mode === 'custom' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-black border-gray-800 text-gray-400 hover:border-gray-700 hover:bg-gray-900/50'}`}
                                        >
                                            <Type className="w-5 h-5" />
                                            <span>Natural Language</span>
                                        </button>
                                        <button
                                            onClick={() => setMode('product')}
                                            className={`flex items-center gap-3 px-5 py-4 rounded-xl border text-sm font-medium transition-all ${mode === 'product' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-black border-gray-800 text-gray-400 hover:border-gray-700 hover:bg-gray-900/50'}`}
                                        >
                                            <Box className="w-5 h-5" />
                                            <span>Products</span>
                                        </button>
                                        <button
                                            onClick={() => setMode('article')}
                                            className={`flex items-center gap-3 px-5 py-4 rounded-xl border text-sm font-medium transition-all ${mode === 'article' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-black border-gray-800 text-gray-400 hover:border-gray-700 hover:bg-gray-900/50'}`}
                                        >
                                            <FileText className="w-5 h-5" />
                                            <span>Article</span>
                                        </button>
                                    </div>

                                    <div className="flex gap-3 pt-4 border-t border-gray-900/50">
                                        <span className="text-xs text-gray-500 self-center uppercase tracking-wider font-semibold">Presets:</span>
                                        <button onClick={() => loadPreset('leetcode')} className="px-4 py-2 text-xs font-medium bg-gray-900 border border-gray-800 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/20 text-gray-400 transition-all">LeetCode</button>
                                        <button onClick={() => loadPreset('github')} className="px-4 py-2 text-xs font-medium bg-gray-900 border border-gray-800 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/20 text-gray-400 transition-all">GitHub</button>
                                        <button onClick={() => loadPreset('product')} className="px-4 py-2 text-xs font-medium bg-gray-900 border border-gray-800 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/20 text-gray-400 transition-all">Product</button>
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Input Section based on Mode */}
                            {mode === 'smart' && (
                                <div className="bg-zinc-950 rounded-2xl shadow-2xl shadow-black/50 border border-gray-900">
                                    <div className="p-8 border-b border-gray-900">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 bg-gray-900 rounded-lg">
                                                        <AlignLeft className="w-5 h-5 text-emerald-400" />
                                                    </div>
                                                    <h2 className="text-base font-bold text-white">Fields to Extract</h2>
                                                </div>
                                                <p className="text-sm text-gray-500 ml-12">Define structured data points</p>
                                            </div>
                                            <button
                                                onClick={addField}
                                                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all text-sm font-semibold text-black shadow-lg shadow-emerald-500/20"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add Field
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-8">
                                        <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent pr-2">
                                            {fields.map((field, index) => (
                                                <div key={index} className="bg-black rounded-xl p-5 border border-gray-900 hover:border-gray-700 transition-colors group">
                                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                                        <div className="col-span-2">
                                                            <label className="block text-[10px] text-gray-500 mb-1.5 uppercase font-medium">Field Name</label>
                                                            <input
                                                                type="text"
                                                                value={field.name}
                                                                onChange={(e) => updateField(index, 'name', e.target.value)}
                                                                placeholder="e.g. title"
                                                                className="w-full bg-zinc-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 placeholder:text-gray-700"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] text-gray-500 mb-1.5 uppercase font-medium">Type</label>
                                                            <div className="relative">
                                                                <select
                                                                    value={field.type}
                                                                    onChange={(e) => updateField(index, 'type', e.target.value)}
                                                                    className="w-full bg-zinc-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 appearance-none"
                                                                >
                                                                    <option value="string">String</option>
                                                                    <option value="number">Number</option>
                                                                    <option value="boolean">Boolean</option>
                                                                    <option value="array">Array</option>
                                                                </select>
                                                                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-500 pointer-events-none" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] text-gray-500 mb-1.5 uppercase font-medium">Description</label>
                                                        <input
                                                            type="text"
                                                            value={field.description}
                                                            onChange={(e) => updateField(index, 'description', e.target.value)}
                                                            placeholder="Describe what to extract (e.g. The main title of the page)"
                                                            className="w-full bg-zinc-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 mb-4 placeholder:text-gray-700"
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-between pt-2 border-t border-gray-900/50">
                                                        <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer hover:text-white transition-colors select-none">
                                                            <div className="relative flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={field.optional}
                                                                    onChange={(e) => updateField(index, 'optional', e.target.checked)}
                                                                    className="w-4 h-4 rounded border-gray-700 bg-zinc-950 text-emerald-500 focus:ring-emerald-500/20 transition-all"
                                                                />
                                                            </div>
                                                            Optional field
                                                        </label>
                                                        <button
                                                            onClick={() => removeField(index)}
                                                            className="text-gray-600 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg group-hover:text-gray-500"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {mode === 'custom' && (
                                <div className="bg-zinc-950 rounded-2xl shadow-2xl shadow-black/50 border border-gray-900">
                                    <div className="p-8 border-b border-gray-900">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-gray-900 rounded-lg">
                                                <Sparkles className="w-5 h-5 text-emerald-400" />
                                            </div>
                                            <h2 className="text-base font-bold text-white">Extraction Prompt</h2>
                                        </div>
                                        <p className="text-sm text-gray-500 ml-12">Describe what you want to extract in plain English</p>
                                    </div>
                                    <div className="p-8">
                                        <textarea
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder="e.g., Get all the reviews with rating and author name, also extract the product price..."
                                            className="w-full h-48 bg-black border border-gray-800 rounded-xl px-6 py-5 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-gray-700 resize-none leading-relaxed"
                                        />
                                    </div>
                                </div>
                            )}

                            {(mode === 'product' || mode === 'article') && (
                                <div className="bg-zinc-950 rounded-2xl shadow-2xl shadow-black/50 border border-gray-900">
                                    <div className="p-8">
                                        <div className="flex items-start gap-6">
                                            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                                {mode === 'product' ? <Box className="w-8 h-8 text-emerald-400" /> : <FileText className="w-8 h-8 text-emerald-400" />}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white mb-2">
                                                    {mode === 'product' ? 'Product Extraction Mode' : 'Article Extraction Mode'}
                                                </h3>
                                                <p className="text-sm text-gray-400 leading-7">
                                                    {mode === 'product'
                                                        ? 'Automatically detects product details like name, price, rating, availability, and images. Optimized for e-commerce sites.'
                                                        : 'Extracts main content, title, author, publish date, and generates a summary. Optimized for news, blogs, and articles.'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Advanced Options */}
                            <div className="bg-zinc-950 rounded-2xl shadow-2xl shadow-black/50 border border-gray-900 overflow-hidden">
                                <button
                                    onClick={() => setShowOptions(!showOptions)}
                                    className="w-full p-6 flex items-center justify-between hover:bg-zinc-900/50 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-gray-900 rounded-md group-hover:bg-gray-800 transition-colors">
                                            <Settings className="w-4 h-4 text-gray-500 group-hover:text-gray-400" />
                                        </div>
                                        <h2 className="text-sm font-semibold text-white">Advanced Options</h2>
                                    </div>
                                    {showOptions ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                                </button>

                                {showOptions && (
                                    <div className="p-8 pt-2 space-y-6 border-t border-gray-900/50">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Max Characters</label>
                                                <input
                                                    type="number"
                                                    value={options.maxChars}
                                                    onChange={(e) => setOptions({ ...options, maxChars: e.target.value })}
                                                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
                                                />
                                                <p className="text-[10px] text-gray-600 mt-1.5">Default: 15000</p>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Wait Time (ms)</label>
                                                <input
                                                    type="number"
                                                    value={options.waitTime}
                                                    onChange={(e) => setOptions({ ...options, waitTime: e.target.value })}
                                                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
                                                />
                                                <p className="text-[10px] text-gray-600 mt-1.5">Wait for JS load</p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">CSS Selector</label>
                                            <input
                                                type="text"
                                                value={options.selector}
                                                onChange={(e) => setOptions({ ...options, selector: e.target.value })}
                                                placeholder="e.g., main, #content"
                                                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 placeholder:text-gray-700"
                                            />
                                            <p className="text-[10px] text-gray-600 mt-1.5">Target specific element (optional)</p>
                                        </div>

                                        <div className="pt-2">
                                            <label className="flex items-center gap-3 text-sm text-gray-400 cursor-pointer hover:text-gray-300 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={options.fullPage}
                                                    onChange={(e) => setOptions({ ...options, fullPage: e.target.checked })}
                                                    className="w-5 h-5 rounded border-gray-800 bg-black text-emerald-500 focus:ring-emerald-500/20 transition-all"
                                                />
                                                Send full page content (slower but more complete)
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Scrape Button */}
                            <button
                                onClick={handleScrape}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:from-zinc-800 disabled:to-zinc-800 rounded-2xl py-5 font-bold text-base flex items-center justify-center gap-3 transition-all shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.5)] disabled:shadow-none disabled:cursor-not-allowed text-black disabled:text-zinc-600 tracking-wide transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
                                        Processing Request...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5 fill-black" />
                                        START EXTRACTION
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Right Panel - Results */}
                        <div className="space-y-8 flex flex-col h-full">
                            {/* Error Display */}
                            {error && (
                                <div className="bg-zinc-950 border border-red-500/20 rounded-2xl p-6 shadow-2xl shadow-red-500/5 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0 border border-red-500/20">
                                            <span className="text-red-400 text-xl font-bold">!</span>
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-red-500 mb-1">Extraction Failed</h3>
                                            <p className="text-sm text-gray-400 leading-relaxed opacity-90">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Result Display */}
                            {result || editableJson ? (
                                <div className="bg-zinc-950 rounded-2xl shadow-2xl shadow-black/50 border border-gray-900 flex flex-col flex-1 min-h-[600px] overflow-hidden">
                                    <div className="p-6 border-b border-gray-900 flex items-center justify-between flex-shrink-0 bg-black/20">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-900 rounded-lg">
                                                <FileJson className="w-5 h-5 text-emerald-400" />
                                            </div>
                                            <h2 className="text-base font-bold text-white">JSON Result</h2>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex bg-black rounded-lg p-1 border border-gray-900">
                                                <button
                                                    onClick={formatJson}
                                                    className="px-3 py-1.5 hover:bg-zinc-900 rounded-md text-xs font-medium text-gray-400 hover:text-white transition-colors"
                                                    title="Beautify JSON"
                                                >
                                                    Format
                                                </button>
                                                <button
                                                    onClick={minifyJson}
                                                    className="px-3 py-1.5 hover:bg-zinc-900 rounded-md text-xs font-medium text-gray-400 hover:text-white transition-colors"
                                                    title="Minify JSON"
                                                >
                                                    Compact
                                                </button>
                                            </div>
                                            <div className="w-px h-6 bg-gray-800"></div>
                                            <button
                                                onClick={copyResult}
                                                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg transition-colors text-xs font-semibold text-emerald-400 uppercase tracking-wide"
                                            >
                                                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                                {copied ? 'Copied' : 'Copy'}
                                            </button>
                                            <button
                                                onClick={openDeployModal}
                                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 rounded-lg transition-all text-xs font-bold text-black uppercase tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                                            >
                                                <Rocket className="w-3.5 h-3.5" />
                                                Deploy
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1 relative bg-black/50">
                                        <textarea
                                            value={editableJson}
                                            onChange={(e) => setEditableJson(e.target.value)}
                                            className="w-full h-full bg-transparent p-6 text-xs font-mono text-emerald-400 focus:outline-none resize-none leading-relaxed"
                                            spellCheck="false"
                                        />
                                    </div>

                                    <div className="p-4 border-t border-gray-900 bg-black/80 text-xs text-gray-500 flex justify-between items-center flex-shrink-0 font-mono">
                                        <span>Editable JSON Area</span>
                                        <span>{editableJson.length} characters</span>
                                    </div>
                                </div>
                            ) : (
                                /* Info Panel - Only show when no result */
                                !loading && (
                                    <div className="bg-zinc-950 rounded-2xl shadow-2xl shadow-black/50 border border-gray-900 h-full">
                                        <div className="p-8 border-b border-gray-900">
                                            <h3 className="text-lg font-bold text-white">Getting Started</h3>
                                            <p className="text-sm text-gray-500 mt-1">Follow these simple steps to extract data</p>
                                        </div>
                                        <div className="p-8">
                                            <div className="space-y-8 relative">
                                                {/* Connecting line */}
                                                <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-900"></div>

                                                <div className="flex gap-6 relative">
                                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-lg font-bold text-emerald-400 shadow-xl shadow-black z-10">1</div>
                                                    <div className="pt-2.5">
                                                        <h4 className="text-white font-semibold mb-1">Enter Target URL</h4>
                                                        <p className="text-sm text-gray-500">Paste the valid URL of the webpage you want to scrape data from.</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-6 relative">
                                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-lg font-bold text-emerald-400 shadow-xl shadow-black z-10">2</div>
                                                    <div className="pt-2.5">
                                                        <h4 className="text-white font-semibold mb-1">Select Mode</h4>
                                                        <p className="text-sm text-gray-500">Choose between Smart Fields, Natural Language, or specialized presets.</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-6 relative">
                                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-lg font-bold text-emerald-400 shadow-xl shadow-black z-10">3</div>
                                                    <div className="pt-2.5">
                                                        <h4 className="text-white font-semibold mb-1">Extract & Export</h4>
                                                        <p className="text-sm text-gray-500">Click "Start Extraction" and get perfectly formatted JSON data.</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-10 p-6 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 rounded-2xl border border-emerald-500/10">
                                                <div className="flex gap-4">
                                                    <div className="p-2 bg-emerald-500/10 rounded-lg h-fit">
                                                        <Sparkles className="w-5 h-5 text-emerald-400" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-white mb-2">Pro Tip</h4>
                                                        <p className="text-xs text-secondary-text leading-relaxed text-gray-400">
                                                            Use <span className="text-emerald-400 font-medium">"Natural Language"</span> mode to describe exactly what you want, e.g., "Find all the email addresses and the context they appear in."
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Deployment Modal */}
            {showDeployModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-zinc-950 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-lg animate-in slide-in-from-bottom-4 duration-300">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-900">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-cyan-500/10 rounded-lg">
                                    <Rocket className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">Deploy to API</h2>
                                    <p className="text-xs text-gray-500 mt-0.5">Create a live endpoint for your JSON data</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowDeployModal(false)}
                                className="p-2 hover:bg-gray-900 rounded-lg transition-colors text-gray-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider ml-1">
                                    User ID
                                </label>
                                <input
                                    type="text"
                                    value={deploymentConfig.userId}
                                    onChange={(e) => setDeploymentConfig({ ...deploymentConfig, userId: e.target.value })}
                                    placeholder="e.g., demo-user"
                                    className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder:text-gray-700"
                                />
                                <p className="text-xs text-gray-600 mt-1.5 ml-1">This identifies your deployment namespace</p>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider ml-1">
                                    Endpoint Name
                                </label>
                                <input
                                    type="text"
                                    value={deploymentConfig.endpointName}
                                    onChange={(e) => setDeploymentConfig({ ...deploymentConfig, endpointName: e.target.value })}
                                    placeholder="e.g., product-data"
                                    className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder:text-gray-700 font-mono"
                                />
                                <p className="text-xs text-gray-600 mt-1.5 ml-1">Use lowercase letters, numbers, and hyphens only</p>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider ml-1">
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={deploymentConfig.description}
                                    onChange={(e) => setDeploymentConfig({ ...deploymentConfig, description: e.target.value })}
                                    placeholder="Describe what this API endpoint contains..."
                                    className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder:text-gray-700 resize-none h-24"
                                />
                            </div>

                            {/* Preview URL */}
                            <div className="p-4 bg-black rounded-xl border border-gray-900">
                                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">Deployment URL Preview</p>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-zinc-950 rounded-lg px-3 py-2 border border-gray-800">
                                        <p className="text-xs font-mono text-cyan-400 break-all">
                                            https://worker.dev/{deploymentConfig.userId}/{deploymentConfig.endpointName || 'endpoint-name'}
                                        </p>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-gray-600" />
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-900 bg-black/50">
                            <button
                                onClick={() => setShowDeployModal(false)}
                                className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeploy}
                                disabled={deploying || !deploymentConfig.endpointName}
                                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-gray-800 disabled:to-gray-800 text-black disabled:text-gray-600 text-sm font-bold rounded-xl transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:shadow-none disabled:cursor-not-allowed"
                            >
                                {deploying ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
                                        Deploying...
                                    </>
                                ) : (
                                    <>
                                        <Rocket className="w-4 h-4" />
                                        Deploy Now
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Deployment Success Message */}
            {deploymentResult && (
                <div className="fixed bottom-8 right-8 z-50 bg-zinc-950 border border-emerald-500/30 rounded-xl shadow-2xl p-5 w-96 animate-in slide-in-from-bottom-8 duration-300">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <Check className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-white mb-1">Deployment Successful!</h3>
                            <p className="text-xs text-gray-400 mb-3">Your API endpoint is now live</p>
                            <div className="flex items-center gap-2 bg-black rounded-lg px-3 py-2 border border-gray-900">
                                <p className="text-xs font-mono text-emerald-400 break-all flex-1">
                                    {deploymentResult.url}
                                </p>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(deploymentResult.url);
                                    }}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <Copy className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={() => setDeploymentResult(null)}
                            className="text-gray-500 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}