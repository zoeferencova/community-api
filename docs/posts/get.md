# Get User's Posts

Get all post data associated with the User whose Token is provided with the request.

**URL** : `/api/posts/`

**Method** : `GET`

**Auth required** : YES

## Success Responses

**Condition** : Valid Authorization Token is provided with the request.

**Code** : `200 OK`

**Content** : 

```json
[
    {
        "id": 4,
        "user_id": 2,
        "post_type": "offer",
        "description": null,
        "urgency": null,
        "date_created": "2020-06-11T21:24:05.882Z",
        "location": {
            "lat": 40.7532952,
            "lng": -73.9068973
        },
        "radius": "3.00",
        "first_name": "James",
        "categories": [
            "Running errands",
            "Picking up supplies"
        ]
    },
    {
        "id": 41,
        "user_id": 2,
        "post_type": "request",
        "description": null,
        "urgency": "low",
        "date_created": "2020-10-02T21:37:25.225Z",
        "location": {
            "lat": 40.7532952,
            "lng": -73.9068973
        },
        "radius": "3.00",
        "first_name": "James",
        "categories": [
            "Running errands"
        ]
    }
]
```

## Error Responses

**Condition** : If there is no Authorization Token provided with the request.

**Code** : `401 UNAUTHORIZED`

**Content** : 

```json
{
    "error": "Missing bearer token"
}
```
### OR

**Condition** : If the provided Authorization Token is not valid.

**Code** : `401 UNAUTHORIZED`

**Content** : 

```json
{
    "error": "Unauthorized request"
}
```
