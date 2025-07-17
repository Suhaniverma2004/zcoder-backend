const executeRunner = require('../utils/executeRunner');

exports.run = async (req, res) => {
  const { language, code, stdin } = req.body;
  try {
    const output = await executeRunner(language, code, stdin);
    res.json({ output });
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
};
