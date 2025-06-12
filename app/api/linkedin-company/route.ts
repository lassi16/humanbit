import { NextResponse } from "next/server";
import axios from "axios";

export const dynamic = 'force-dynamic';

interface CompanySuggestion {
  urn: string;
  title: string;
}

type ApiResponse = {
  success: boolean;
  status: number;
  data: CompanySuggestion[];
};

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '41d0e79092msh51eeddd46fabf94p16abf3jsn29f628ce21ff';
const RAPIDAPI_HOST = 'linkedin-data-scraper.p.rapidapi.com';
console.log(process.env.RAPIDAPI_KEY);

export async function POST(request: Request) {
  console.log('🔄 Company Filters API - POST Request received');
  console.log('🔍 Request URL:', request.url);
  console.log('🔍 Request method:', request.method);

  try {
    const body = await request.json();
    console.log('📦 Request body:', body);
    const { query } = body;

    console.log('🔍 Company Filters API - Search query:', query);

    if (!query) {
      console.log('⚠️ Company Filters API - No query provided');
      return NextResponse.json({ suggestions: [] });
    }

    const requestConfig = {
      method: 'GET',
      url: 'https://linkedin-data-scraper.p.rapidapi.com/suggestion_company',
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST
      },
      params: { query }
    };

    console.log('🌐 Company Filters API - Making GET request to RapidAPI');
    console.log('🌐 Request config:', JSON.stringify(requestConfig, null, 2));

    const response = await axios(requestConfig);

    console.log('📥 Company Filters API - Response status:', response.status);
    console.log('📥 Company Filters API - Response headers:', response.headers);
    console.log('📥 Company Filters API - Raw response data:', JSON.stringify(response.data, null, 2));

    if (!response.data || !response.data.data) {
      console.error('❌ Company Filters API - Invalid response format:', response.data);
      return NextResponse.json({ suggestions: [] });
    }

    // Transform the response data
    const suggestions = response.data.data.map((item: any) => {
      console.log('🔄 Processing item:', item);
      return {
        urn: item.urn || item.id,
        text: item.title || item.text || item.displayValue
      };
    });

    console.log('✨ Company Filters API - Final transformed suggestions:', suggestions);
    return NextResponse.json({ suggestions });
  } catch (err: any) {
    console.error('❌ Company Filters API - Error:', err);
    console.error('❌ Company Filters API - Error details:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      headers: err.response?.headers,
      config: err.config
    });
    return NextResponse.json(
      { suggestions: [] },
      { status: err.response?.status || 500 }
    );
  }
}

export async function GET(request: Request) {
  console.log('\n=== 🚀 STARTING COMPANY SEARCH API ===');
  
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    console.log('📝 Search Query:', query);

    if (!query) {
      console.log('❌ No query parameter provided');
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    console.log('\n=== 🔍 MAKING RAPIDAPI REQUEST ===');
    console.log('API Key:', RAPIDAPI_KEY);
    console.log('API Host:', RAPIDAPI_HOST);
    
    const requestConfig = {
      method: 'GET',
      url: 'https://linkedin-data-scraper.p.rapidapi.com/suggestion_company',
      params: { query },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST
      }
    };
    console.log('Request Config:', JSON.stringify(requestConfig, null, 2));

    const response = await axios(requestConfig);
    console.log('\n=== 📦 RAPIDAPI RESPONSE ===');
    console.log('Response Status:', response.status);
    console.log('Response Headers:', JSON.stringify(response.headers, null, 2));
    console.log('Raw Response Data:', JSON.stringify(response.data, null, 2));

    if (!response.data || !response.data.suggestions) {
      console.error('❌ Invalid response format - No suggestions array');
      return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
    }

    // Transform the response data to match the expected format
    console.log('\n=== 🔄 TRANSFORMING RESPONSE DATA ===');
    const suggestions = response.data.suggestions.map((item: any) => {
      console.log('Processing item:', JSON.stringify(item, null, 2));
      return {
        id: item.urn,
        name: item.title,
        subtitle: item.subtitle || '',
        image: item.image || ''
      };
    });

    console.log('\n=== ✅ FINAL TRANSFORMED SUGGESTIONS ===');
    console.log('Number of suggestions:', suggestions.length);
    console.log('Transformed suggestions:', JSON.stringify(suggestions, null, 2));

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    console.error('\n=== ❌ ERROR OCCURRED ===');
    console.error('Error message:', error.message);
    console.error('Error status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { error: 'Failed to fetch company suggestions' },
      { status: error.response?.status || 500 }
    );
  }
} 