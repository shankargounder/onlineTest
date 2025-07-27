const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const OpenAI = require('openai');
const path = require('path');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

// Serve static Angular files
app.use(express.static(path.join(__dirname, '../dist/test')));
//const { sendToMultipleNumbers } = require('./sendWhatsApp');
const openai = new OpenAI({
  // apiKey: process.env.OPENAI_API_KEY
  apiKey: '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'
});

// Multer config for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');

// Helper to generate questions
async function generateQuestions(text) {
  const prompt = `From the following content, create 10 multiple-choice questions (4 options each) in JSON format:
  Content: ${text}
  Example JSON:
  [
    {
      "question": "What is ...?",
      "options": ["A", "B", "C", "D"],
      "answer": "A",
      "selectAnswer": ""
    }
  ]
  Return only valid JSON, no explanations or text outside the JSON
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }]
  });

  let gptOutput = response.choices[0].message.content.trim();
  console.log(response);
  // Remove code fences if GPT adds ```json ... ```
  gptOutput = gptOutput.replace(/```json|```/g, "");
  // console.log("with \n ", gptOutput);

  return gptOutput;
}

// Chat endpoint
app.post('/chat', async (req, res) => {
  const { query } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: query }],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OpenAI request failed" });
  }
});

// Upload and process file
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    let text = '';

    if (req.file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text;
    } else {
      text = fs.readFileSync(filePath, 'utf-8');
    }

    console.log("txt ", text);
    const gptOutput = await generateQuestions(text);

    // Try parsing GPT output as JSON
    let questions;
    try {
      questions = JSON.parse(gptOutput);
    } catch (e) {
      // If GPT output is not pure JSON, wrap it
      questions = [{ error: 'Failed to parse GPT response', raw: gptOutput }];
    }

    res.json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error processing file' });
  }
});

// Fallback for Angular routes
app.get(/^\/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/test/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));