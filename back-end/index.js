const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
const session = require("express-session");

const { config } = require("dotenv");
const getToken = require("./utilityFunctions");
config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

const redirect_uri = `https://moodmixx-69d867083ab3.herokuapp.com/redirect`;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

// Configure sessions with in-memory storage
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Secret used to sign the session ID cookie
    resave: false,
    saveUninitialized: false,
  })
);

let refreshToken = ""; // Store refresh token here

// Middleware to check token expiration
app.use((req, res, next) => {
  if (tokenExpired()) {
    refreshAccessToken();
  }
  next();
});

// Route to authorize with Spotify
app.get("/authorize", async (req, res) => {
  const state_key = createStateKey(15);
  const scope = process.env.SCOPE;

  // Store state key in session
  req.session.state_key = state_key;

  const authorizeUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${scope}&redirect_uri=${redirect_uri}&state=${state_key}`;

  console.log("authorize url", authorizeUrl);
  res.redirect(authorizeUrl);
});
// Route for handling redirect after authorization
app.get("/redirect", async (req, res) => {
  const { code, state } = req.query;
  if (state !== req.session.state_key) {
    return res.status(400).send("State mismatch");
  }

  try {
    const tokenData = await getToken(code);
    refreshToken = tokenData.refresh_token;

    console.log("token data", tokenData);
    // Here you can store the tokens in session or wherever you want
    req.session.refresh_token = refreshToken;
    req.session.access_token = tokenData.access_token;
    req.session.token_expiration = Date.now() + tokenData.expires_in * 1000;

    console.log("accessToken", tokenData.access_token);
    // Redirect or respond as needed
    return res.redirect(
      `https://moodmix.netlify.app/content?refresh_token=${refreshToken}&access_token=${
        tokenData.access_token
      }&token_expiration=${Date.now() + tokenData.expires_in * 1000}`
    );
  } catch (error) {
    console.error("Error during token retrieval:", error.message);
    return res.status(500).send("Token retrieval failed");
  }
});

// Route for getting playlist tracks
app.get("/playlistTracks", async (req, res) => {
  try {
    console.log("get playlist request");
    const accessToken = req.headers.authorization.split(" ")[1]; // Get access token from authorization header
    const playlist_id = "37i9dQZF1EP6YuccBxUcC1";
    const trackIds = await getPlaylistTracks(playlist_id, accessToken);
    res.json(trackIds);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ status: "fail", message: "failed to fetch playlist tracks" });
  }
});

// Route for adding a track
app.put("/addTrack", async (req, res) => {
  try {
    const { trackId, accessToken } = req.body.body;
    console.log("req.headers", req.body.body);
    //   const accessToken = req.body.accessToken; // Get access token from authorization header

    console.log("access token", accessToken);
    await addTrack(trackId, accessToken);
    res.json({ status: "success", message: "Track added" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "failed",
      message: "Failed to add track to liked songs",
    });
  }
});

// Route for removing a track
app.delete("/removeTrack", async (req, res) => {
    const { trackId, accessToken } = req.body.body;

  await removeTrack(trackId, accessToken);
  res.json({ status: "success", message: "Track removed" });
});

// Helper function to refresh access token
const refreshAccessToken = async () => {
  const { default: queryString } = await import("query-string");
  const tokenUrl = "https://accounts.spotify.com/api/token";
  const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
    "base64"
  );

  const response = await axios.post(
    tokenUrl,
    queryString.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  // Update refresh token and access token
  refreshToken = response.data.refresh_token;
  // Update access token expiration logic
};

// Helper function to check if access token is expired
const tokenExpired = () => {
  // Implement token expiration check logic
};

// Helper function to create state key
const createStateKey = (size) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let stateKey = "";
  for (let i = 0; i < size; i++) {
    stateKey += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return stateKey;
};

// Helper function to get playlist tracks
const getPlaylistTracks = async (playlist_id, accessToken) => {
  const url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // Parse response and extract track ids
  // item.track.name, .id, .album.images[0].url, .album.name, .artist.names

  const trackIds = response.data.items.map((item) => {
    return {
      id: item.track.id,
      preview_url: item.track.preview_url,
      name: item.track.name,
      album_name: item.track.album.name,
      album_cover: item.track.album.images[0].url,
      artist_names: item.track.artists.map((artist) => artist.name),
    };
  });
  return trackIds;
};

// Helper function to add a track
const addTrack = async (trackId, accessToken) => {
  try {
    console.log("trackid", trackId, "access token", accessToken);
    const url = `https://api.spotify.com/v1/me/tracks?ids=${trackId}`;
    await axios.put(url, null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (err) {
    // console.log('err', err)
  }
};

// Helper function to remove a track
const removeTrack = async (trackId, accessToken) => {
  const url = `https://api.spotify.com/v1/me/tracks?ids=${trackId}`;
  await axios.delete(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
