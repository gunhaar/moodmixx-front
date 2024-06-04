import React from 'react';
import spotifyLogo from "./Spotify_Logo_RGB_White.png"; 

function Login() {
  const handleLogin = () => {
    window.location.href =
      process.env.NODE_ENV === "production"
        ? "https://moodmixx-69d867083ab3.herokuapp.com/authorize"
        : "https://moodmixx-69d867083ab3.herokuapp.com/authorize";
  };

  return (
    <div className="app">
      <h1 className="moodmixx-title">welcome to moodmixx!</h1>
      <button className="spotify-login-button" onClick={handleLogin}>
        <img src={spotifyLogo} alt="Spotify logo" />
        login
      </button>
    </div>
  );
}

export default Login;
