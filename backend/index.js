import "dotenv/config";
import express from "express";
import { chromium } from "playwright";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import cors from "cors";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;



// Middleware
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(process.cwd(), "dist")));

// Health check endpoint
// app.get("/", (req, res) => {
// 	res.json({ message: "AI Web Scraper API is running!" });
// });

app.get("*", (req, res) => {
    res.sendFile(path.join(process.cwd(), "dist", "index.html"));
});

// Smart Generic scraping endpoint - No predefined schema needed!
app.post("/api/scrape/smart", async (req, res) => {
	let browser;
	let page;

	try {
		const { url, fields, options = {} } = req.body;

		// Default options
		const {
			maxChars = 15000, // How much text to send to AI
			waitTime = 2000, // Wait for dynamic content (ms)
			selector = null, // Target specific element (e.g., 'main', '.content')
			fullPage = false, // Send entire page (expensive!)
		} = options;

		// Validation
		if (!url || !fields) {
			return res.status(400).json({
				error: "Missing required fields: url and fields are required",
				example: {
					url: "https://leetcode.com/username",
					fields: [
						{
							name: "problemsSolved",
							type: "number",
							description: "Total problems solved",
						},
						{
							name: "ranking",
							type: "number",
							description: "User ranking",
						},
						{
							name: "acceptanceRate",
							type: "number",
							description: "Acceptance rate percentage",
						},
					],
				},
			});
		}

		// Launch browser
		browser = await chromium.launch({ headless: true });
		page = await browser.newPage();

		await page.setExtraHTTPHeaders({
			"User-Agent":
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
		});

		await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

		// Wait for dynamic content
		await page.waitForTimeout(waitTime);

		// Extract text based on options
		let textContent;
		if (selector) {
			// Extract from specific element
			textContent = await page.evaluate((sel) => {
				const element = document.querySelector(sel);
				return element ? element.innerText : document.body.innerText;
			}, selector);
		} else {
			// Extract from entire page
			textContent = await page.evaluate(() => document.body.innerText);
		}

		// Limit content unless fullPage is true
		const contentToSend = fullPage
			? textContent
			: textContent.slice(0, maxChars);

		// Log what we're sending
		console.log(
			`📊 Sending ${contentToSend.length} characters to AI (total: ${textContent.length})`
		);
		if (!fullPage && textContent.length > maxChars) {
			console.log(
				`⚠️  Content truncated! Original: ${textContent.length} chars`
			);
		}

		// Build dynamic schema from user's field definitions
		const schemaFields = {};
		let hasValidFields = false;

		fields.forEach((field) => {
			if (!field.name || !field.type) return; // Skip invalid fields

			let zodType;
			switch (field.type) {
				case "number":
					zodType = "z.number()";
					break;
				case "boolean":
					zodType = "z.boolean()";
					break;
				case "array":
					zodType = "z.array(z.string())";
					break;
				default:
					zodType = "z.string()";
			}

			const optional = field.optional ? ".optional()" : "";
			const description = field.description
				? `.describe("${field.description.replace(/"/g, '\\"')}")`
				: "";

			schemaFields[field.name] = `${zodType}${optional}${description}`;
			hasValidFields = true;
		});

		if (!hasValidFields) {
			return res.status(400).json({
				error: "No valid fields provided. Please add at least one field.",
			});
		}

		// Create dynamic schema
		const schemaCode = `z.object({ ${Object.entries(schemaFields)
			.map(([key, value]) => `${key}: ${value}`)
			.join(", ")} })`;

		let schema;
		try {
			schema = eval(schemaCode);
		} catch (error) {
			console.error("Schema creation error:", error);
			return res.status(400).json({
				error: "Failed to create schema. Please check your field definitions.",
			});
		}

		// Build dynamic prompt from field descriptions
		const fieldDescriptions = fields
			.map((f) => `- ${f.name}: ${f.description || f.name} (${f.type})`)
			.join("\n");

		console.log("🔍 Schema:", schemaCode);
		console.log("📊 Sending ${contentToSend.length} characters to AI");

		const { object } = await generateObject({
			model: google("gemini-2.5-flash"),
			schema: schema,
			prompt: `Extract the following information from this page:

${fieldDescriptions}

Be precise and extract exactly what's requested. If a field is not found, return null for optional fields.

Page content:
${contentToSend}`,
		});

		await page.close();
		await browser.close();

		res.json({
			success: true,
			url: url,
			data: object,
		});
	} catch (error) {
		console.error("Smart scraping error:", error);

		if (page) await page.close().catch(() => {});
		if (browser) await browser.close().catch(() => {});

		// Provide helpful error messages
		let errorMessage = error.message;

		if (error.message.includes("should be non-empty for OBJECT type")) {
			errorMessage =
				"Schema validation error. Make sure all fields have valid names and types.";
		} else if (error.message.includes("timeout")) {
			errorMessage =
				"Page took too long to load. Try increasing waitTime in options.";
		} else if (error.message.includes("net::ERR")) {
			errorMessage =
				"Failed to load the URL. Check if the website is accessible.";
		}

		res.status(500).json({
			success: false,
			error: errorMessage,
		});
	}
});

// Generic scraping endpoint
app.post("/api/scrape", async (req, res) => {
	let browser;
	let page;

	try {
		const { url, prompt, schemaDefinition } = req.body;

		// Validation
		if (!url || !prompt) {
			return res.status(400).json({
				error: "Missing required fields: url and prompt are required",
			});
		}

		// Launch browser
		browser = await chromium.launch({ headless: true });
		page = await browser.newPage();

		// Set user agent to avoid bot detection
		await page.setExtraHTTPHeaders({
			"User-Agent":
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
		});

		// Navigate to URL
		await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

		// Get page content
		const html = await page.content();
		const textContent = await page.evaluate(() => document.body.innerText);

		// Define a flexible schema if none provided
		const defaultSchema = z.object({
			extractedText: z
				.string()
				.describe("Main content extracted from the page"),
		});

		// Parse custom schema if provided
		let schema = defaultSchema;
		if (schemaDefinition) {
			try {
				schema = eval(`(${schemaDefinition})`);
			} catch (e) {
				console.warn("Invalid schema provided, using default");
			}
		}

		// Use AI to extract data
		const { object } = await generateObject({
			model: google("gemini-2.5-flash"),
			schema: schema,
			prompt: `${prompt}\n\nPage content:\n${textContent.slice(
				0,
				15000
			)}`,
		});

		// Close browser
		await page.close();
		await browser.close();

		// Return results
		res.json({
			success: true,
			url: url,
			data: object,
		});
	} catch (error) {
		console.error("Scraping error:", error);

		// Clean up browser if still open
		if (page) await page.close().catch(() => {});
		if (browser) await browser.close().catch(() => {});

		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
});

// Hacker News specific endpoint
app.get("/api/scrape/hackernews", async (req, res) => {
	let browser;
	let page;

	try {
		browser = await chromium.launch({ headless: true });
		page = await browser.newPage();

		await page.goto("https://news.ycombinator.com", {
			waitUntil: "networkidle",
		});

		const textContent = await page.evaluate(() => document.body.innerText);

		const schema = z.object({
			top: z
				.array(
					z.object({
						title: z.string(),
						points: z.number(),
						by: z.string(),
						commentsURL: z.string(),
					})
				)
				.length(10)
				.describe("Top 10 stories on Hacker News"),
		});

		const { object } = await generateObject({
			model: google("gemini-2.5-flash"),
			schema: schema,
			prompt: `Extract the top 10 stories from Hacker News. For each story extract:
      - title: the story title
      - points: number of points (upvotes)
      - by: username of person who posted
      - commentsURL: the URL to the comments (construct full URL with https://news.ycombinator.com)
      
      Page content:
      ${textContent}`,
		});

		await page.close();
		await browser.close();

		res.json({
			success: true,
			data: object.top,
		});
	} catch (error) {
		console.error("Error scraping Hacker News:", error);

		if (page) await page.close().catch(() => {});
		if (browser) await browser.close().catch(() => {});

		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
});

// Product scraping endpoint (e.g., e-commerce sites)
app.post("/api/scrape/products", async (req, res) => {
	let browser;
	let page;

	try {
		const { url } = req.body;

		if (!url) {
			return res.status(400).json({ error: "URL is required" });
		}

		browser = await chromium.launch({ headless: true });
		page = await browser.newPage();

		await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
		const textContent = await page.evaluate(() => document.body.innerText);

		const schema = z.object({
			products: z
				.array(
					z.object({
						name: z.string(),
						price: z.string(),
						rating: z.string().optional(),
						url: z.string().optional(),
						inStock: z.boolean().optional(),
					})
				)
				.describe("List of products found on the page"),
		});

		const { object } = await generateObject({
			model: google("gemini-2.5-flash"),
			schema: schema,
			prompt: `Extract all products from this page. For each product, extract:
      - name: product name
      - price: product price (with currency symbol)
      - rating: product rating if available
      - url: product URL if available
      - inStock: whether product is in stock (true/false)
      
      Page content:
      ${textContent.slice(0, 15000)}`,
		});

		await page.close();
		await browser.close();

		res.json({
			success: true,
			data: object.products,
		});
	} catch (error) {
		console.error("Error scraping products:", error);

		if (page) await page.close().catch(() => {});
		if (browser) await browser.close().catch(() => {});

		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
});

// Article/Blog scraping endpoint
app.post("/api/scrape/article", async (req, res) => {
	let browser;
	let page;

	try {
		const { url } = req.body;

		if (!url) {
			return res.status(400).json({ error: "URL is required" });
		}

		browser = await chromium.launch({ headless: true });
		page = await browser.newPage();

		await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
		const textContent = await page.evaluate(() => document.body.innerText);

		const schema = z.object({
			title: z.string(),
			author: z.string().optional(),
			publishDate: z.string().optional(),
			content: z.string(),
			summary: z.string().describe("A brief summary of the article"),
			tags: z.array(z.string()).optional(),
		});

		const { object } = await generateObject({
			model: google("gemini-2.5-flash"),
			schema: schema,
			prompt: `Extract article information from this page:
      - title: article title
      - author: article author if available
      - publishDate: publication date if available
      - content: the main article content
      - summary: create a brief 2-3 sentence summary
      - tags: relevant topic tags for the article
      
      Page content:
      ${textContent.slice(0, 15000)}`,
		});

		await page.close();
		await browser.close();

		res.json({
			success: true,
			data: object,
		});
	} catch (error) {
		console.error("Error scraping article:", error);

		if (page) await page.close().catch(() => {});
		if (browser) await browser.close().catch(() => {});

		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
});

// Cloudflare Deploy Endpoint
app.post("/api/deploy", async (req, res) => {
	try {
		const { userId, endpointName, data, description } = req.body;

		if (!userId || !endpointName || !data) {
			return res.status(400).json({
				error: "Missing required fields: userId, endpointName, data",
			});
		}

		// Configuration from env
		const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
		const apiToken = process.env.CLOUDFLARE_API_TOKEN;
		const namespaceId = process.env.CLOUDFLARE_KV_NAMESPACE_ID;
		const workerUrl = process.env.CLOUDFLARE_WORKER_URL;

		// Check if configuration is present
		if (!accountId || !apiToken || !namespaceId) {
			console.error("Missing Cloudflare configuration");
			return res.status(500).json({
				error: "Server misconfiguration: Missing Cloudflare credentials",
				details:
					"Please check CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, and CLOUDFLARE_KV_NAMESPACE_ID in .env",
			});
		}

		const key = `${userId}:${endpointName}`;
		const value = JSON.stringify({
			data,
			description,
			deployedAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		});

		// Write to KV via Cloudflare API
		console.log(`Deploying to Cloudflare KV: ${key}`);
		const response = await fetch(
			`https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${key}`,
			{
				method: "PUT",
				headers: {
					Authorization: `Bearer ${apiToken}`,
					"Content-Type": "text/plain",
				},
				body: value,
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error("Cloudflare API Error:", errorText);

			let errorMsg = `Cloudflare API failed: ${response.status} ${response.statusText}`;
			try {
				const errorJson = JSON.parse(errorText);
				if (errorJson.errors && errorJson.errors.length > 0) {
					errorMsg += ` - ${errorJson.errors[0].message}`;
				}
			} catch (e) {
				errorMsg += ` - ${errorText.substring(0, 100)}`;
			}

			throw new Error(errorMsg);
		}

		// Construct the live URL
		// Ensure workerUrl doesn't have a trailing slash for consistency
		const baseUrl =
			(workerUrl || "").replace(/\/$/, "") ||
			"https://your-worker.workers.dev";
		const deploymentUrl = `${baseUrl}/${userId}/${endpointName}`;

		res.json({
			success: true,
			deployment: {
				url: deploymentUrl,
				cloudflareStatus: "live",
				key: key,
			},
		});
	} catch (error) {
		console.error("Deployment error:", error);
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
});

// app.post('/api/scrape/leetcode', async (req, res) => {
//   let browser;
//   let page;

//   try {
//     const { username } = req.body;

//     if (!username) {
//       return res.status(400).json({ error: 'Username is required' });
//     }

//     const url = `https://leetcode.com/${username}/`;

//     browser = await chromium.launch({ headless: true });
//     page = await browser.newPage();

//     await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

//     // Wait for dynamic content to load
//     await page.waitForTimeout(3000);

//     const textContent = await page.evaluate(() =>
//   console.log(`🚀 AI Web Scraper API running on http://localhost:${PORT}`);
//   console.log(`\nAvailable endpoints:`);
//   console.log(`  GET  /                          - Health check`);
//   console.log(`  POST /api/scrape/smart          - Smart scraping (define your own fields!)`);
//   console.log(`  POST /api/scrape                - Generic scraping`);
//   console.log(`  GET  /api/scrape/hackernews     - Scrape Hacker News`);
//   console.log(`  POST /api/scrape/products       - Scrape product listings`);
//   console.log(`  POST /api/scrape/article        - Scrape article content`);
// });

// Start server
app.listen(PORT, () => {
	console.log(`🚀 AI Web Scraper API running on http://localhost:${PORT}`);
	console.log(`\nAvailable endpoints:`);
	console.log(`  GET  /                          - Health check`);
	console.log(`  POST /api/scrape                - Generic scraping`);
	console.log(`  GET  /api/scrape/hackernews     - Scrape Hacker News`);
	console.log(`  POST /api/scrape/products       - Scrape product listings`);
	console.log(`  POST /api/scrape/article        - Scrape article content`);
	console.log(
		`  POST /api/deploy                - Deploy data to Cloudflare KV`
	);
});
