import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

console.log("1");
console.log(
  "🔑 GEMINI_API_KEY loaded:",
  process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.slice(0, 4) + "…" : "❌ MISSING"
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { description } = await req.json()

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `Please enhance the following job candidate description and extract key attributes into a JSON object. The JSON should contain three fields:\n1.  \`enhancedDescription\`: A single, polished version of the candidate description, focusing on professional clarity and impact, and refining attributes like skills, experience, and responsibilities.\n2.  \`requiredSkills\`: An array of strings, listing the most relevant required skills inferred from the description.\n3.  \`keyResponsibilities\`: An array of strings, listing the key responsibilities that the candidate's profile suggests they can handle.\n\nEnsure the response is ONLY a valid JSON object. Do not include any additional text, markdown formatting outside the JSON, or commentary.\n\nCandidate Description: ${description}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    let parsedResponse: any;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse Gemini response as JSON:", responseText, e);
      throw new Error("Invalid response format from AI model.");
    }

    // Ensure the required fields exist, provide defaults if not
    const enhancedDescription = parsedResponse.enhancedDescription || description;
    const requiredSkills = parsedResponse.requiredSkills || [];
    const keyResponsibilities = parsedResponse.keyResponsibilities || [];

    return NextResponse.json({
      enhancedDescription,
      requiredSkills,
      keyResponsibilities,
    });
  } catch (err: any) {
    console.error(err)
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    )
  }
} 