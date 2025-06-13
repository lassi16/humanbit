const axios = require('axios');

async function searchLinkedIn(postalText, postalId, page) {
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
  if (!RAPIDAPI_KEY) {
    console.error("❌ Missing RAPIDAPI_KEY in .env");
    return;
  }

  const options = {
    method: 'POST',
    url: 'https://linkedin-sales-navigator-no-cookies-required.p.rapidapi.com/premium_search_person',
    headers: {
      'x-rapidapi-key': RAPIDAPI_KEY,
      'x-rapidapi-host': 'linkedin-sales-navigator-no-cookies-required.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    data: {
      account_number: 1,
      page,
      filters: [
        {
          type: 'POSTAL_CODE',
          values: [
            {
              id: postalId,
              text: postalText,
              selectionType: 'INCLUDED'
            }
          ],
          selectedSubFilter: 50
        }
      ]
    }
  };

  try {
    console.log("\n🔍 Searching LinkedIn...");
    const response = await axios.request(options);
    const results = response.data.response.data;

    if (!results || results.length === 0) {
      console.log("⚠️ No results found.");
      return;
    }

    results.forEach((person, i) => {
      console.log(`🔹 ${i + 1}. ${person.fullName || 'N/A'} | ${person.headline || 'No headline'}`);
    });
  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
  }
}

module.exports = { searchLinkedIn };
