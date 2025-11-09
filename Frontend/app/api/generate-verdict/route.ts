import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { caseTitle, caseNumber, caseDescription, plaintiffStatement, defendantStatement } = await request.json()

    const prompt = `You are an AI Judge rendering a legal verdict. Analyze the following case:

Case Title: ${caseTitle}
Case Number: ${caseNumber}
Case Description: ${caseDescription}

Plaintiff's Statement:
${plaintiffStatement}

Defendant's Statement:
${defendantStatement}

Based on the evidence and arguments presented, provide:
1. A clear verdict (ruling in favor of either the Plaintiff or Defendant)
2. The reasoning behind your decision (consider legal principles, evidence strength, argumentation quality)

Format your response as JSON with two fields: "decision" and "reasoning".
The decision should start with "VERDICT:" and clearly state who won.
The reasoning should be 2-3 paragraphs explaining your judgment.`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
    })

    // Parse the AI response as JSON
    const verdictData = JSON.parse(text)

    return Response.json(verdictData)
  } catch (error) {
    console.error("Error generating verdict:", error)
    return Response.json({ error: "Failed to generate verdict" }, { status: 500 })
  }
}
