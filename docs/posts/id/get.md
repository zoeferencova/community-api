# Get Post by ID

Get post by post ID.

**URL** : `/api/posts/:id/`

**URL Parameters** : `id=[integer]` where `id` is the ID of the post.

**Method** : `GET`

**Auth required** : YES

## Success Responses

**Condition** : Post exists.

**Code** : `200 OK`

**Content** : 

```json
{
    "id": 44,
    "user_id": 2,
    "post_type": "request",
    "description": "hi",
    "urgency": "high",
    "date_created": "2020-10-08T23:54:59.209Z",
    "location": {
        "lat": 40.7532952,
        "lng": -73.9068973
    },
    "radius": "3.00",
    "first_name": "James",
    "categories": [
        "Picking up supplies",
        "Dog walking"
    ]
}
```

## Error Responses

**Condition** : If there is no post with the supplied ID.

**Code** : `404 NOT FOUND`

**Content**

```json
{
    "error": {
        "message": "Post doesn't exist"
    }
}
```

### OR

**Condition** : If there is no Authorization Token provided with the request.

**Code** : `401 UNAUTHORIZED`

**Content**

```json
{
    "error": "Missing bearer token"
}
```

### OR

**Condition** : If the provided Authorization Token is not valid.

**Code** : `401 UNAUTHORIZED`

**Content**

```json
{
    "error": "Unauthorized request"
}
```
