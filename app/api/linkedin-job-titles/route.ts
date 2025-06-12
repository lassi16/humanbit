import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  console.log('🔄 Job Titles API - Request received');
  
  try {
    const { query } = await request.json();
    console.log('🔍 Job Titles API - Search query:', query);

    if (!query) {
      console.log('⚠️ Job Titles API - No query provided');
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '4c89115fcdmsh967eb7bd3ab336ap136e2bjsn6201fbaca34c';
    const RAPIDAPI_HOST = 'linkedin-sales-navigator-no-cookies-required.p.rapidapi.com';

    console.log('🌐 Job Titles API - Making request to RapidAPI');
    console.log('Request details:', {
      url: `https://${RAPIDAPI_HOST}/filter_job_title_suggestions`,
      method: 'POST',
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'Content-Type': 'application/json'
      },
      data: { query }
    });

    const response = await axios.post(
      `https://${RAPIDAPI_HOST}/filter_job_title_suggestions`,
      { query },
      {
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': RAPIDAPI_HOST,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('📥 Job Titles API - Raw API response:', response.data);

    if (!response.data || !Array.isArray(response.data.data)) {
      console.error('❌ Job Titles API - Invalid response format:', response.data);
      return NextResponse.json(
        { error: 'Invalid response format from RapidAPI' },
        { status: 500 }
      );
    }

    // Transform the response data
    const suggestions = response.data.data.map((item: any) => {
      console.log('📝 Job Titles API - Processing item:', item);
      return {
        id: item.id || '',
        text: item.text || item.displayValue || '',
        displayValue: item.displayValue || item.text || '',
        count: item.count || 0
      };
    });

    console.log('✨ Job Titles API - Transformed suggestions:', suggestions);
    return NextResponse.json({ suggestions });
  } catch (err: any) {
    console.error('❌ Job Titles API - Error:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      stack: err.stack
    });

    return NextResponse.json(
      {
        error: err.response?.data?.message || err.message,
        details: err.response?.data,
        status: err.response?.status,
      },
      { status: err.response?.status || 500 }
    );
  }
} 