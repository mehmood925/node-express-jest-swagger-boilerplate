const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');

router.get('/auth/google', async (req, res) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/api/auth/callback', // Change this to your frontend callback URL
        queryParams: {
          prompt: 'consent', // Ensures Google always asks for account selection
          access_type: 'offline',
          response_type: 'code',
        },
      },
    });

    if (error) console.log({error: error.message});
    res.redirect(data.url); // Redirect user to Google login page
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/auth/callback', async (req, res) => {
  try {
    const { code } = req.query;
    let authResponse;
    if (code) {
      authResponse = await supabase.auth.exchangeCodeForSession(code);
    } else {
      const { access_token } = req.query;

      if (!access_token) {
          return res.status(400).json({ error: 'Access token is required' });
      }

      // Verify the token and get user details
      authResponse = await supabase.auth.getUser(access_token);
    }

    const {data, error} = authResponse;
    if (error) throw error;
    const user = {
      id: data.user.id,
      email: data.user.email,
      email_verified: data.user.user_metadata.email_verified,
      phone: data.user.phone,
      first_name: data.user.user_metadata.full_name.split(' ')[0],
      last_name: data.user.user_metadata.full_name.split(' ').slice(1).join(' '),
      image: data.user.user_metadata.avatar_url,
    }
    console.log({user})
    // Save or update user in local database
    // const [localUser, created] = await Users.findOrCreate({
    //   where: { email: user.email },
    //   defaults: {
    //     role_id: 2, // Set appropriate default role_id
    //     first_name: user.user_metadata.full_name.split(' ')[0],
    //     last_name: user.user_metadata.full_name.split(' ').slice(1).join(' '),
    //     email: user.email,
    //     image: user.user_metadata.avatar_url,
    //     gender: 'other', // Default value as it's required
    //     age: 0, // Default value as it's required
    //     timezone: 'UTC', // Default value as it's required
    //     email_verified: user.email_verified || false,
    //     is_active: true,
    //   },
    // });

    // if (!created) {
    //   // Update existing user with latest info
    //   await localUser.update({
    //     first_name: user.user_metadata.full_name.split(' ')[0],
    //     last_name: user.user_metadata.full_name.split(' ').slice(1).join(' '),
    //     image: user.user_metadata.avatar_url,
    //     email_verified: user.email_verified || false,
    //   });
    // }

    res.json({
      message: 'Authentication successful!',
      data: user,
      //user: localUser,
      // session: {
      //   access_token: session.access_token,
      //   refresh_token: session.refresh_token,
      // },
    });
  } catch (error) {
    console.error('Auth callback error:', error);
    res.status(400).json({
      error: error.message || 'Authentication failed',
    });
  }
});

router.post('/auth/verify', async (req, res) => {
  const { accessToken } = req.body;

  try {
    const { data: user, error } = await supabase.auth.getUser(accessToken);

    if (error) throw error;
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
