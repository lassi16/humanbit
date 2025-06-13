import { getJson } from 'serpapi';
import { NextResponse } from 'next/server';

interface Filter {
  type: string;
  category: string;
  value: string;
  priority: string;
}

interface Profile {
  name: string;
  url: string;
}

interface SerpApiGoogleResponse {
  search_metadata: any;
  search_parameters: any;
  search_information: any;
  inline_images?: any[];
  organic_results?: Array<{
    title: string;
    link: string;
    source?: string;
    // Add other properties from organic_results if needed
  }>;
  error?: string;
}

export async function POST(request: Request) {
  try {
    const { filters } = await request.json();

    let skills: string[] = [];
    let location: string | undefined;
    let jobTitle: string | undefined;
    let companyNames: string[] = [];

    if (Array.isArray(filters)) {
      filters.forEach((filter: Filter) => {
        if (filter.type === 'include' && filter.category === 'keyword' && filter.value) {
          skills.push(filter.value);
        } else if (filter.type === 'include' && filter.category === 'location' && filter.value) {
          location = filter.value;
        } else if (filter.type === 'include' && filter.category === 'job_title' && filter.value) {
          jobTitle = filter.value;
        } else if (filter.type === 'include' && filter.category === 'company' && filter.value) {
          companyNames.push(filter.value);
        }
      });
    }

    if (skills.length === 0) {
      return NextResponse.json({ error: 'Skills array is required and must not be empty' }, { status: 400 });
    }

    const queryParts = [`site:linkedin.com/in/`];
    if (skills.length > 0) {
      queryParts.push(skills.join(' AND '));
    }
    if (location) {
      queryParts.push(`"${location}"`);
    }
    if (jobTitle) {
      queryParts.push(`"${jobTitle}"`);
    }
    if (companyNames.length > 0) {
      queryParts.push(`(${companyNames.map(name => `"${name}"`).join(' OR ')})`);
    }

    const q = queryParts.join(' ');

    const params = {
      engine: "google",
      q: q,
      api_key: process.env.SERPAPI_API_KEY,
      num: 25, // Request more results
      gl: "us", // Set location to US for better results
      hl: "en", // Set language to English
    };

    console.log("Making SerpApi request with params:", params);

    const json = (await getJson(params)) as SerpApiGoogleResponse;
    console.log("Raw SerpApi response:", JSON.stringify(json, null, 2));

    if (json.error) {
      console.error('SerpApi returned error:', json.error);
      return NextResponse.json({ error: `SerpApi Error: ${json.error}` }, { status: 500 });
    }

    if (json.organic_results) {
      const profiles: Profile[] = json.organic_results
        .filter((result: any) => {
          // Only include results that are actual LinkedIn profile pages
          const link = result.link || '';
          return (
            link.includes('/in/') || 
            link.includes('/pub/')
          ) && 
          !link.includes('/pulse/') && 
          !link.includes('/posts/') &&
          !link.includes('/company/') &&
          !link.includes('/groups/');
        })
        .map((result: any) => {
          // Extract name from the source field if available
          let name = '';
          if (result.source && result.source.includes('LinkedIn · ')) {
            name = result.source.replace('LinkedIn · ', '').trim();
          } else if (result.title) {
            // Try to extract name from title
            const titleParts = result.title.split(' - ');
            name = titleParts[0].trim();
          }

          // Clean up the name
          name = name.replace('| LinkedIn', '').trim();

          return {
            name: name || 'LinkedIn Profile', // Fallback if no name found
            url: result.link,
          };
        });

      console.log('Extracted profiles:', JSON.stringify(profiles, null, 2));
      return NextResponse.json({ profiles });
    } else {
      console.error('Unknown error from SerpApi. Full response:', JSON.stringify(json, null, 2));
      return NextResponse.json({ error: 'Unknown error from SerpApi' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Error in optimize-linkedin-search:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 