"use strict";

const SPOTIFY_URL = "https://api.spotify.com/v1"


async function getUserProfile(clientToken) {
    return makeRequest(SPOTIFY_URL + "/me", {}, clientToken)
        .then(u => u.id);
}

async function createSpotifyPlaylist(artists, clientToken, playlistName, username) {
    let artistsObjects = await getAllArtists(artists, clientToken);
    let foundArtists = artistsObjects.filter(a => a != null);
    let artistsIds = foundArtists.map(a => a.uri.split(":")[2]);
    let songsURIs = getFeaturedSongsOfArtists(artistsIds, clientToken);
    let playlistId = await createPlaylist(playlistName, username, clientToken);

    fillPlaylist(playlistId, await songsURIs, clientToken);
}

async function fillPlaylist(playlistId, songsIDs, clientToken){
    let s = [];
    let i;
    const MAX_SLICE = 5;
    for(i = 0; i < songsIDs.length; i += MAX_SLICE) {
        let m = i + MAX_SLICE > songsIDs.length ? songsIDs.length:i+MAX_SLICE;
        console.log(i, m);
        let sliced = songsIDs.slice(i, m);
        s.push(addToPlaylist(playlistId, sliced, clientToken));
    }
    Promise.all(s);
}

async function addToPlaylist(playlistId, sliced, clientToken) {
    return makePostRequest(SPOTIFY_URL + '/playlists/' + playlistId + '/tracks' ,{
        uris: sliced,
    }, clientToken);
}


async function createPlaylist(name, username, clientToken) {
    return makePostRequest(SPOTIFY_URL+'/users/'+username+'/playlists',{
        name: name,
        public: false,
        collaborative: false,
    }, clientToken)
    .then(j => j.id);
}

async function getFeaturedSongsOfArtists(artistURIs, clientToken) {
    let s = [];
    artistURIs.forEach(uri => {
        let songs = getFeaturedSongsOfArtist(uri, clientToken);
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

function getFeaturedSongsOfArtist(artistURI, clientToken) {
    return makeRequest(SPOTIFY_URL+"/artists/"+artistURI + "/top-tracks",{
        country: "from_token",
    }, clientToken)
    .then(j => {
        return j.tracks;
    });
}

async function getAllArtists(artists, clientToken) {
    let stuff = [];
    artists.forEach( (item, _, _2) => {
        let get =getArtistId(item, clientToken);
        stuff.push(get);
    });
    stuff = await Promise.all(stuff);
    return stuff;
}

function getArtistId(artist, clientToken) {
    return makeRequest(SPOTIFY_URL+"/search", {
        q: artist,
        type: "artist",
        limit: 1,
    }, clientToken)
        .then(j => {
            if (j.artists.items.length > 0) {
                return j.artists.items[0];
            } else {
                return null;
            }
        });
}

function makeRequest(address, params, clientToken){
    let requestParams = {
        headers: {
            "Authorization": "Bearer " + clientToken,
        }
    }

    let s = "?";

    for(var key in params) {
        s += `${key}=${encodeURIComponent(params[key])}&`
    }
    let response = fetch(address + s, requestParams)
        .then(r => { return r.json() });
    return response;
}

function makePostRequest(address, params, clientToken) {
    let requestParams = {
        method: 'POST',
        headers: {
            "Authorization": "Bearer " + clientToken,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    }

    let response = fetch(address, requestParams)
        .then(r => { return r.json() });
    return response;
}
