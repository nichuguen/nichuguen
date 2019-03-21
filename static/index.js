
var app = new Vue({
    el: '#app',
    data: {
        errorState: false,
        authState: false,
        authParams: {}
    },
    methods: {
        authorize: function() {
            fetch('./static/config.json')
                .then(response => {return response.json()})
                .then(data => {
                    let fullAddress = `${data.address}?client_id=${data.clientId}&response_type=${data.responseType}&redirect_uri=${data.redirectUri}&show_dialog=${data.showDialog}&scope=${data.scope}`;
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
        }
    },
    // called when the app is completely created
    // checks if the state is empty, error or auth
    mounted() {
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
            this.authState = true;
            // TODO: use cookies instead of anchor
            // window.location.hash = '';
        }
        else{
            this.resetAuthState();
        }
    }
})
