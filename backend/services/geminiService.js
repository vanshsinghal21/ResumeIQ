import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const analyzeResume = async (resumeText) => {
 const prompt = `
You are an expert ATS Resume Reviewer.

Analyze the following resume as if it were being evaluated by a modern Applicant Tracking System (ATS).

The ATS score MUST be an integer between 0 and 100.

Scoring Guidelines:
- 90-100 = Excellent resume
- 80-89 = Very Good
- 70-79 = Good
- 60-69 = Average
- Below 60 = Needs significant improvement

Evaluate based on:
- Resume structure
- Technical skills
- Relevant experience
- Projects
- Certifications
- Keywords
- Quantified achievements
- Formatting
- ATS compatibility

Return ONLY valid JSON.

{
  "score": 0,
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "suggestions": []
}

Resume:

${resumeText}
`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text = completion.choices[0].message.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

      console.log("========== GROQ RAW RESPONSE ==========");
      console.log(text);
      console.log("=======================================");

    return JSON.parse(text);

  } catch (error) {
    console.error(error);

    return {
      score: 0,
      summary: "",
      strengths: [],
      weaknesses: [],
      missingSkills: [],
      suggestions: [],
    };
  }
};