import React, { useState } from 'react'
import TinderCard from 'react-tinder-card'

const db = [
  {
    name: 'Richard Hendricks',
    url: './img/richard.jpg'
  },
  {
    name: 'Erlich Bachman',
    url: './img/erlich.jpg'
  },
  {
    name: 'Monica Hall',
    url: './img/monica.jpg'
  },
  {
    name: 'Jared Dunn',
    url: './img/jared.jpg'
  },
  {
    name: 'Dinesh Chugtai',
    url: './img/dinesh.jpg'
  }
]

function Simple () {
  const characters = db
  const [lastDirection, setLastDirection] = useState()

  const swiped = (direction, nameToDelete) => {
    console.log('removing: ' + nameToDelete)
    setLastDirection(direction)
  }

  const outOfFrame = (name) => {
    console.log(name + ' left the screen!')
  }

  return (
    <div>
      <link href='https://fonts.googleapis.com/css?family=Damion&display=swap' rel='stylesheet' />
      <link href='https://fonts.googleapis.com/css?family=Alatsi&display=swap' rel='stylesheet' />
      <h1>React Tinder Card</h1>
      <div className='cardContainer'>
        {characters.map((character) =>
          <TinderCard className='swipe' key={character.name} onSwipe={(dir) => swiped(dir, character.name)} onCardLeftScreen={() => outOfFrame(character.name)}>
            <div style={{ backgroundImage: 'url(' + character.url + ')' }} className='card'>
              <h3>{character.name}</h3>
            </div>
          </TinderCard>
        )}
      </div>
      {lastDirection ? <h2 className='infoText'>You swiped {lastDirection}</h2> : <h2 className='infoText' />}
    </div>
  )
}

export default Simple

// import React, { useState, useMemo, useRef } from 'react'
// import TinderCard from 'react-tinder-card'

// const db = [
//   {
//     album_cover: "https://i.scdn.co/image/ab67616d0000b27333b8541201f1ef38941024be",
//     album_name: "evermore",
//     preview_url: "https://p.scdn.co/mp3-preview/a53fb417cdb223b78bca6144fdb8ba24ec21ebb2?cid=6abcc9982c61471aa80eb04d331d9796",
//     artist_names: "Taylor Swift",
//     song_name: 'gold rush',
//   },
//   {
//     album_cover: "https://i.scdn.co/image/ab67616d0000b273f8553e18a11209d4becd0336",
//     album_name: "Melodrama",
//     artist_names: "Lorde",
//     preview_url: "https://p.scdn.co/mp3-preview/fa4496aca7ababab49280bebde9be00b1078182c?cid=6abcc9982c61471aa80eb04d331d9796",
//     song_name: "Hard Feelings"

//   },
//   {
//     album_cover: "https://i.scdn.co/image/ab67616d0000b2736d63fd3e1afa17b0d5563131",
//     album_name: "This Is What It Feels Like",
//     artist_names: "Gracie Abrams",
//     preview_url: "https://p.scdn.co/mp3-preview/9971c582b0fb3702a61963723e5c7dce69138449?cid=6abcc9982c61471aa80eb04d331d9796",
//     song_name: "Feels Like"
//   }
// ]

// function Advanced () {
//   const [currentIndex, setCurrentIndex] = useState(db.length - 1)
//   const [lastDirection, setLastDirection] = useState()
//   const [song, setSong] = useState()
//   // used for outOfFrame closure
//   const currentIndexRef = useRef(currentIndex)

//   const childRefs = useMemo(
//     () =>
//       Array(db.length)
//         .fill(0)
//         .map((i) => React.createRef()),
//     []
//   )

//   const updateCurrentIndex = (val) => {
//     setCurrentIndex(val)
//     currentIndexRef.current = val
//   }

//   const canGoBack = currentIndex < db.length - 1

//   const canSwipe = currentIndex >= 0

//   // set last direction and decrease current index
//   function stop() {
//     console.log("song from react:", song)
//     song.pause();
//     console.log("did this stop")
//   }

//   const swiped = (direction, nameToDelete, index, song_preview) => {
//     setLastDirection(direction)
//     updateCurrentIndex(index - 1)
//     stop();
//   }

//   const outOfFrame = (name, idx) => {
//     console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current)
//     // handle the case in which go back is pressed before card goes outOfFrame
//     currentIndexRef.current >= idx && childRefs[idx].current.restoreCard()
//     // TODO: when quickly swipe and restore multiple times the same card,
//     // it happens multiple outOfFrame events are queued and the card disappear
//     // during latest swipes. Only the last outOfFrame event should be considered valid
//   }

//   const swipe = async (dir) => {
//     if (canSwipe && currentIndex < db.length) {
//       await childRefs[currentIndex].current.swipe(dir) // Swipe the card!
//     }
//   }

//   // increase current index and show card
//   const goBack = async () => {
//     if (!canGoBack) return
//     const newIndex = currentIndex + 1
//     updateCurrentIndex(newIndex)
//     await childRefs[newIndex].current.restoreCard()
//   }

//   function StartButton({ song_preview }) {
//     function start() {
//       const audio = new Audio(song_preview);
//       console.log("song name:", song_preview)
//       audio.play()
//       setSong(audio)
//       console.log("is this playing lmao")
//     }

//     return (
//       <button onClick={start}>
//         play!
//       </button>
//     );
//   }

//   function StopButton() {
//     function stop() {
//       console.log("song from react:", song)
//       song.pause();
//       console.log("did this stop")
//     }

//     return (
//       <button onClick={stop}>
//         pause!
//       </button>
//     );
//   }

//   return (
//     <div>
//       <link 
//         href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=MuseoModerno:ital,wght@0,100..900;1,100..900&display=swap" 
//         rel="stylesheet"
//       />
//       <link
//         href='https://fonts.googleapis.com/css?family=Alatsi&display=swap'
//         rel='stylesheet'
//       />
//       <h1>moodmixx</h1>
//       <div className='cardContainer'>
//         {db.map((song, index) => (
//           <div>
//           <TinderCard
//             ref={childRefs[index]}
//             className='swipe'
//             key={song.song_name}
//             onSwipe={(dir) => swiped(dir, song.song_name, index, song.preview_url)}
//             onCardLeftScreen={() => outOfFrame(song.song_name, index)}
//           >
//             <div
//               style={{ backgroundImage: 'url(' + song.album_cover + ')' }}
//               className='card'
//             >
              
//               <h2>{song.song_name}</h2>
//               <p>
//                 {song.album_name} <br></br>
//                 {song.artist_names}
//               </p>
//             </div>
//             <StartButton song_preview={song.preview_url} />
//             {/* <StopButton /> */}
//           </TinderCard>
//           </div>
//         ))}
//       </div>
//       <div className='buttons'>
//         <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }} onClick={() => swipe('left')}>Swipe left!</button>
//         <button style={{ backgroundColor: !canGoBack && '#c3c4d3' }} onClick={() => goBack()}>Undo swipe!</button>
//         <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }} onClick={() => swipe('right')}>Swipe right!</button>
//       </div>
//       {lastDirection ? (
//         <h2 key={lastDirection} className='infoText'>
//           You swiped {lastDirection}
//         </h2>
//       ) : (
//         <h2 className='infoText'>
//           Swipe a card to get started!
//         </h2>
//       )}
//     </div>
//   )
// }

// export default Advanced

// import React, { useState, useMemo, useRef, useEffect } from 'react';
// import TinderCard from 'react-tinder-card'

// const db = [
//   {
//     album_cover: "https://i.scdn.co/image/ab67616d0000b27333b8541201f1ef38941024be",
//     album_name: "evermore",
//     preview_url: "https://p.scdn.co/mp3-preview/a53fb417cdb223b78bca6144fdb8ba24ec21ebb2?cid=6abcc9982c61471aa80eb04d331d9796",
//     artist_names: "Taylor Swift",
//     song_name: 'gold rush',
//   },
//   {
//     album_cover: "https://i.scdn.co/image/ab67616d0000b273f8553e18a11209d4becd0336",
//     album_name: "Melodrama",
//     artist_names: "Lorde",
//     preview_url: "https://p.scdn.co/mp3-preview/fa4496aca7ababab49280bebde9be00b1078182c?cid=6abcc9982c61471aa80eb04d331d9796",
//     song_name: "Hard Feelings"

//   },
//   {
//     album_cover: "https://i.scdn.co/image/ab67616d0000b2736d63fd3e1afa17b0d5563131",
//     album_name: "This Is What It Feels Like",
//     artist_names: "Gracie Abrams",
//     preview_url: "https://p.scdn.co/mp3-preview/9971c582b0fb3702a61963723e5c7dce69138449?cid=6abcc9982c61471aa80eb04d331d9796",
//     song_name: "Feels Like"
//   }
// ]

// function Advanced () {
//   const [songs, setSongs] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const [lastDirection, setLastDirection] = useState()
//   const [song, setSong] = useState()
//   // used for outOfFrame closure
//   const currentIndexRef = useRef(currentIndex)
 
//   useEffect(() => {
//     setCurrentIndex(songs.length - 1);
//   }, [songs]);

//   // Fetch songs from Flask on component mount
//   useEffect(() => {
//     fetch('http://127.0.0.1:8080/getDaylist')
//       .then(response => response.json())
//       .then(data => console.log(data))
//       .catch(error => console.error('Error fetching songs:', error));
//   }, []);
//   const childRefs = useMemo(
//     () =>
//       Array(db.length)
//         .fill(0)
//         .map((i) => React.createRef()),
//     []
//   )

//   const updateCurrentIndex = (val) => {
//     setCurrentIndex(val)
//     currentIndexRef.current = val
//   }

//   const canGoBack = currentIndex < db.length - 1

//   const canSwipe = currentIndex >= 0

//   // set last direction and decrease current index
//   function stop() {
//     console.log("song from react:", song)
//     song.pause();
//     console.log("did this stop")
//   }

//   const swiped = (direction, nameToDelete, index, song_preview) => {
//     setLastDirection(direction)
//     updateCurrentIndex(index - 1)
//     stop();
//   }

//   const outOfFrame = (name, idx) => {
//     console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current)
//     // handle the case in which go back is pressed before card goes outOfFrame
//     currentIndexRef.current >= idx && childRefs[idx].current.restoreCard()
//     // TODO: when quickly swipe and restore multiple times the same card,
//     // it happens multiple outOfFrame events are queued and the card disappear
//     // during latest swipes. Only the last outOfFrame event should be considered valid
//   }

//   const swipe = async (dir) => {
//     if (canSwipe && currentIndex < db.length) {
//       await childRefs[currentIndex].current.swipe(dir) // Swipe the card!
//     }
//   }

//   // increase current index and show card
//   const goBack = async () => {
//     if (!canGoBack) return
//     const newIndex = currentIndex + 1
//     updateCurrentIndex(newIndex)
//     await childRefs[newIndex].current.restoreCard()
//   }

//   function StartButton({ song_preview }) {
//     function start() {
//       const audio = new Audio(song_preview);
//       console.log("song name:", song_preview)
//       audio.play()
//       setSong(audio)
//       console.log("is this playing lmao")
//     }

//     return (
//       <button onClick={start}>
//         play!
//       </button>
//     );
//   }

//   function StopButton() {
//     function stop() {
//       console.log("song from react:", song)
//       song.pause();
//       console.log("did this stop")
//     }

//     return (
//       <button onClick={stop}>
//         pause!
//       </button>
//     );
//   }

//   return (
//     <div>
//       <link 
//         href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=MuseoModerno:ital,wght@0,100..900;1,100..900&display=swap" 
//         rel="stylesheet"
//       />
//       <link
//         href='https://fonts.googleapis.com/css?family=Alatsi&display=swap'
//         rel='stylesheet'
//       />
//       <h1>moodmixx</h1>
//       <div className='cardContainer'>
//         {db.map((song, index) => (
//           <div>
//           <TinderCard
//             ref={childRefs[index]}
//             className='swipe'
//             key={song.song_name}
//             onSwipe={(dir) => swiped(dir, song.song_name, index, song.preview_url)}
//             onCardLeftScreen={() => outOfFrame(song.song_name, index)}
//           >
//             <div
//               style={{ backgroundImage: 'url(' + song.album_cover + ')' }}
//               className='card'
//             >
              
//               <h2>{song.song_name}</h2>
//               <p>
//                 {song.album_name} <br></br>
//                 {song.artist_names}
//               </p>
//             </div>
//             <StartButton song_preview={song.preview_url} />
//             {/* <StopButton /> */}
//           </TinderCard>
//           </div>
//         ))}
//       </div>
//       <div className='buttons'>
//         <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }} onClick={() => swipe('left')}>Swipe left!</button>
//         <button style={{ backgroundColor: !canGoBack && '#c3c4d3' }} onClick={() => goBack()}>Undo swipe!</button>
//         <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }} onClick={() => swipe('right')}>Swipe right!</button>
//       </div>
//       {lastDirection ? (
//         <h2 key={lastDirection} className='infoText'>
//           You swiped {lastDirection}
//         </h2>
//       ) : (
//         <h2 className='infoText'>
//           Swipe a card to get started!
//         </h2>
//       )}
//     </div>
//   )
// }

// export default Advanced


// import React, { useState, useMemo, useEffect, useRef } from 'react';
// import TinderCard from 'react-tinder-card';

// function Advanced() {
//   const [songs, setSongs] = useState([]); // State to hold song data
//   const [currentIndex, setCurrentIndex] = useState(0); // Updated to start from 0
//   const [isLoading, setIsLoading] = useState(true);
//   const [lastDirection, setLastDirection] = useState();

//   const currentIndexRef = useRef(currentIndex);
//   const childRefs = useMemo(() => Array(songs.length).fill(0).map(() => React.createRef()), [songs.length]);

//   // useEffect(() => {
//   //   // Fetch song data from Flask API
//   //   fetch('/saveDaylist/') // Adjust the endpoint as needed
//   //     .then(response => { response.json() })
//   //     .then(data => {
//   //       console.log(data)
//   //       setSongs(data.song_info); // Update state with song data
//   //       setCurrentIndex(data.song_info.length - 1); // Set current index based on data length
//   //     });
//   // }, []);

//   useEffect(() => {
//     // Declare a boolean flag that we can use to cancel the API request.
//     let ignoreStaleRequest = false;

//     // Call REST API to get the post's information
//     fetch(`http://localhost:5000/`, { mode: 'no-cors', })
//       .then((response) => {
//         if (!response.ok) throw Error(response.statusText);
//         console.log(response)
//         return response.json();
//       })
//       .then((data) => {
//         // If ignoreStaleRequest was set to true, we want to ignore the results of the
//         // the request. Otherwise, update the state to trigger a new render.
//         if (!ignoreStaleRequest) {
//           console.log("LOOK HERE", data);
//           setIsLoading(false);
//           setSongs(data.song_info); // Update state with song data
//           setCurrentIndex(data.song_info.length - 1); // Set current index based on data length
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//         setIsLoading(false);
//       });

//     return () => {
//       // This is a cleanup function that runs whenever the Post component
//       // unmounts or re-renders. If a Post is about to unmount or re-render, we
//       // should avoid updating state.
//       ignoreStaleRequest = true;
//     };
//   }, []);


//   const updateCurrentIndex = (val) => {
//     setCurrentIndex(val);
//     currentIndexRef.current = val;
//   };

//   const canGoBack = currentIndex < songs.length - 1;
//   const canSwipe = currentIndex >= 0;

//   const swiped = (direction, nameToDelete, index) => {
//     setLastDirection(direction);
//     updateCurrentIndex(index - 1);
//   };

//   const outOfFrame = (name, idx) => {
//     console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
//     currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
//   };

//   const swipe = async (dir) => {
//     if (canSwipe && currentIndex < songs.length) {
//       await childRefs[currentIndex].current.swipe(dir);
//     }
//   };

//   const goBack = async () => {
//     if (!canGoBack) return;
//     const newIndex = currentIndex + 1;
//     updateCurrentIndex(newIndex);
//     await childRefs[newIndex].current.restoreCard();
//   };

//   return !isLoading ? (
//     <div>
//       {/* Existing layout and CSS links */}
//       <h1>Spotify Tinder Cards</h1>
//       <div className='cardContainer'>
//         {songs.map((song, index) => (
//           <TinderCard
//             ref={childRefs[index]}
//             className='swipe'
//             key={song.song_name}
//             onSwipe={(dir) => swiped(dir, song.song_name, index)}
//             onCardLeftScreen={() => outOfFrame(song.song_name, index)}
//           >
//             <div
//               style={{ backgroundImage: `url(${song.album_cover})` }}
//               className='card'
//             >
//               <h3>{song.song_name}</h3>
//               {/* Additional song details can be added here */}
//             </div>
//           </TinderCard>
//         ))}
//       </div>
//     </div>
//   ) : (
//     <span> Loading... </span>
//   );
// }

// export default Advanced;