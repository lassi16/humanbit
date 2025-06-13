import axios from "axios";
import promptSync from "prompt-sync";
import dotenv from "dotenv";
dotenv.config();

const prompt = promptSync();

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST =
  "linkedin-sales-navigator-no-cookies-required.p.rapidapi.com";

// Add retry mechanism with exponential backoff
async function makeRequestWithRetry(options, maxRetries = 1) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.request(options);
      return response;
    } catch (error) {
      if (error.response?.status === 429) {
        const waitTime = Math.pow(2, attempt) * 1000;
        console.log(
          `⏳ Rate limited. Waiting ${
            waitTime / 1000
          } seconds before retry ${attempt}/${maxRetries}...`
        );
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }

      if (
        error.response?.data?.message?.includes("exceeded the MONTHLY quota")
      ) {
        console.error(
          "💳 API quota exceeded. Please upgrade your RapidAPI plan or wait for quota reset."
        );
        throw new Error("QUOTA_EXCEEDED");
      }

      if (attempt === maxRetries) throw error;

      console.log(`⚠️ Attempt ${attempt} failed, retrying...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

// 🔍 Step 1: Get postal ID suggestions
async function getPostalSuggestions(query) {
  const options = {
    method: "POST",
    url: `https://${RAPIDAPI_HOST}/filter_geography_location_postal_code_suggestions`,
    headers: {
      "x-rapidapi-key": RAPIDAPI_KEY,
      "x-rapidapi-host": RAPIDAPI_HOST,
      "Content-Type": "application/json",
    },
    data: { query },
    timeout: 10000,
  };

  try {
    console.log(
      `[DEBUG] Sending request for postal suggestions with query: ${query}`
    );
    const res = await makeRequestWithRetry(options);
    console.log(`[DEBUG] API response status: ${res.status}`);
    console.log(
      `[DEBUG] API response data:`,
      JSON.stringify(res.data, null, 2)
    );
    const suggestions = res.data?.data || [];

    if (suggestions.length === 0) {
      console.log(
        `ℹ️ No location suggestions found for "${query}". Try a broader search term.`
      );
    }

    return suggestions;
  } catch (error) {
    if (error.message === "QUOTA_EXCEEDED") {
      return [];
    }
    console.error(
      "❌ Error getting location suggestions:",
      error.response?.data || error.message
    );
    return [];
  }
}

// 🔍 Step 2: Get job title suggestions
async function getJobTitleSuggestions(query) {
  const options = {
    method: "POST",
    url: `https://${RAPIDAPI_HOST}/filter_job_title_suggestions`,
    headers: {
      "x-rapidapi-key": RAPIDAPI_KEY,
      "x-rapidapi-host": RAPIDAPI_HOST,
      "Content-Type": "application/json",
    },
    data: { query },
    timeout: 10000,
  };

  try {
    const res = await makeRequestWithRetry(options);
    const suggestions = res.data?.data || [];

    if (suggestions.length === 0) {
      console.log(
        `ℹ️ No job title suggestions found for "${query}". Try a different keyword.`
      );
    }

    return suggestions;
  } catch (error) {
    if (error.message === "QUOTA_EXCEEDED") {
      return [];
    }
    console.error(
      "❌ Error fetching job title suggestions:",
      error.response?.data || error.message
    );
    return [];
  }
}

// 📊 Enhanced search function with multiple strategies
async function searchLinkedIn(postalId, postalText, jobTitle) {
  console.log("\n🔍 Starting comprehensive LinkedIn search...");

  // Strategy 1: Location-only search (most likely to return results)
  console.log("\n📍 Strategy 1: Location-only search");
  const locationOnlyResults = await searchWithFilters(
    [
      {
        type: "POSTAL_CODE",
        values: [{ id: postalId, text: postalText, selectionType: "INCLUDED" }],
      },
    ],
    "Location only"
  );

  if (locationOnlyResults && locationOnlyResults.length > 0) {
    console.log(
      `✅ Found ${locationOnlyResults.length} profiles in ${postalText}`
    );
    displayResults(locationOnlyResults, `People in ${postalText}`);

    // Print the API response for location-only search
    console.log("\n📊 API Response for Location-only Search:");
    console.log(JSON.stringify(locationOnlyResults, null, 2));

    return;
  }

  console.log("\n❌ No results found with the location-only search strategy.");
  console.log("💡 Possible issues:");
  console.log("   • API limitations or restrictions");
  console.log("   • Selected location has no matches");
  console.log("   • API subscription doesn't include premium search features");
  console.log("   • Temporary API service issues");
}

// Helper function to perform search with given filters
async function searchWithFilters(filters, description) {
  const options = {
    method: "POST",
    url: `https://${RAPIDAPI_HOST}/premium_search_person`,
    headers: {
      "x-rapidapi-key": RAPIDAPI_KEY,
      "x-rapidapi-host": RAPIDAPI_HOST,
      "Content-Type": "application/json",
    },
    data: {
      account_number: 1,
      page: 1,
      filters: filters,
    },
    timeout: 15000,
  };

  try {
    console.log(`   🔄 Trying: ${description}...`);
    const res = await makeRequestWithRetry(options);

    // Debug: Log response structure
    console.log(`   📊 Response status: ${res.status}`);

    const responseData =
      res.data?.response?.data || res.data?.data || res.data?.results;
    const metadata = res.data?.response?.metadata || res.data?.metadata;

    if (metadata) {
      console.log(
        `   📈 Total results available: ${
          metadata.totalResultCount || "Unknown"
        }`
      );
    }

    if (!responseData) {
      console.log("   ⚠️ No data field found in response");
      console.log("   🔍 Response structure:", Object.keys(res.data || {}));
      return null;
    }

    if (!Array.isArray(responseData)) {
      console.log("   ⚠️ Data is not an array:", typeof responseData);
      return null;
    }

    console.log(`   ✅ Found ${responseData.length} results`);
    return responseData;
  } catch (error) {
    if (error.message === "QUOTA_EXCEEDED") {
      return null;
    }
    console.log(
      `   ❌ ${description} failed:`,
      error.response?.data?.message || error.message
    );
    return null;
  }
}

// Helper function to display results
function displayResults(results, title) {
  console.log(`\n🎯 ${title}:\n`);

  const displayCount = Math.min(results.length, 10);

  for (let i = 0; i < displayCount; i++) {
    const item = results[i];
    const name =
      item.fullName ||
      `${item.firstName || ""} ${item.lastName || ""}`.trim() ||
      "N/A";
    const position =
      item.currentPosition?.title || item.headline || item.occupation || "N/A";
    const company = item.currentPosition?.companyName || item.company || "N/A";
    const location = item.geoRegion || item.location || item.region || "N/A";

    // Handle different URL formats
    let profileURL = "N/A";
    if (item.navigationUrl) {
      if (item.navigationUrl.startsWith("http")) {
        profileURL = item.navigationUrl;
      } else {
        profileURL = `https://www.linkedin.com${item.navigationUrl}`;
      }
    } else if (item.publicIdentifier) {
      profileURL = `https://www.linkedin.com/in/${item.publicIdentifier}`;
    } else if (item.profileId) {
      profileURL = `https://www.linkedin.com/in/${item.profileId}`;
    }

    console.log(`${i + 1}. ${name}`);
    console.log(
      `   💼 ${position}${company !== "N/A" ? ` at ${company}` : ""}`
    );
    console.log(`   📍 ${location}`);
    console.log(`   🔗 ${profileURL}`);
    console.log("");
  }

  if (results.length > 10) {
    console.log(`... and ${results.length - 10} more results`);
  }

  console.log(`📊 Total: ${results.length} profiles found`);
}

// Helper function to simplify job titles
function simplifyJobTitle(title) {
  // Remove specific technologies and seniority levels
  const simplified = title
    .replace(
      /\b(Java|Python|React|Angular|Node\.js|\.NET|C\+\+|JavaScript)\b/gi,
      ""
    )
    .replace(/\b(Senior|Lead|Principal|Staff|Junior|Associate)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  return simplified || "Engineer";
}

// Helper function to extract city name from location
function extractCityFromLocation(location) {
  // Extract city name from format like "110002, Delhi, India"
  const parts = location.split(",");
  if (parts.length >= 2) {
    return parts[1].trim();
  }
  return location;
}

// 🛠️ Utility function to validate API key
async function validateApiKey() {
  if (!RAPIDAPI_KEY) {
    console.error("❌ RAPIDAPI_KEY not found in environment variables.");
    console.log(
      "💡 Make sure you have a .env file with: RAPIDAPI_KEY=your_key_here"
    );
    return false;
  }

  console.log("✅ API key found");
  return true;
}

// 🚀 Main CLI Flow
(async () => {
  console.log("🔍 Enhanced LinkedIn Profile Search Tool\n");

  if (!(await validateApiKey())) {
    return;
  }

  try {
    const locationQuery = prompt(
      "Enter a location keyword (e.g., 'delhi', 'mumbai', 'bangalore'): "
    );
    if (!locationQuery.trim()) {
      console.log("❌ Location query cannot be empty.");
      return;
    }

    console.log("🔄 Fetching location suggestions...");
    const suggestions = await getPostalSuggestions(locationQuery.trim());

    if (!suggestions.length) {
      console.log(
        "❌ No location suggestions found. Try a different location."
      );
      return;
    }

    console.log("\n📍 Location Suggestions:");
    suggestions.forEach((item, i) => {
      console.log(
        `${i + 1}. ${item.displayValue || item.text || JSON.stringify(item)}`
      );
    });

    // Automatically select the first location suggestion
    const selectedLocation = suggestions[0];
    console.log(`✅ Selected location: ${selectedLocation.displayValue}`);

    const jobQuery = prompt(
      "\nEnter part of a job title (e.g., 'engineer', 'manager', 'developer'): "
    );
    if (!jobQuery.trim()) {
      console.log("❌ Job title query cannot be empty.");
      return;
    }

    console.log("🔄 Fetching job title suggestions...");
    const jobSuggestions = await getJobTitleSuggestions(jobQuery.trim());

    if (!jobSuggestions.length) {
      console.log(
        "❌ No job title suggestions found. Try a different keyword."
      );
      return;
    }

    console.log("\n📌 Job Title Suggestions:");
    jobSuggestions.forEach((item, i) => {
      const title = item.text || item.displayValue || JSON.stringify(item);
      console.log(`${i + 1}. ${title}`);
    });

    // Automatically select the first job title suggestion
    const selectedTitleItem = jobSuggestions[0];
    const selectedTitle =
      selectedTitleItem.text || selectedTitleItem.displayValue;

    console.log(`\n🎯 Search Parameters:`);
    console.log(
      `📍 Location: ${selectedLocation.displayValue} (ID: ${selectedLocation.id})`
    );
    console.log(`💼 Job Title: "${selectedTitle}"`);

    await searchLinkedIn(
      selectedLocation.id,
      selectedLocation.displayValue,
      selectedTitle
    );
  } catch (error) {
    console.error("💥 Unexpected error:", error.message);
    console.log("🔄 Please try running the script again.");
  }
})();
