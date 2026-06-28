import { GoogleGenAI } from '@google/genai'
import 'dotenv/config'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export const getMatchScore = async ({ jobTitle, jobDescription, requiredSkills, candidateSkills, experienceYears }) => {
  const prompt = `
You are a strict technical recruiter evaluating a candidate's fit for a job.

JOB TITLE: ${jobTitle}

JOB DESCRIPTION:
${jobDescription}

REQUIRED SKILLS: ${requiredSkills.join(', ')}

CANDIDATE'S SKILLS: ${candidateSkills.join(', ') || 'None listed'}
CANDIDATE'S EXPERIENCE: ${experienceYears} years

Evaluate how well this candidate matches the job. Respond with ONLY a valid JSON object in this exact format, with no markdown formatting, no backticks, and no extra text:

{
  "matchScore": <number between 0 and 100>,
  "missingSkills": [<array of required skills the candidate doesn't have>],
  "strengths": [<array of 1-3 short strings describing candidate's relevant strengths>],
  "suggestion": "<one short sentence of actionable advice for the candidate to improve their fit>"
}
`

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      temperature: 0.3,
      responseMimeType: 'application/json', // forces valid JSON output, same role as OpenAI's response_format
    },
  })

  const raw = response.text
  return JSON.parse(raw)
}

export default ai