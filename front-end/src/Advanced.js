import axios from "axios";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import TinderCard from "react-tinder-card";
function Advanced() {
  const location = useLocation();
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastDirection, setLastDirection] = useState();
  const [song, setSong] = useState(null);
  const audioRef = useRef(new Audio());
  const currentIndexRef = useRef(currentIndex);
  const childRefs = useMemo(
    () =>
      Array(songs.length)
        .fill(0)
        .map(() => React.createRef()),
    [songs.length]
  );

  const [refreshToken, setRefereshToken] = useState(null);
  const [at, setAT] = useState(null);
  const [tokenExp, setTokenExp] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const refreshToken = searchParams.get("refresh_token");
    const accessToken = searchParams.get("access_token");
    const tokenExpiration = searchParams.get("token_expiration");

    setAT(accessToken);
    setRefereshToken(refreshToken);
    setTokenExp(tokenExpiration);

    console.log({ accessToken, refreshToken, tokenExpiration });
    // Do something with the session data
  }, [location.search]);

  useEffect(() => {
    return () => {
      audioRef.current.pause();
    };
  }, []);

  useEffect(() => {
    if (at) {
      // Add access token to all fetch API calls
      fetchDaylist();
    }
  }, [at]);

  const fetchDaylist = async () => {
    setIsLoading(true);
    try {
      console.log("at", at);
      const response = await axios.get("https://moodmixx-69d867083ab3.herokuapp.com/playlistTracks", {
        headers: {
          Authorization: `Bearer ${at}`,
          "access-control-allow-origin": "*",
        },
      });
      const data = response.data;
      const thankYouCard = {
        song_name: "Thank You for Playing!",
        album_cover: "https://eecs441soloway.github.io/images/soloway.jpg",
        album_name: "We hope you enjoyed the experience.",
        artist_names: "- MoodMixx Team",
        isThankYouCard: true,
      };

      console.log("settign songs", data);
      setSongs([thankYouCard, ...data]);
      setCurrentIndex(data.length);
    } catch (error) {
      console.error("Error fetching daylist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < songs.length - 1;

  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index
  function stop() {
    audioRef.current.pause();
  }

  const swiped = (direction, nameToDelete, index, song_preview, track_id) => {
    console.log("swiped track id", track_id);
    setLastDirection(direction);
    updateCurrentIndex(index-1); // Update currentIndex without incrementing
    stop();
    if (direction === "right") {
      console.log({
        Authorization: `Bearer ${at}`,
        "access-control-allow-origin": "*",
        "Content-Type": "application/json",
      });

      console.log("track id", track_id);
      // Make a POST request to the server to add track to Spotify library
      axios
        .put("https://moodmixx-69d867083ab3.herokuapp.com/addTrack", {
          headers: {
            Authorization: `Bearer ${at}`,
            "access-control-allow-origin": "*",
            "Content-Type": "application/json",
          },
          body: { trackId: track_id, accessToken: at },
        })
        .then((response) => response.json())
        .then((data) => {
          console.log(data); // You can process server response here
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else if (direction === "left") {
      console.log({
        Authorization: `Bearer ${at}`,
        "access-control-allow-origin": "*",
        "Content-Type": "application/json",
      });

      console.log("track id", track_id);
      // Make a POST request to the server to add track to Spotify library
      axios
        .put("https://moodmixx-69d867083ab3.herokuapp.com/removeTrack", {
          headers: {
            Authorization: `Bearer ${at}`,
            "access-control-allow-origin": "*",
            "Content-Type": "application/json",
          },
          body: { trackId: track_id, accessToken: at },
        })
        .then((response) => response.json())
        .then((data) => {
          console.log(data); // You can process server response here
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    // handle the case in which go back is pressed before card goes outOfFrame
    // currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  };

  const swipe = async (dir) => {
    if (currentIndex >= -1 && currentIndex < songs.length) {
      if (currentIndex === -1) {
        updateCurrentIndex(0); // Set currentIndex to 0 if it's -1
      }
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    } else {
      console.log("Can't swipe", currentIndex);
    }
  };

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    stop();
    await childRefs[newIndex].current.restoreCard();
  };

  function StartButton({ song_preview }) {
    function start() {
      if (song) {
        song.pause(); // Ensures any currently playing song is stopped
        song.currentTime = 0; // Resets the playback position
      }
      const audio = new Audio(song_preview);
      audio.play();
      setSong(audio);
    }

    return (
      <button className="play-button" onClick={start}>
        Play!
      </button>
    );
  }

  function StopButton() {
    function stop() {
      console.log("song from react:", song);
      song.pause();
      console.log("did this stop");
    }

    return (
      <button className="pause-button" onClick={stop}>
        Pause!
      </button>
    );
  }

  useEffect(() => {
    console.log("can swipe", canSwipe);
  }, [canSwipe]);

  return (
    <div style={{maxHeight: "100vh"}}>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=MuseoModerno:ital,wght@0,100..900;1,100..900&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Alatsi&display=swap"
        rel="stylesheet"
      />
      <h1 className="moodmixx-title">moodmixx</h1>
      <div className="cardContainer">
        {songs.map((song, index) => (
          <div>
            <TinderCard
              ref={childRefs[index]}
              className="swipe"
              key={song.song_name}
              onSwipe={(dir) =>
                swiped(dir, song.name, index, song.preview_url, song.id)
              }
              onCardLeftScreen={() => outOfFrame(song.name, index)}
            >
              <div
                style={{ backgroundImage: "url(" + song.album_cover + ")" }}
                className="card"
              >
                <h2>{song.name}</h2>
                <p>
                  {song.album_name} <br></br>
                  {song.artist_names}
                </p>
              </div>
              <StartButton song_preview={song.preview_url} />
              {<StopButton />}
            </TinderCard>
          </div>
        ))}
      </div>
      <div className="buttons">
        <button
          style={{ backgroundColor: !(currentIndex >= 0) && "#c3c4d3" }}
          onClick={() => swipe("left")}
        >
          Swipe left!
        </button>
        <button
          style={{ backgroundColor: !(currentIndex < songs.length - 1) && "#c3c4d3" }}
          onClick={() => goBack()}
        >
          Undo swipe!
        </button>
        <button
          style={{ backgroundColor: !(currentIndex >= 0) && "#c3c4d3" }}
          onClick={() => swipe("right")}
        >
          Swipe right!
        </button>
      </div>
      {lastDirection ? (
        <h2 key={lastDirection} className="infoText">
          You swiped {lastDirection}
        </h2>
      ) : (
        <h2 className="infoText">Swipe a card to get started!</h2>
      )}
    </div>
  );
}

export default Advanced;
