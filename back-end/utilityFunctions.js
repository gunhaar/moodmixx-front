const axios = require("axios");
const {config} = require('dotenv')
config()
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const redirect_uri = `https://moodmixx-69d867083ab3.herokuapp.com/redirect`;

const getToken = async (code) => {
  const tokenUrl = "https://accounts.spotify.com/api/token";
  const authorization = `Basic ${new Buffer.from(
    `${CLIENT_ID}:${CLIENT_SECRET}`
  ).toString("base64")}`;

  const headers = {
    'Authorization': authorization,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const data = new URLSearchParams();
  data.append("code", code);
  data.append("redirect_uri", redirect_uri);
  data.append("grant_type", "authorization_code");

  console.log('headers', headers)
  try {
    console.log('data', data)
    const response = await axios.post(tokenUrl, data, { headers });
    // 200 code indicates access token was properly granted
    if (response.status === 200) {
      const { access_token, refresh_token, expires_in } = response.data;
      return { access_token, refresh_token, expires_in };
    } else {
      console.error(`getToken failed: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error("getToken error:", error.message);
    return null;
  }
};

module.exports = getToken;
