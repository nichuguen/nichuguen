"use strict";

const SPOTIFY_URL = "https://api.spotify.com/v1"

// returns the use's complete profile
// the accessToken is granted to a unique user so no other params
// are needed
async function getUserProfile(accessToken) {
    return makeRequest(SPOTIFY_URL + "/me", {}, accessToken);
}

async function createSpotifyPlaylist(artists, accessToken, playlistName, username) {
    let artistsObjects = await getAllArtists(artists, accessToken);
    let foundArtists = artistsObjects.filter(a => a != null);
    let artistsIds = foundArtists.map(a => a.uri.split(":")[2]);
    let songsURIs = getFeaturedSongsOfArtists(artistsIds, accessToken);
    let playlistId = await createPlaylist(playlistName, username, accessToken);

    fillPlaylist(playlistId, await songsURIs, accessToken);
}

async function fillPlaylist(playlistId, songsIDs, accessToken){
    let s = [];
    let i;
    const MAX_SLICE = 100;
    for(i = 0; i < songsIDs.length; i += MAX_SLICE) {
        let m = i + MAX_SLICE > songsIDs.length ? songsIDs.length:i+MAX_SLICE;
        console.log(i, m);
        let sliced = songsIDs.slice(i, m);
        s.push(addToPlaylist(playlistId, sliced, accessToken));
    }
    Promise.all(s);
}

async function addToPlaylist(playlistId, sliced, accessToken) {
    return makePostRequest(SPOTIFY_URL + '/playlists/' + playlistId + '/tracks' ,{
        uris: sliced,
    }, accessToken);
}


async function createPlaylist(name, username, accessToken) {
    return makePostRequest(SPOTIFY_URL+'/users/'+username+'/playlists',{
        name: name,
        public: false,
        collaborative: false,
    }, accessToken)
        .then(j => j.id);
}

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

function getFeaturedSongsOfArtist(artistURI, accessToken) {
    return makeRequest(SPOTIFY_URL+"/artists/"+artistURI + "/top-tracks",{
        country: "from_token",
    }, accessToken)
        .then(j => {
            return j.tracks;
        });
}

async function getAllArtists(artists, accessToken) {
    let stuff = [];
    artists.forEach( (item, _, _2) => {
        let get =getArtistId(item, accessToken);
        stuff.push(get);
    });
    stuff = await Promise.all(stuff);
    return stuff;
}

function getArtistId(artist, accessToken) {
    return makeRequest(SPOTIFY_URL+"/search", {
        q: artist,
        type: "artist",
        limit: 1,
    }, accessToken)
        .then(j => {
            if (j.artists.items.length > 0) {
                return j.artists.items[0];
            } else {
                return null;
            }
        });
}
