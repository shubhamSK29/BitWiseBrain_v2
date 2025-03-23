const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
};

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { action, email, password } = req.body;
      console.log('Received request:', { action, email });

      // Create database connection
      const connection = await mysql.createConnection(dbConfig);

      if (action === 'register') {
        // Check if user exists
        const [users] = await connection.execute(
          'SELECT * FROM users WHERE email = ?',
          [email]
        );

        if (users.length > 0) {
          await connection.end();
          return res.status(400).json({ error: 'Email already exists' });
        }

        // Insert new user
        await connection.execute(
          'INSERT INTO users (email, password) VALUES (?, ?)',
          [email, password]
        );

        await connection.end();
        return res.status(201).json({ 
          message: 'User registered successfully',
          debug: { email }
        });
      }

      if (action === 'login') {
        const [users] = await connection.execute(
          'SELECT * FROM users WHERE email = ? AND password = ?',
          [email, password]
        );

        await connection.end();

        if (users.length > 0) {
          return res.status(200).json({ message: 'Login successful' });
        } else {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
      }

      await connection.end();
      return res.status(400).json({ error: 'Invalid action' });

    } catch (error) {
      console.error('API error:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        details: error.message 
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}; 