import 'dotenv/config';
import express from 'express';
import { chromium } from 'playwright';
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'AI Web Scraper API is running!' });
});

// Smart Generic scraping endpoint - No predefined schema needed!
app.post('/api/scrape/smart', async (req, res) => {
  let browser;
  let page;
  
  try {
    const { url, fields, options = {} } = req.body;
    
    // Default options
    const {
      maxChars = 15000,        // How much text to send to AI
      waitTime = 2000,         // Wait for dynamic content (ms)
      selector = null,         // Target specific element (e.g., 'main', '.content')
      fullPage = false         // Send entire page (expensive!)
    } = options;

    // Validation
    if (!url || !fields) {
      return res.status(400).json({ 
        error: 'Missing required fields: url and fields are required',
        example: {
          url: 'https://leetcode.com/username',
          fields: [
            { name: 'problemsSolved', type: 'number', description: 'Total problems solved' },
            { name: 'ranking', type: 'number', description: 'User ranking' },
            { name: 'acceptanceRate', type: 'number', description: 'Acceptance rate percentage' }
          ]
        }
      });
    }

    // Launch browser
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage();
    
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    });

    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    
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
    const contentToSend = fullPage ? textContent : textContent.slice(0, maxChars);
    
    // Log what we're sending
    console.log(`📊 Sending ${contentToSend.length} characters to AI (total: ${textContent.length})`);
    if (!fullPage && textContent.length > maxChars) {
      console.log(`⚠️  Content truncated! Original: ${textContent.length} chars`);
    }

    // Build dynamic schema from user's field definitions
    const schemaFields = {};
    fields.forEach(field => {
      const zodType = field.type === 'number' ? 'z.number()' : 
                     field.type === 'boolean' ? 'z.boolean()' :
                     field.type === 'array' ? 'z.array(z.string())' :
                     'z.string()';
      
      const optional = field.optional ? '.optional()' : '';
      const description = field.description ? `.describe("${field.description}")` : '';
      
      schemaFields[field.name] = `${zodType}${optional}${description}`;
    });

    // Create dynamic schema
    const schemaCode = `z.object({ ${Object.entries(schemaFields).map(([key, value]) => `${key}: ${value}`).join(', ')} })`;
    const schema = eval(schemaCode);

    // Build dynamic prompt from field descriptions
    const fieldDescriptions = fields.map(f => 
      `- ${f.name}: ${f.description || f.name} (${f.type})`
    ).join('\n');

    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
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
      data: object
    });

  } catch (error) {
    console.error('Smart scraping error:', error);
    
    if (page) await page.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Generic scraping endpoint
app.post('/api/scrape', async (req, res) => {
  let browser;
  let page;
  
  try {
    const { url, prompt, schemaDefinition } = req.body;

    // Validation
    if (!url || !prompt) {
      return res.status(400).json({ 
        error: 'Missing required fields: url and prompt are required' 
      });
    }

    // Launch browser
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage();
    
    // Set user agent to avoid bot detection
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    });

    // Navigate to URL
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    // Get page content
    const html = await page.content();
    const textContent = await page.evaluate(() => document.body.innerText);

    // Define a flexible schema if none provided
    const defaultSchema = z.object({
      data: z.array(z.record(z.any())).describe('Extracted data from the page')
    });

    // Parse custom schema if provided
    let schema = defaultSchema;
    if (schemaDefinition) {
      try {
        schema = eval(`(${schemaDefinition})`);
      } catch (e) {
        console.warn('Invalid schema provided, using default');
      }
    }

    // Use AI to extract data
    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: schema,
      prompt: `${prompt}\n\nPage content:\n${textContent.slice(0, 15000)}`,
    });

    // Close browser
    await page.close();
    await browser.close();

    // Return results
    res.json({
      success: true,
      url: url,
      data: object
    });

  } catch (error) {
    console.error('Scraping error:', error);
    
    // Clean up browser if still open
    if (page) await page.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Hacker News specific endpoint
app.get('/api/scrape/hackernews', async (req, res) => {
  let browser;
  let page;

  try {
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage();
    
    await page.goto('https://news.ycombinator.com', { 
      waitUntil: 'networkidle' 
    });

    const textContent = await page.evaluate(() => document.body.innerText);

    const schema = z.object({
      top: z.array(
        z.object({
          title: z.string(),
          points: z.number(),
          by: z.string(),
          commentsURL: z.string(),
        })
      )
      .length(10)
      .describe('Top 10 stories on Hacker News'),
    });

    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
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
      data: object.top
    });

  } catch (error) {
    console.error('Error scraping Hacker News:', error);
    
    if (page) await page.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Product scraping endpoint (e.g., e-commerce sites)
app.post('/api/scrape/products', async (req, res) => {
  let browser;
  let page;

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    browser = await chromium.launch({ headless: true });
    page = await browser.newPage();
    
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    const textContent = await page.evaluate(() => document.body.innerText);

    const schema = z.object({
      products: z.array(
        z.object({
          name: z.string(),
          price: z.string(),
          rating: z.string().optional(),
          url: z.string().optional(),
          inStock: z.boolean().optional(),
        })
      ).describe('List of products found on the page'),
    });

    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
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
      data: object.products
    });

  } catch (error) {
    console.error('Error scraping products:', error);
    
    if (page) await page.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Article/Blog scraping endpoint
app.post('/api/scrape/article', async (req, res) => {
  let browser;
  let page;

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    browser = await chromium.launch({ headless: true });
    page = await browser.newPage();
    
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    const textContent = await page.evaluate(() => document.body.innerText);

    const schema = z.object({
      title: z.string(),
      author: z.string().optional(),
      publishDate: z.string().optional(),
      content: z.string(),
      summary: z.string().describe('A brief summary of the article'),
      tags: z.array(z.string()).optional(),
    });

    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
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
      data: object
    });

  } catch (error) {
    console.error('Error scraping article:', error);
    
    if (page) await page.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// LeetCode profile scraping endpoint
app.post('/api/scrape/leetcode', async (req, res) => {
  let browser;
  let page;

  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const url = `https://leetcode.com/${username}/`;

    browser = await chromium.launch({ headless: true });
    page = await browser.newPage();
    
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait for dynamic content to load
    await page.waitForTimeout(3000);
    
    const textContent = await page.evaluate(() =>
  console.log(`🚀 AI Web Scraper API running on http://localhost:${PORT}`);
    console.log(`\nAvailable endpoints:`);
    console.log(`  GET  /                          - Health check`);
    console.log(`  POST /api/scrape/smart          - Smart scraping (define your own fields!)`);
    console.log(`  POST /api/scrape                - Generic scraping`);
    console.log(`  GET  /api/scrape/hackernews     - Scrape Hacker News`);
    console.log(`  POST /api/scrape/products       - Scrape product listings`);
    console.log(`  POST /api/scrape/article        - Scrape article content`);
    console.log(`🚀 AI Web Scraper API running on http://localhost:${PORT}`);
}catch(err){
  console.error('Error starting server:', err);
  process.exit(1);
}
});