import { useEffect } from 'react';
import './App.css';
import Login from './Login';
import { getTokenFromResponse } from './spotify';
import Player from './Player';
import {useDataLayerValue} from './DataLayer'
import SpotifyWebApi from 'spotify-web-api-js';

const spotify = new SpotifyWebApi();

function App() {
const [{token}, dispatch] = useDataLayerValue();

useEffect(() => {
  const hash = getTokenFromResponse ();
  window.location.hash = ""
  let _token = hash.access_token;

if (_token) {
  spotify.setAccessToken(_token);
  dispatch ({
    type: "SET_TOKEN",
    token: _token,
  })

  spotify.getMe().then((user) => {
    dispatch({
      type:'SET_USER',
      user: user, 
    })
  })
  spotify.getUserPlaylists().then ((playlists) => {
    dispatch({
      type: "SET_PLAYLISTS",
      playlists: playlists,
    })
  })

  spotify.getMyTopArtists().then((response) =>
    dispatch({
      type: "SET_TOP_ARTISTS",
      top_artists: response,
    })
  )
  dispatch({
    type: "SET_SPOTIFY",
    spotify: spotify,
  });

  spotify.getMyCurrentPlayingTrack().then((response) =>
    dispatch({
      type: "SET_PLAYING",
      playing: response,
    })
  )
  spotify.getPlaylist("37i9dQZEVXcXyegUkmMPxt").then(response => 
    dispatch({
      type: "SET_DISCOVER_WEEKLY",
      discover_weekly: response,
    }))
}

}, [token, dispatch])

  return (
    <div className="app">
      {
        token ? (
          <Player spotify={spotify}/>
        ) : (
          <Login />
        )
      }
    </div>
  );
}
export default App;
