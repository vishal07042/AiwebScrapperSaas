#!/usr/bin/env node

/**
 * Cloudflare Worker Deployment Script
 * 
 * This script helps you deploy the worker and set up KV storage
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

function exec(command, showOutput = true) {
    try {
        const result = execSync(command, { 
            encoding: 'utf-8',
            stdio: showOutput ? 'inherit' : 'pipe'
        });
        return result;
    } catch (error) {
        console.error(`❌ Error executing: ${command}`);
        console.error(error.message);
        process.exit(1);
    }
}

async function main() {
    console.log('\n🚀 Cloudflare Worker Deployment Setup\n');
    console.log('This script will help you deploy your scraper API to Cloudflare Workers.\n');

    // Check if wrangler is installed
    try {
        execSync('wrangler --version', { stdio: 'ignore' });
    } catch {
        console.log('❌ Wrangler CLI is not installed.');
        console.log('📦 Installing Wrangler...\n');
        exec('npm install -g wrangler');
    }

    console.log('✅ Wrangler CLI is installed\n');

    // Login to Cloudflare
    const isLoggedIn = await question('Are you logged in to Cloudflare? (y/n): ');
    if (isLoggedIn.toLowerCase() !== 'y') {
        console.log('\n🔐 Logging in to Cloudflare...\n');
        exec('wrangler login');
    }

    // Create KV namespace
    console.log('\n📦 Creating KV namespace...\n');
    const kvOutput = exec('wrangler kv:namespace create "SCRAPER_DATA"', false);
    
    // Extract namespace ID from output
    const kvIdMatch = kvOutput.match(/id = "([a-f0-9]+)"/);
    if (!kvIdMatch) {
        console.error('❌ Failed to extract KV namespace ID');
        process.exit(1);
    }
    
    const kvNamespaceId = kvIdMatch[1];
    console.log(`✅ KV namespace created with ID: ${kvNamespaceId}\n`);

    // Update wrangler.toml
    const wranglerPath = path.join(__dirname, 'wrangler.toml');
    let wranglerConfig = fs.readFileSync(wranglerPath, 'utf-8');
    wranglerConfig = wranglerConfig.replace('YOUR_KV_NAMESPACE_ID', kvNamespaceId);
    fs.writeFileSync(wranglerPath, wranglerConfig);
    console.log('✅ Updated wrangler.toml with KV namespace ID\n');

    // Deploy worker
    console.log('🚀 Deploying worker to Cloudflare...\n');
    exec('wrangler deploy cloudflare-worker.js');

    console.log('\n✅ Deployment complete!\n');

    // Get worker URL
    const workerName = 'scraper-api-worker'; // from wrangler.toml
    console.log('📝 Your worker is now deployed!\n');
    console.log('🔗 Worker URL: https://scraper-api-worker.YOUR-SUBDOMAIN.workers.dev\n');
    console.log('📋 Next steps:');
    console.log('   1. Copy your worker URL from the deployment output above');
    console.log('   2. Add it to backend/.env as CLOUDFLARE_WORKER_URL');
    console.log('   3. Update the backend code to use Cloudflare KV (see DEPLOYMENT_GUIDE.md)');
    console.log('   4. Test your deployment!\n');

    rl.close();
}

main().catch(error => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
});
