const express = require('express');
const router = express.Router();
const { runCode } = require('../utils/executeRunner');

router.post('/evaluate', async (req, res) => {
  const { language, code, testCases } = req.body;
  if (!language || !code || !Array.isArray(testCases)) {
    return res.status(400).json({ error: 'Missing or invalid fields' });
  }

  const results = await Promise.all(testCases.map(async (t) => {
    try {
      const result = await runCode(language, code, t.input);
      return {
        input: t.input,
        expected: t.expected,
        output: result.output.trim(),
        passed: result.output.trim() === t.expected.trim(),
      };
    } catch (err) {
      return {
        input: t.input,
        expected: t.expected,
        output: err.message,
        passed: false,
      };
    }
  }));

  res.json({ results });
});

module.exports = router;
