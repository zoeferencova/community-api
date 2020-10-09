# Get User's User Information

Get all user information data associated with the User whose Token is provided with the request.

**URL** : `/api/users`

**Method** : `GET`

**Auth required** : YES

## Success Responses

**Condition** : Valid Authorization Token is provided with the request.

**Code** : `200 OK`

**Content** : 

```json
{
    "id": 2,
    "first_name": "James",
    "email": "james@gmail.com",
    "location": {
        "lat": 40.7532952,
        "lng": -73.9068973
    },
    "radius": "3.00"
}
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
