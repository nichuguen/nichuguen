
## Demo Config
- Go to [https://developer.spotify.com/dashboard/applications](https://developer.spotify.com/dashboard/applications)
- Create a new Client ID
- Add `http://localhost:5000` as a redirect URI.
- Copy your Client ID
- `cp static/example-config.json static/config.json`
- Paste your Client ID in the config file:
  - `sed -i s/your_api_key/$YOUR_CLIENT_ID/ static/config.json`

## Serve the site
- Python 3
  `python3 -m http.server 5000 --bind 127.0.0.1`
- Python 2
  `python2 -m SimpleHTTPServer 5000`
