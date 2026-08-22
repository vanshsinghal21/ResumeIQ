import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ======================================================
// Resume Analysis Schema
// ======================================================

const resumeAnalysisSchema = {
  name: "resume_analysis",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,

    properties: {
      detectedDomain: {
        type: "string",
      },

      targetRoles: {
        type: "array",
        items: {
          type: "string",
        },
      },

      scoreBreakdown: {
        type: "object",
        additionalProperties: false,

        properties: {
          technicalSkills: {
            type: "integer",
            minimum: 0,
            maximum: 20,
          },

          experience: {
            type: "integer",
            minimum: 0,
            maximum: 20,
          },

          projects: {
            type: "integer",
            minimum: 0,
            maximum: 15,
          },

          education: {
            type: "integer",
            minimum: 0,
            maximum: 10,
          },

          certifications: {
            type: "integer",
            minimum: 0,
            maximum: 10,
          },

          achievements: {
            type: "integer",
            minimum: 0,
            maximum: 10,
          },

          keywords: {
            type: "integer",
            minimum: 0,
            maximum: 10,
          },

          atsCompatibility: {
            type: "integer",
            minimum: 0,
            maximum: 5,
          },
        },

        required: [
          "technicalSkills",
          "experience",
          "projects",
          "education",
          "certifications",
          "achievements",
          "keywords",
          "atsCompatibility",
        ],
      },

      summary: {
        type: "string",
      },

      strengths: {
        type: "array",
        items: {
          type: "string",
        },
      },

      weaknesses: {
        type: "array",
        items: {
          type: "string",
        },
      },

      missingSkills: {
        type: "array",
        items: {
          type: "string",
        },
      },

      suggestions: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },

    required: [
      "detectedDomain",
      "targetRoles",
      "scoreBreakdown",
      "summary",
      "strengths",
      "weaknesses",
      "missingSkills",
      "suggestions",
    ],
  },
};

// ======================================================
// Analyze Resume
// ======================================================

export const analyzeResume = async (resumeText) => {
  try {
    if (!resumeText || resumeText.trim().length < 100) {
      throw new Error(
        "Resume text is too short or could not be extracted."
      );
    }

    const systemPrompt = `
You are ResumeIQ, an expert ATS resume evaluation engine.

Your job is to evaluate a resume according to the candidate's OWN
professional domain and likely career direction.

==================================================
STEP 1 — IDENTIFY THE PROFESSIONAL DOMAIN
==================================================

First determine what professional field the candidate belongs to.

Examples:

- Software Engineering
- Data Science
- Finance
- Accounting
- Marketing
- Sales
- Human Resources
- Healthcare
- Mechanical Engineering
- Civil Engineering
- Electronics
- Cybersecurity
- Product Management
- Design
- Operations
- Education
- Research
- Other

Do NOT assume that every resume is a technology resume.

Use evidence from:
- job titles
- work experience
- projects
- education
- certifications
- technical/business skills
- responsibilities

==================================================
STEP 2 — IDENTIFY LIKELY TARGET ROLES
==================================================

Infer up to 3 realistic target roles from the resume.

For example:

Finance resume:
- Financial Analyst
- Accounting Specialist
- R2R Analyst

Software resume:
- Software Engineer
- Backend Developer
- Full Stack Developer

Marketing resume:
- Digital Marketing Specialist
- Marketing Analyst
- Growth Associate

Do not invent a role that has no meaningful connection to the resume.

==================================================
STEP 3 — UNDERSTAND SKILLS IN CONTEXT
==================================================

Interpret skills semantically.

Equivalent terminology should be understood.

Examples:

"cloud object storage" may indicate AWS S3.

"container orchestration" may indicate Kubernetes.

"continuous integration and deployment" may indicate CI/CD.

"financial close" may indicate month-end closing experience.

"general ledger reconciliation" may indicate accounting expertise.

Do not require exact keyword matching.

==================================================
STEP 4 — DETERMINE MISSING SKILLS
==================================================

THIS IS EXTREMELY IMPORTANT.

Missing skills must be relevant to the candidate's
professional domain and likely target roles.

DO NOT create a generic list of popular skills.

DO NOT recommend technical skills merely because they are
common in software engineering.

For example:

If the candidate is an accountant:

DO NOT mark these as missing merely because they are absent:

- Python
- Java
- React
- Kubernetes
- AWS
- Machine Learning

Those are NOT automatically relevant to an accounting career.

Instead consider skills relevant to the candidate's actual domain,
such as:

- Advanced Excel
- Financial modelling
- Financial forecasting
- Power BI
- IFRS
- GAAP
- SAP modules

BUT ONLY mark them as missing if they are genuinely relevant
to the likely target role.

If the resume already demonstrates a skill, DO NOT list it
as missing.

If you are uncertain whether a skill is important for the
candidate's target role, DO NOT list it.

It is better to return fewer relevant missing skills than many
irrelevant ones.

Return a maximum of 5 missing skills.

==================================================
STEP 5 — SCORING
==================================================

Score the resume according to its own professional context.

Do NOT compare a finance resume with a software engineering resume.

Do NOT penalize a candidate for lacking skills from another industry.

Use these categories:

Technical / Domain Skills: 0-20
Experience: 0-20
Projects / Practical Work: 0-15
Education: 0-10
Certifications: 0-10
Achievements: 0-10
Relevant Keywords: 0-10
ATS Compatibility: 0-5

Total possible score = 100.

The score should reflect the quality and ATS readiness of
the resume for the candidate's likely career direction.

==================================================
STEP 6 — COMPLEX RESUMES
==================================================

Do not give a score of 0 because:

- the language is sophisticated
- the resume contains complex terminology
- the resume has unusual wording
- the PDF extraction is imperfect
- the candidate uses domain-specific terminology
- the resume contains tables or multiple sections

Understand the meaning of the content.

A score of 0 should only occur when there is essentially
no usable resume information.

==================================================
STEP 7 — STRENGTHS
==================================================

Strengths must be based on actual evidence in the resume.

Never invent experience, skills, certifications,
achievements, employers or responsibilities.

==================================================
STEP 8 — WEAKNESSES
==================================================

Weaknesses should identify genuine limitations in the resume.

Examples:

- insufficient quantified achievements
- weak project descriptions
- missing measurable outcomes
- unclear career progression
- weak section organization

Do not invent weaknesses.

==================================================
STEP 9 — SUGGESTIONS
==================================================

Suggestions should be actionable and relevant to the
candidate's domain and likely target roles.

Avoid generic advice that applies equally to every profession.

==================================================
FINAL RULE
==================================================

Think about the candidate's career context FIRST.

Then evaluate the resume.

Never use a generic technology-job checklist for
non-technology candidates.
`;

    const userPrompt = `
Analyze the following resume.

First understand:
1. What professional domain the candidate belongs to.
2. What roles the candidate is most likely targeting.
3. What skills are actually relevant to those roles.

Then evaluate the resume.

Remember:
- Missing skills must be domain-specific.
- Do not invent irrelevant missing skills.
- Do not assume every candidate is a software engineer.
- Do not penalize a candidate for not having unrelated technologies.

RESUME:

${resumeText}
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",

      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],

      response_format: {
        type: "json_schema",
        json_schema: resumeAnalysisSchema,
      },

      reasoning_effort: "medium",

      temperature: 0.2,

      max_completion_tokens: 4000,
    });

    const content =
      completion?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error(
        "Groq returned an empty analysis response."
      );
    }

    console.log(
      "========== GROQ ANALYSIS RESPONSE =========="
    );

    console.log(content);

    console.log(
      "============================================="
    );

    let result;

    try {
      result = JSON.parse(content);
    } catch (error) {
      console.error(
        "Groq JSON Parse Error:",
        error
      );

      throw new Error(
        "Groq returned invalid JSON."
      );
    }

    // ==================================================
    // Calculate Final Score From Breakdown
    // ==================================================

    const breakdown = result.scoreBreakdown;

    const calculatedScore =
      breakdown.technicalSkills +
      breakdown.experience +
      breakdown.projects +
      breakdown.education +
      breakdown.certifications +
      breakdown.achievements +
      breakdown.keywords +
      breakdown.atsCompatibility;

    const finalScore = Math.max(
      0,
      Math.min(100, calculatedScore)
    );

    // ==================================================
    // Validate Arrays
    // ==================================================

    if (!Array.isArray(result.strengths)) {
      throw new Error(
        "Invalid strengths returned by AI."
      );
    }

    if (!Array.isArray(result.weaknesses)) {
      throw new Error(
        "Invalid weaknesses returned by AI."
      );
    }

    if (!Array.isArray(result.missingSkills)) {
      throw new Error(
        "Invalid missing skills returned by AI."
      );
    }

    if (!Array.isArray(result.suggestions)) {
      throw new Error(
        "Invalid suggestions returned by AI."
      );
    }

    // ==================================================
    // Safety Filter For Missing Skills
    // ==================================================

    const cleanedMissingSkills =
      result.missingSkills
        .filter(
          (skill) =>
            typeof skill === "string" &&
            skill.trim().length > 0
        )
        .slice(0, 5);

    // ==================================================
    // Return Final Analysis
    // ==================================================

    return {
      score: finalScore,

      summary:
        result.summary || "",

      strengths:
        result.strengths,

      weaknesses:
        result.weaknesses,

      missingSkills:
        cleanedMissingSkills,

      suggestions:
        result.suggestions,

      // Useful for future UI improvements
      detectedDomain:
        result.detectedDomain,

      targetRoles:
        result.targetRoles,

      scoreBreakdown:
        result.scoreBreakdown,
    };

  } catch (error) {

    console.error(
      "========== GROQ ANALYSIS ERROR =========="
    );

    console.error(error);

    console.error(
      "========================================="
    );

    // IMPORTANT:
    // AI failure must NOT become a fake 0 score.

    throw new Error(
      "AI resume analysis failed. Please try again."
    );
  }
};