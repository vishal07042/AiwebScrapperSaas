import React, { useState, useEffect, useRef } from 'react';
import { Rocket, Download, Copy, Check, Link as LinkIcon, Zap, Plus, Trash2, X, ExternalLink, ChevronDown, GripVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


// JSON Syntax Highlighter Component
function JsonEditor({ value, onChange, readOnly = false }) {
    const [displayValue, setDisplayValue] = useState(value);
    const textareaRef = useRef(null);

    useEffect(() => {
        setDisplayValue(value);
    }, [value]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setDisplayValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    const syntaxHighlight = (json) => {
        if (!json) return '';

        try {
            // Try to parse and format
            const obj = typeof json === 'string' ? JSON.parse(json) : json;
            json = JSON.stringify(obj, null, 2);
        } catch (e) {
            // If parsing fails, use the raw string
            json = typeof json === 'string' ? json : JSON.stringify(json, null, 2);
        }

        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
            let cls = 'text-cyan-400'; // number
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'text-purple-400'; // key
                } else {
                    cls = 'text-emerald-400'; // string
                }
            } else if (/true|false/.test(match)) {
                cls = 'text-orange-400'; // boolean
            } else if (/null/.test(match)) {
                cls = 'text-gray-500'; // null
            }
            return `<span class="${cls}">${match}</span>`;
        });
    };

    return (
        <div className="relative w-full h-full font-mono text-xs">
            {readOnly ? (
                <div
                    className="w-full h-full overflow-auto p-4 bg-black text-left whitespace-pre-wrap break-words"
                    dangerouslySetInnerHTML={{ __html: syntaxHighlight(displayValue) }}
                />
            ) : (
                <>
                    <div
                        className="absolute inset-0 p-4 overflow-auto pointer-events-none whitespace-pre-wrap break-words"
                        dangerouslySetInnerHTML={{ __html: syntaxHighlight(displayValue) }}
                        aria-hidden="true"
                    />
                    <textarea
                        ref={textareaRef}
                        value={displayValue}
                        onChange={handleChange}
                        className="absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-white focus:outline-none resize-none overflow-auto whitespace-pre-wrap break-words selection:bg-emerald-500/30"
                        spellCheck="false"
                        style={{ caretColor: 'white' }}
                    />
                </>
            )}
        </div>
    );
}

export default function InputUrlPage2() {

    const navigate = useNavigate(); // ← REQUIRED
    const [url, setUrl] = useState('');
    const [mode, setMode] = useState('custom'); // smart, custom, product, article
    const [prompt, setPrompt] = useState(`Extract the following fields for each product on the page:
1. Product Name (string)
2. Current Price (number)
3. Original Price (number, null if not available)
4. Rating (float, 0-5)
5. Review Count (integer)
6. Main Image URL (string)
and give me structured data in json format

Ignore sponsored items.`);
    const [fields, setFields] = useState([
        { name: 'title', type: 'string', description: 'Page title', optional: false }
    ]);
    const [options, setOptions] = useState({
        maxChars: 15000,
        waitTime: 2000,
        selector: '',
        fullPage: false
    });
    const [jsRendering, setJsRendering] = useState(true);
    const [proxyRotation, setProxyRotation] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [editableJson, setEditableJson] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Resizable panel state
    const [rightPanelWidth, setRightPanelWidth] = useState(450);
    const [isResizing, setIsResizing] = useState(false);
    const containerRef = useRef(null);

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

    // Resize handlers
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing || !containerRef.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();
            const newWidth = containerRect.right - e.clientX;

            // Min width 300px, max width 800px
            if (newWidth >= 300 && newWidth <= 800) {
                setRightPanelWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isResizing]);

    const startResize = () => {
        setIsResizing(true);
    };

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
        } catch {
            setError('Failed to connect to scraper API. Make sure the backend is running.');
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

    const loadDemoData = () => {
        const demoData = {
            status: "success",
            timestamp: new Date().toISOString(),
            data: {
                products: [
                    {
                        name: "Premium Wireless Headphones",
                        price: 299.99,
                        originalPrice: 399.99,
                        rating: 4.8,
                        reviewCount: 1247,
                        inStock: true,
                        imageUrl: "https://example.com/headphones.jpg",
                        features: ["Noise Cancelling", "40hr Battery", "Bluetooth 5.0"]
                    },
                    {
                        name: "Smart Watch Pro",
                        price: 449.99,
                        originalPrice: null,
                        rating: 4.6,
                        reviewCount: 892,
                        inStock: true,
                        imageUrl: "https://example.com/watch.jpg",
                        features: ["Heart Rate Monitor", "GPS", "Water Resistant"]
                    },
                    {
                        name: "Portable Charger 20000mAh",
                        price: 49.99,
                        originalPrice: 79.99,
                        rating: 4.9,
                        reviewCount: 3421,
                        inStock: false,
                        imageUrl: "https://example.com/charger.jpg",
                        features: ["Fast Charging", "Dual USB-C", "LED Display"]
                    }
                ],
                totalCount: 3,
                scrapedAt: new Date().toISOString()
            }
        };
        setResult(demoData);
        setError('');
    };

    const copyResult = () => {
        if (editableJson) {
            navigator.clipboard.writeText(editableJson);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const formatJson = () => {
        try {
            const parsed = JSON.parse(editableJson);
            setEditableJson(JSON.stringify(parsed, null, 2));
            setResult(parsed);
        } catch {
            setError('Invalid JSON: Cannot format');
        }
    };

    const minifyJson = () => {
        try {
            const parsed = JSON.parse(editableJson);
            setEditableJson(JSON.stringify(parsed));
            setResult(parsed);
        } catch {
            setError('Invalid JSON: Cannot minify');
        }
    };

    const downloadResult = () => {
        if (editableJson) {
            const blob = new Blob([editableJson], { type: 'application/json' });
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = 'scraper-result.json';
            a.click();
            URL.revokeObjectURL(downloadUrl);
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



    return (
        <div className="min-h-screen bg-black text-white">
            {/* Grid Background */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(75,75,75,0.03)_1px,_transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

            <div ref={containerRef} className="relative z-10 flex h-screen overflow-hidden">
                {/* LEFT SIDEBAR */}
                <aside className="w-20 lg:w-60 flex-shrink-0 border-r border-gray-900 bg-zinc-950 flex flex-col justify-between">
                    <div className="flex flex-col">
                        <div className="h-16 flex items-center px-4 lg:px-6 border-b border-gray-900">
                            <span className="material-symbols-outlined text-emerald-400 text-3xl">
                                data_object
                            </span>
                            <span className="hidden lg:block ml-3 font-bold tracking-wider text-lg">
                                ScrapyFire.Ai
                            </span>
                        </div>
                    </div>

                    <div className="p-4 border-t border-gray-900">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                {/* <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-black">
                                    A
                                </div> */}
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-zinc-950" />
                            </div>
                            <div className="hidden lg:flex flex-col">
                                {/* <span className="text-sm font-medium leading-none">Alex Dev</span>
                                <span className="text-xs text-gray-500 mt-1">Pro Plan</span> */}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* CENTER PANEL */}
                <main className="flex-1 flex flex-col min-w-0 bg-black overflow-hidden">
                    <header className="h-16 border-b border-gray-900 flex items-center justify-between px-8 bg-black/80 backdrop-blur-sm flex-shrink-0">
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                                NEW EXTRACTION TASK
                                <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded font-mono">
                                    DRAFT
                                </span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="text-gray-400 hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-xl">history</span>
                            </button>
                            <button className="text-gray-400 hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-xl">help</span>
                            </button>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto p-8">
                        <div className="max-w-3xl mx-auto flex flex-col gap-6">
                            {/* URL Input */}
                            <div className="flex flex-col gap-3">
                                <label className="text-xs font-bold text-gray-500 tracking-widest font-mono">
                                    TARGET_URL
                                </label>
                                <div className="relative group">
                                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                    <input
                                        className="w-full bg-zinc-950 border border-gray-800 rounded-xl h-14 pl-12 pr-4 font-mono text-sm text-emerald-400 placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                                        placeholder="https://example.com/products/category/electronics"
                                        type="text"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Mode Selection */}
                            <div className="flex flex-col gap-3">
                                <label className="text-xs font-bold text-gray-500 tracking-widest font-mono">
                                    EXTRACTION_MODE
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['smart', 'custom', 'product', 'article'].map((m) => (
                                        <button
                                            key={m}
                                            onClick={() => setMode(m)}
                                            className={`px-4 py-3 rounded-xl border text-sm font-mono transition-all ${mode === m
                                                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                                                : 'bg-zinc-950 border-gray-800 text-gray-400 hover:border-gray-700'
                                                }`}
                                        >
                                            {m.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Smart Mode - Fields */}
                            {mode === 'smart' && (
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-gray-500 tracking-widest font-mono">
                                            FIELDS_TO_EXTRACT
                                        </label>
                                        <button
                                            onClick={addField}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-xs font-bold text-black transition-all"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            ADD FIELD
                                        </button>
                                    </div>
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {fields.map((field, index) => (
                                            <div key={index} className="bg-zinc-950 rounded-xl p-4 border border-gray-900">
                                                <div className="grid grid-cols-3 gap-3 mb-3">
                                                    <input
                                                        type="text"
                                                        value={field.name}
                                                        onChange={(e) => updateField(index, 'name', e.target.value)}
                                                        placeholder="Field name"
                                                        className="col-span-2 bg-black border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                                                    />
                                                    <select
                                                        value={field.type}
                                                        onChange={(e) => updateField(index, 'type', e.target.value)}
                                                        className="bg-black border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
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
                                                    placeholder="Description (e.g., The main title of the page)"
                                                    className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50 mb-3"
                                                />
                                                <div className="flex items-center justify-between">
                                                    <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={field.optional}
                                                            onChange={(e) => updateField(index, 'optional', e.target.checked)}
                                                            className="w-4 h-4 rounded border-gray-700 bg-black text-emerald-500 focus:ring-emerald-500/20"
                                                        />
                                                        Optional field
                                                    </label>
                                                    <button
                                                        onClick={() => removeField(index)}
                                                        className="text-gray-600 hover:text-red-400 transition-colors p-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Custom Mode - Prompt */}
                            {mode === 'custom' && (
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between items-end">
                                        <label className="text-xs font-bold text-gray-500 tracking-widest font-mono">
                                            AI_INSTRUCTION
                                        </label>
                                        <div className="flex gap-2">
                                            <button onClick={() => loadPreset('leetcode')} className="px-3 py-1 text-xs font-mono text-gray-400 hover:text-emerald-400 transition-colors">LeetCode</button>
                                            <button onClick={() => loadPreset('github')} className="px-3 py-1 text-xs font-mono text-gray-400 hover:text-emerald-400 transition-colors">GitHub</button>
                                            <button onClick={() => loadPreset('product')} className="px-3 py-1 text-xs font-mono text-gray-400 hover:text-emerald-400 transition-colors">Product</button>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <textarea
                                            className="w-full bg-zinc-950 border border-gray-800 rounded-xl min-h-[200px] p-4 font-mono text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all resize-y"
                                            placeholder="Describe the data structure you need (e.g., 'Extract all product prices, names, and image URLs. format the price as a number')..."
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                        />
                                        <div className="absolute bottom-3 right-3 text-xs text-gray-600 font-mono">
                                            {prompt.length} chars
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Product/Article Mode Info */}
                            {(mode === 'product' || mode === 'article') && (
                                <div className="bg-zinc-950 border border-gray-800 rounded-xl p-5">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                            <span className="material-symbols-outlined text-emerald-400 text-2xl">
                                                {mode === 'product' ? 'shopping_bag' : 'article'}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white mb-1">
                                                {mode === 'product' ? 'Product Extraction Mode' : 'Article Extraction Mode'}
                                            </h3>
                                            <p className="text-xs text-gray-400 leading-relaxed">
                                                {mode === 'product'
                                                    ? 'Automatically detects product details like name, price, rating, availability, and images. Optimized for e-commerce sites.'
                                                    : 'Extracts main content, title, author, publish date, and generates a summary. Optimized for news, blogs, and articles.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Advanced Options */}
                            <div className="bg-zinc-950 border border-gray-800 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    className="w-full p-4 flex items-center justify-between hover:bg-zinc-900 transition-colors"
                                >
                                    <span className="text-xs font-bold text-gray-500 tracking-widest font-mono">
                                        ADVANCED_OPTIONS
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                                </button>
                                {showAdvanced && (
                                    <div className="p-4 pt-0 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-mono text-gray-500 mb-2">MAX_CHARS</label>
                                                <input
                                                    type="number"
                                                    value={options.maxChars}
                                                    onChange={(e) => setOptions({ ...options, maxChars: e.target.value })}
                                                    className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-mono text-gray-500 mb-2">WAIT_TIME (ms)</label>
                                                <input
                                                    type="number"
                                                    value={options.waitTime}
                                                    onChange={(e) => setOptions({ ...options, waitTime: e.target.value })}
                                                    className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-mono text-gray-500 mb-2">CSS_SELECTOR</label>
                                            <input
                                                type="text"
                                                value={options.selector}
                                                onChange={(e) => setOptions({ ...options, selector: e.target.value })}
                                                placeholder="e.g., main, #content"
                                                className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-sm"
                                            />
                                        </div>
                                        <label className="flex items-center gap-3 text-sm text-gray-400 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={options.fullPage}
                                                onChange={(e) => setOptions({ ...options, fullPage: e.target.checked })}
                                                className="w-5 h-5 rounded border-gray-800 bg-black text-emerald-500 focus:ring-emerald-500/20"
                                            />
                                            Send full page content (slower but more complete)
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Configuration Toggles */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-zinc-950 border border-gray-800 rounded-xl p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-gray-500 text-lg">
                                            javascript
                                        </span>
                                        <span className="text-sm text-gray-300 font-mono">
                                            JS Rendering
                                        </span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            checked={jsRendering}
                                            onChange={(e) => setJsRendering(e.target.checked)}
                                            className="sr-only peer"
                                            type="checkbox"
                                        />
                                        <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
                                    </label>
                                </div>
                                <div className="bg-zinc-950 border border-gray-800 rounded-xl p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-gray-500 text-lg">
                                            public
                                        </span>
                                        <span className="text-sm text-gray-300 font-mono">
                                            Proxy Rotation
                                        </span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            checked={proxyRotation}
                                            onChange={(e) => setProxyRotation(e.target.checked)}
                                            className="sr-only peer"
                                            type="checkbox"
                                        />
                                        <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
                                    </label>
                                </div>
                            </div>

                            {/* Error Display */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">
                                    {error}
                                </div>
                            )}

                            {/* Main Action */}
                            <div className="pt-4 flex flex-col items-center gap-4">
                                <button
                                    onClick={handleScrape}
                                    disabled={loading}
                                    className="group relative w-full h-14 flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:from-gray-800 disabled:to-gray-800 text-black disabled:text-gray-600 font-bold tracking-wider rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.3)] disabled:shadow-none transition-all active:scale-[0.99] overflow-hidden disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
                                            PROCESSING...
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-5 h-5 fill-black" />
                                            INITIALIZE RUN
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={loadDemoData}
                                    className="text-xs text-gray-500 hover:text-emerald-400 transition-colors font-mono underline decoration-dotted"
                                >
                                    Load Demo Data (for testing)
                                </button>
                                <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    Backend: {loading ? 'Processing' : 'Ready'}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* RIGHT PANEL (Output / Results) */}
                <aside
                    className="border-l border-gray-900 bg-zinc-950 flex flex-col shadow-2xl shadow-black relative"
                    style={{ width: `${rightPanelWidth}px` }}
                >
                    {/* Resize Handle */}
                    <div
                        className="absolute left-0 top-0 bottom-0 w-1 hover:w-2 bg-transparent hover:bg-emerald-500/50 cursor-col-resize transition-all group z-50"
                        onMouseDown={startResize}
                    >
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical className="w-4 h-4 text-emerald-400" />
                        </div>
                    </div>

                    <div className="h-16 flex items-end px-4 border-b border-gray-900 bg-black">
                        <button className="px-4 py-3 text-sm font-medium text-white border-b-2 border-emerald-400 hover:text-emerald-400 transition-colors flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">code</span>
                            JSON Preview
                        </button>
                    </div>

                    <div className="h-10 border-b border-gray-900 bg-zinc-950 flex items-center justify-between px-3">
                        <div className="flex items-center gap-2">
                            {result && (
                                <>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-900/30 text-emerald-400 border border-emerald-900">
                                        200 OK
                                    </span>
                                    <span className="text-[10px] font-mono text-gray-500">Success</span>
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={formatJson}
                                disabled={!result}
                                className="px-2 py-1 text-[10px] font-mono hover:bg-white/10 rounded text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Format
                            </button>
                            <button
                                onClick={minifyJson}
                                disabled={!result}
                                className="px-2 py-1 text-[10px] font-mono hover:bg-white/10 rounded text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Compact
                            </button>
                            <div className="w-px h-4 bg-gray-800 mx-1"></div>
                            <button
                                onClick={copyResult}
                                disabled={!result}
                                className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Copy JSON"
                            >
                                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={downloadResult}
                                disabled={!result}
                                className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Download"
                            >
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden bg-black">
                        {result ? (
                            <JsonEditor
                                value={editableJson}
                                onChange={(newValue) => {
                                    setEditableJson(newValue);
                                    try {
                                        const parsed = JSON.parse(newValue);
                                        setResult(parsed);
                                        setError('');
                                    } catch (e) {
                                        // Invalid JSON while typing, don't update result
                                    }
                                }}
                            />
                        ) : (
                            <div className="h-full text-gray-600">
                                {loading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent"></div>
                                            <p className="text-sm">Scraping in progress...</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 font-mono text-xs leading-relaxed opacity-30">
                                        <div className="text-gray-700">
                                            <span className="text-gray-600">{'{'}</span><br />
                                            &nbsp;&nbsp;<span className="text-purple-700">"status"</span>: <span className="text-emerald-700">"success"</span>,<br />
                                            &nbsp;&nbsp;<span className="text-purple-700">"data"</span>: <span className="text-gray-600">{'{'}</span><br />
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-700">"title"</span>: <span className="text-emerald-700">"..."</span>,<br />
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-700">"description"</span>: <span className="text-emerald-700">"..."</span>,<br />
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-700">"items"</span>: <span className="text-gray-600">[</span><br />
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-gray-600">{'{'}</span><br />
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-700">"name"</span>: <span className="text-emerald-700">"..."</span>,<br />
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-700">"value"</span>: <span className="text-cyan-700">0</span><br />
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-gray-600">{'}'}</span><br />
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-gray-600">]</span><br />
                                            &nbsp;&nbsp;<span className="text-gray-600">{'}'}</span><br />
                                            <span className="text-gray-600">{'}'}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-gray-900 bg-black flex flex-col gap-3">
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    const autoName = url.split('/')[2]?.replace(/\./g, '-') || 'my-endpoint';
                                    navigate('/deploy', {
                                        state: {
                                            url,
                                            mode,
                                            prompt,
                                            fields,
                                            result,
                                            endpointName: autoName,
                                            description: `Data from ${url}`
                                        }
                                    });
                                }}
                                disabled={!result}
                                className="flex-1 h-10 bg-zinc-950 border border-gray-800 hover:border-emerald-500/50 disabled:hover:border-gray-800 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Rocket className="w-4 h-4 group-hover:text-emerald-400" />
                                Deploy API
                            </button>
                            <button
                                onClick={downloadResult}
                                disabled={!result}
                                className="flex-1 h-10 bg-zinc-950 border border-gray-800 hover:border-cyan-500/50 disabled:hover:border-gray-800 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download className="w-4 h-4 group-hover:text-cyan-400" />
                                CSV Export
                            </button>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Deployment Modal */}
            {showDeployModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-zinc-950 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-lg">
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
                <div className="fixed bottom-8 right-8 z-50 bg-zinc-950 border border-emerald-500/30 rounded-xl shadow-2xl p-5 w-96">
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