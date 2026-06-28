import { SKILLS_LIST } from './skillsList.js'


export const extractSkills = (text) => {
  const lowerText = text.toLowerCase()
  const foundSkills = new Set()

  for (const skill of SKILLS_LIST) {
    const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') 
    const pattern = new RegExp(`\\b${escapedSkill}\\b`, 'i')

    if (pattern.test(text) || lowerText.includes(skill.toLowerCase())) {
      foundSkills.add(skill)
    }
  }

  return Array.from(foundSkills)
}


export const extractExperienceYears = (text) => {
  const patterns = [
    /(\d+)\+?\s*years?\s*(of)?\s*experience/i,
    /experience\s*[:\-]?\s*(\d+)\+?\s*years?/i,
    /(\d+)\+?\s*yrs?\s*(of)?\s*experience/i,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      const years = parseInt(match[1], 10)
      if (!isNaN(years) && years >= 0 && years <= 50) {
        return years
      }
    }
  }

  return 0 
}