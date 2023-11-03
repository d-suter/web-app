import "./app.scss";
import { elements, parseToken, REDIRECT_URI, State } from "./config";
import { default as SpotifyWebApi } from "spotify-web-api-js";
import { compareTwoStrings } from "string-similarity";

const token = parseToken();

if (!token) {
  window.location.href = REDIRECT_URI;
  throw 0;
}

// Remove access token from the URL
history.pushState(
  "",
  document.title,
  window.location.pathname + window.location.search
);

const api = new SpotifyWebApi();
api.setAccessToken(token);

const state = new State();

window.onSpotifyWebPlaybackSDKReady = async () => {
  const player = new Spotify.Player({
    name: "Spotiguess",
    getOAuthToken: (cb) => cb(token),
  });

  player.addListener("initialization_error", ({ message }) => {
    console.error(message);
  });

  player.addListener("authentication_error", ({ message }) => {
    console.error(message);
  });

  player.addListener("account_error", ({ message }) => {
    console.error(message);
  });

  const skipButton = document.getElementById('skip-button') as HTMLButtonElement;

  skipButton.addEventListener('click', async () => {
      await player.nextTrack();
  });

  player.addListener("playback_error", ({ message }) => {
    console.error(message);
  });

  player.addListener("player_state_changed", ({ track_window }) => {
    const currentTrackName = track_window.current_track.name;
    const openParenIndex = currentTrackName.indexOf('(');
    const special = openParenIndex !== -1 ? currentTrackName.slice(openParenIndex) : null;
    const name = openParenIndex !== -1 ? currentTrackName.slice(0, openParenIndex).trim() : currentTrackName;

    state.song = {
        name,
        artist: track_window.current_track.artists[0].name,
        special,
    };
  });


  player.addListener("ready", ({ device_id }) => {
    console.log("Ready with Device ID", device_id);
    api.transferMyPlayback([device_id], { play: true });
  });

  player.addListener("not_ready", ({ device_id }) => {
    console.log("Device ID has gone offline", device_id);
  });

  elements.guess.addEventListener("keyup", async (ev: KeyboardEvent) => {
    if (!state.song) return ev.preventDefault();

    const target = <HTMLInputElement>ev.target;
    const result = compareTwoStrings(
      target.value.toLowerCase(),
      state.song.name.toLowerCase()
    );

    if (result > 0.8) {
      state.points++;
      await player.nextTrack();
    }
  });

  await player.connect();
};

