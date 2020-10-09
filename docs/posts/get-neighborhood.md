# Get Posts in User's Neighborhood

Get all neighborhood post data associated with the User whose Token is provided with the request.

**URL** : `/api/posts/neighborhood-posts`

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
        ],
        "distance_from_user": "0"
    },
    {
        "id": 17,
        "user_id": 3,
        "post_type": "request",
        "description": null,
        "urgency": "medium",
        "date_created": "2020-09-16T21:09:57.136Z",
        "location": {
            "lat": 40.7432931,
            "lng": -73.9229366
        },
        "radius": "2.75",
        "first_name": "Anna",
        "categories": [
            "Dog walking",
            "Phone call",
            "Picking up supplies"
        ],
        "distance_from_user": "1750"
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
