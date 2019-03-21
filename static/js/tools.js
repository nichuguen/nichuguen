// https://www.w3schools.com/js/js_cookies.asp
// sets a cook with a name, value and expiring number of days
function setCookie(cname, cvalue, exdays) {
    if (typeof exdays !== 'undefined'){
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    } else {
        document.cookie = cname + "=" + cvalue;
    }
}

// gets a cookie from a name
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript#8084248
// dec2hex :: Integer -> String
function dec2hex (dec) {
    return ('0' + dec.toString(16)).substr(-2)
}

// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript#8084248
// generateId :: Integer -> String
function generateId (len) {
    var arr = new Uint8Array((len || 40) / 2)
    window.crypto.getRandomValues(arr)
    return Array.from(arr, dec2hex).join('')
}

function setInCache(name, item) {
    sessionStorage.setItem(name, item);
}

function getInCache(name) {
    return sessionStorage.getItem(name);
}

function clearCache(){
    sessionStorage.clear();
}

function removeFromCache(name) {
    sessionStorage.removeItem(name);
}

// makes a get request to the address
// passes the clientToken in the headers
// the params are put at the end of the address
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

// makes a post request to the address
// passes the clientToken in the headers
// the params are put as json in the body of the request
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
