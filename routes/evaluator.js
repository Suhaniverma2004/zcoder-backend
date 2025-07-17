const express = require('express');
const router = express.Router();
const { runCode } = require('../utils/executeRunner');

router.post('/evaluate', async (req, res) => {
  const { language, code, testCases } = req.body;

  if (!language || !code || !Array.isArray(testCases)) {
    return res.status(400).json({ error: 'Missing or invalid fields' });
  }

  try {
    const results = await Promise.all(
      testCases.map(async (test) => {
        try {
          const result = await runCode(language, code, test.input);
          const trimmedOutput = result.output.trim();
          const expected = test.expected.trim();

          return {
            input: test.input,
            expected: expected,
            output: trimmedOutput,
            passed: trimmedOutput === expected,
          };
        } catch (err) {
          return {
            input: test.input,
            expected: test.expected,
            output: err.message,
            passed: false,
          };
        }
      })
    );

    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: 'Server error during evaluation' });
  }
});

module.exports = router;
