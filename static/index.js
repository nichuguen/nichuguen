
window.addEventListener('load', e => {
    let hashFragment = window.location.hash;

    let urlParams = new URLSearchParams(hashFragment.substring(1));
    console.log(urlParams.has('access_token'));

    if (urlParams.has('error'))
    {
        document.getElementById('message').innerHTML="error while authenticating, please retry";
    } else if (urlParams.has('access_token'))
    {
        let accessToken = urlParams.get('access_token');
        let tokenType = urlParams.get('token_type');
        let expiresIn = urlParams.get('expires_in');
        let state = urlParams.get('state');

        let html = `
                accessToken ${accessToken}
                tokenType ${tokenType}
                expiresIn ${expiresIn}
                state ${state}
            `;
        document.getElementById('message').innerHTML = html;
    }
}, false);

var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!'
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
        }
    },
    created() {
        console.log("created");
    }
})
