"use strict";

const SPOTIFY_URL = "https://api.spotify.com/v1"

// returns the user's complete profile
// the accessToken is granted to a unique user so no other params
// are needed
async function getUserProfile(accessToken) {
    return makeRequest(SPOTIFY_URL + "/me", {}, accessToken);
}

// gathers all data needed to create a new playlist
// the playlist contains all top songs from selected artists
// and is created as a private playlist for the user passed as parameter
async function createSpotifyPlaylist(artists, accessToken, playlistName, username) {
    let artistsObjects = await searchAllArtists(artists, accessToken);
    let foundArtists = artistsObjects.filter(a => a != null);
    let artistsIds = foundArtists.map(a => a.id);
    let songsURIs = getFeaturedSongsOfArtists(artistsIds, accessToken);
    let playlistId = await createPlaylist(playlistName, username, accessToken);

    fillPlaylist(playlistId, await songsURIs, accessToken);
}

// adds all songs ids to the playlist
// if there are more than MAX_SLICE songs, multiple calls
// with at most MAX_SLICE songs are made
async function fillPlaylist(playlistId, songsURIs, accessToken){
    let s = [];
    let i;
    const MAX_SLICE = 100;
    for(i = 0; i < songsURIs.length; i += MAX_SLICE) {
        let m = i + MAX_SLICE > songsURIs.length ? songsURIs.length:i+MAX_SLICE;
        let sliced = songsURIs.slice(i, m);
        s.push(addToPlaylist(playlistId, sliced, accessToken));
    }
    Promise.all(s);
}

// adds songs from sliced array to the playlist
// sliced must be of at most MAX_SIZE elements
async function addToPlaylist(playlistId, sliced, accessToken) {
    return makePostRequest(SPOTIFY_URL + '/playlists/' + playlistId + '/tracks' ,{
        uris: sliced,
    }, accessToken);
}

// creates a private playlist named 'name' for the user with 'username'
// returns the playlist id
async function createPlaylist(name, username, accessToken) {
    return makePostRequest(SPOTIFY_URL+'/users/'+username+'/playlists',{
        name: name,
        public: false,
        collaborative: false,
    }, accessToken)
        .then(j => j.id);
}

// returns all top tracks for each artists in artists uri
// returns an array of songs uri
async function getFeaturedSongsOfArtists(artistURIs, accessToken) {
    let s = [];
    artistURIs.forEach(uri => {
        let songs = getFeaturedSongsOfArtist(uri, accessToken);
        s.push(songs);
    });
    s = await Promise.all(s);
    let flattened = [];
    s.forEach(si => {
        flattened = flattened.concat(si);
    });
    flattened = flattened.map(f => f.uri);
    return flattened;
}

// returns top tracks for the artist
// returns an array of track objects
function getFeaturedSongsOfArtist(artistURI, accessToken) {
    return makeRequest(SPOTIFY_URL+"/artists/"+artistURI + "/top-tracks",{
        country: "from_token",
    }, accessToken)
        .then(j => {
            return j.tracks;
        });
}

// searches for all artists
// returns an array of either null or artist objects
async function searchAllArtists(artists, accessToken) {
    let stuff = [];
    artists.forEach( (item, _, _2) => {
        let get =searchForArtist(item, accessToken);
        stuff.push(get);
    });
    stuff = await Promise.all(stuff);
    return stuff;
}

// search for the artist using the search endpoint
// either null or one object is returned
function searchForArtist(artist, accessToken, limit) {
    if(typeof limit === 'undefined') {
        limit = 1;
    }
    return makeRequest(SPOTIFY_URL+"/search", {
        q: artist,
        type: "artist",
        limit: limit,
    }, accessToken)
        .then(j => j.artists.items);
}
