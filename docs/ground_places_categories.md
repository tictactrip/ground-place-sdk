# The different types of Ground places

Ground places are places that can belong to three categories:

- **StopCluster**: The largest entities, these are decisive places that can host from 1 to N `StopGroups`.

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
  }
}
```

- **StopGroup**: Entities attached to one or more `StopClusters` that can host from 1 to N `SegmentProviderStop`.

```json
{
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

- **SegmentProviderStop**: the smallest entities, it's always attached to at least one StopGroup and itt cannot be more than 70km away from its parent.

```json
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
```
