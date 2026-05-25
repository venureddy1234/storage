const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

app.post('/signup', async (req, res) => {
  try {
    const { username, mobile } = req.body;

    if (!username || !mobile) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          username,
          mobile
        }
      ]);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }

    res.json({
      success: true,
      message: 'Signup successful'
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
