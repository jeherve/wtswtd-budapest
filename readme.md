# What to see, what to do in Budapest?

<img src="https://travis-ci.org/jeherve/wtswtd-budapest">


### A list of things to do, and places to go in Budapest

### [The Map](bp-doh.geojson)

## License

GPL2+

## How to contribute

1. Fork the project
2. Add or edit a location by editing and following the format in `bp-doh.geojson` (hint, it's geoJSON)
3. Submit a pull request

## Validating the geoJSON

When you submit a pull request, it will automatically check to ensure your geoJSON is valid.

If you'd like to check yourself, you can run `./script/cibuild` locally, or pasting the contents of `bp-doh.geojson` into http://geojsonlint.com.

## How to find the lat/long of a location

Enter the address in the form on [this page](http://universimmedia.pagesperso-orange.fr/geo/loc.htm).

## Credits

- [DC WiFi Social](https://github.com/benbalter/dc-wifi-social) for the script used to validate the geoJSON
- [budapest.geojson](https://gist.github.com/ericholscher/8303554) for the idea, and the initial list of places
