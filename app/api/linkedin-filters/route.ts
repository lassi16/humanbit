import { NextResponse } from "next/server";
import axios from "axios";

export const dynamic = "force-dynamic";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '41d0e79092msh51eeddd46fabf94p16abf3jsn29f628ce21ff';
const RAPIDAPI_HOST = "linkedin-data-scraper.p.rapidapi.com";

interface LocationSuggestion {
  urn: string;
  text: string;
  countryCode?: string;
  type?: string;
  selectionType?: string;
  displayValue?: string;
}

export async function GET(request: Request) {
  console.log('\n=== 🚀 STARTING LOCATION SEARCH API ===');
  
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    console.log('📝 Search Keyword:', keyword);

    if (!keyword) {
      console.log('❌ No keyword parameter provided');
      return NextResponse.json({ error: 'Keyword parameter is required' }, { status: 400 });
    }

    console.log('\n=== 🔍 MAKING RAPIDAPI REQUEST ===');
    console.log('API Key:', RAPIDAPI_KEY);
    console.log('API Host:', RAPIDAPI_HOST);
    
    const requestConfig = {
      method: 'GET',
      url: 'https://linkedin-data-scraper.p.rapidapi.com/suggestion_location',
      params: { query: keyword },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST
      }
    };
    console.log('Request Config:', JSON.stringify(requestConfig, null, 2));

    const response = await axios(requestConfig);
    
    // Print the complete response in a readable format
    console.log('\n=== 📦 RAPIDAPI RESPONSE ===');
    console.log('Response Status:', response.status);
    console.log('Response Headers:', JSON.stringify(response.headers, null, 2));
    console.log('\n=== 📄 RESPONSE DATA ===');
    console.log(JSON.stringify(response.data, null, 2));
    console.log('\n=== 🔍 RESPONSE DETAILS ===');
    console.log('Response Type:', typeof response.data);
    console.log('Is Array:', Array.isArray(response.data));
    console.log('Number of Items:', Array.isArray(response.data) ? response.data.length : 'Not an array');
    
    if (Array.isArray(response.data) && response.data.length > 0) {
      console.log('\n=== 📋 FIRST ITEM DETAILS ===');
      console.log(JSON.stringify(response.data[0], null, 2));
    }

    if (!response.data) {
      console.error('❌ Invalid response format - No data received');
      return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
    }

    // Transform the response data to match the expected format
    console.log('\n=== 🔄 TRANSFORMING RESPONSE DATA ===');
    const suggestions = response.data.map((item: any) => {
      console.log('Processing item:', JSON.stringify(item, null, 2));
      return {
        id: item.urn || item.id,
        text: item.title || item.name,
        type: item.type || 'location',
        countryCode: item.countryCode || '',
        displayValue: item.title || item.name
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
      { error: 'Failed to fetch location suggestions' },
      { status: error.response?.status || 500 }
    );
  }
}
