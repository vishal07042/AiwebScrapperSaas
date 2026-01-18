// Cloudflare Worker Template
// This will be deployed to handle JSON API endpoints

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Enable CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Parse the path: /:userId/:endpointName
    const pathParts = path.split('/').filter(p => p);
    
    if (pathParts.length < 2) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid path. Use /:userId/:endpointName',
          example: '/user123/my-scraper-data' 
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    const [userId, endpointName] = pathParts;

    // Create KV key
    const kvKey = `${userId}:${endpointName}`;

    try {
      // Retrieve data from KV storage
      const data = await env.SCRAPER_DATA.get(kvKey);

      if (!data) {
        return new Response(
          JSON.stringify({ 
            error: 'Endpoint not found',
            userId,
            endpointName,
            suggestion: 'Make sure you have deployed your data first'
          }),
          { status: 404, headers: corsHeaders }
        );
      }

      // Parse and return the stored JSON
      const jsonData = JSON.parse(data);

      // Add metadata
      const response = {
        success: true,
        userId,
        endpointName,
        data: jsonData.data,
        deployedAt: jsonData.deployedAt,
        updatedAt: jsonData.updatedAt || jsonData.deployedAt,
      };

      return new Response(
        JSON.stringify(response, null, 2),
        { 
          status: 200, 
          headers: {
            ...corsHeaders,
            'Cache-Control': 'public, max-age=60', // Cache for 1 minute
          }
        }
      );

    } catch (error) {
      return new Response(
        JSON.stringify({ 
          error: 'Internal server error',
          message: error.message 
        }),
        { status: 500, headers: corsHeaders }
      );
    }
  },
};
