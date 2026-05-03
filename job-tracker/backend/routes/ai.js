const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/cover-letter', auth, async (req, res) => {
  try {
    const { jobTitle, company, jobDescription, skills } = req.body;

    if (!jobTitle || !company) {
      return res.status(400).json({ message: 'Job title and company are required' });
    }

    const prompt = `You are a professional cover letter writer. Write a compelling, personalized cover letter for the following job application.

Applicant Details:
- Name: Praveen Shah
- Skills: ${skills || 'React JS, Node.js, MongoDB, Python, JavaScript, Tailwind CSS'}
- Education: MCA from Graphic Era Hill University (8.0 CGPA)
- Experience: Frontend Developer with 2+ years experience

Job Details:
- Position: ${jobTitle}
- Company: ${company}
- Job Description: ${jobDescription || 'Not provided'}

Write a professional cover letter that:
1. Is 3-4 paragraphs long
2. Highlights relevant skills matching the job
3. Shows enthusiasm for the company
4. Has a strong opening and closing
5. Sounds natural and human

Write ONLY the cover letter content, starting with "Dear Hiring Manager," - no extra commentary.`;

    const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ message: data.error.message });
    }

    const coverLetter = data.candidates[0].content.parts[0].text;
    res.json({ coverLetter });

  } catch (err) {
    console.error('AI Error:', err);
    res.status(500).json({ message: 'Failed to generate cover letter' });
  }
});

module.exports = router;