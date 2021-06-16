# Structure of a Ground places file

Ground places files that can be manipulated within the package must respect some important rules:

- File used must be in JSON format
- There can be only two types of interpretable places: the `StopGroups` and the `StopClusters`. They are detailed [here](https://github.com/tictactrip/ground-place-sdk/blob/master/docs/ground_places_categories.md).

## Example of a Ground places file in JSON

```json
{
  "c|FRstrasbou@u0ts2": {
    "unique_name": "strasbourg",
    "childs": ["g|FRststbi__@u0tkxd"],
    "serviced": "True",
    "has_been_modified": false,
    "warning": false,
    "country_code": "fr",
    "is_latest": true,
    "name": "Strasbourg, Grand-Est, France",
    "longitude": 7.74815,
    "latitude": 48.583,
    "type": "cluster"
  },
  "g|FRststbi__@u0tkxd": {
    "childs": [
      {
        "unique_name": null,
        "company_name": "flixbus",
        "name": "Strasbourg, Strasbourg - Bischheim",
        "latitude": 48.616228,
        "serviced": "True",
        "company_id": 5,
        "longitude": 7.719863,
        "id": "19528"
      }
    ],
    "name": "Strasbourg, Strasbourg - Bischheim",
    "longitude": 7.719863,
    "serviced": "True",
    "has_been_modified": false,
    "warning": false,
    "country_code": "fr",
    "latitude": 48.616228,
    "is_latest": true,
    "type": "group"
  }
}
```
