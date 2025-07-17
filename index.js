const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://zcoder-frontend-theta.vercel.app'
  ],
  credentials: true // ✅ Add this if using cookies/auth
};
app.use(cors(corsOptions));
app.use(express.json());

const evaluator = require('./routes/evaluator');
app.use('/api', evaluator);

// Language mapping config
const languageConfig = {
  javascript: { lang: 'nodejs', versionIndex: '4' },
  python: { lang: 'python3', versionIndex: '4' },
  cpp: { lang: 'cpp17', versionIndex: '1' },
};

// Execute code endpoint
app.post('/api/execute', async (req, res) => {
  const { language, code } = req.body;
  const config = languageConfig[language];

  if (!config) {
    return res.status(400).json({ error: 'Unsupported language.' });
  }

  const payload = {
    clientId: process.env.JDOODLE_CLIENT_ID,
    clientSecret: process.env.JDOODLE_CLIENT_SECRET,
    script: code,
    language: config.lang,
    versionIndex: config.versionIndex,
  };

  try {
    const response = await axios.post('https://api.jdoodle.com/v1/execute', payload);
    res.json({ output: response.data.output });
  } catch (error) {
    console.error("Error calling execution API:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'An error occurred while executing the code.' });
  }
});

// ✅ Add a root route for server health check
app.get('/', (req, res) => {
  res.send('ZCoder Code Runner API is Live ⚙️');
});

// ✅ Listen on correct port for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Code Runner server running on port ${PORT}`);
});
