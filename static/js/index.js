"use strict";

const CONFIG_FILE = './static/config/config.json'

var app = new Vue({
    el: '#app',
    data: {
        errorState: false,
        authState: false,
        authParams: {},
        artists: [],
        currentArtist: "",
        playlistName: "",
        user: "",
    },
    methods: {
        authorize: function() {
            fetch(CONFIG_FILE)
                .then(response => {return response.json()})
                .then(data => {
                    let state = generateId(10);
                    setCookie("state", state);
                    let fullAddress = `${data.address}?client_id=${data.clientId}&response_type=${data.responseType}&redirect_uri=${data.redirectUri}&show_dialog=${data.showDialog}&scope=${data.scope}&state=${state}`;
                    //fullAddress = encodeURIComponent(fullAddress);
                    window.location.replace(fullAddress);
                })
                .catch(console.log);
        },
        resetAuthState: function() {
            delete this.authParams['access_token'];
            delete this.authParams['token_type'];
            delete this.authParams['expires_in'];
            delete this.authParams['state'];
            this.authState = false;
        },
        addArtist: function() {
            if(!this.isArtistValid(this.currentArtist)){
                return;
            }
            this.artists.push(this.currentArtist.toLowerCase());
            this.currentArtist = "";

            this.artists = [...new Set(this.artists)].sort();
        },
        removeArtists: function() {
            this.artists = [];
        },
        removeArtist: function(index) {
            this.artists.splice(index,1);
        },
        isArtistValid: function(artist) {
            return artist != '';
        },
        createPlaylist: function() {
            createSpotifyPlaylist(this.artists, this.authParams['access_token'], this.playlistName, this.user);
        }
    },
    // called when the app is completely created
    // checks if the state is empty, error or auth
    async mounted() {
        // errors happen in the GET parameters of the URL
        let getParams = new URLSearchParams(window.location.search);
        if(getParams.has('error')){
            this.errorState = true;
            this.authState = false;
            return;
        }
        this.errorState = false;

        // non error state in the anchor of the URL
        let hashFragment = window.location.hash;
        let urlParams = new URLSearchParams(hashFragment.substring(1));

        if (urlParams.has('access_token'))
        {
            this.authParams['access_token'] = urlParams.get('access_token');
            this.authParams['token_type'] = urlParams.get('token_type');
            this.authParams['expires_in'] = urlParams.get('expires_in');
            this.authParams['state'] = urlParams.get('state');

            let state = getCookie('state');
            if (state != this.authParams['state']){
                this.resetAuthState();
                return;
            }

            this.authState = true;
            // TODO: use cookies instead of anchor
            // window.location.hash = '';
            let userProfile = await getUserProfile(this.authParams['access_token']);
            this.user = userProfile.id;
        }
        else{
            this.resetAuthState();
        }
    }
})
