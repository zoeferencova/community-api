# Create Post

Create a post for the User whose Token is provided with the request.

**URL** : `/api/post/`

**Method** : `POST`

**Auth required** : YES

**Data constraints**

* Required fields: `post_type`, `category_ids`
* Optional fields: `description`, `urgency`

```json
{
    "post_type": "[type of post in plain text]",
    "category_ids": "[array of integers representing post categories]",
    "urgency": "[level of urgency in plain text]",
    "description": "[post description in plain text]",
}
```

**Data example**

```json
{
    "post_type": "request",
    "category_ids": [1, 2, 3],
    "urgency": "low",
    "description": "hi",
}
```

## Success Response

**Condition** : If everything is OK and all required fields are provided.

**Code** : `201 CREATED`

**Content example**

```json
{
    "id": 43,
    "user_id": 2,
    "post_type": "request",
    "description": "hi",
    "urgency": "low",
    "date_created": "2020-10-08T23:48:46.844Z",
    "location": {
        "lat": 40.7532952,
        "lng": -73.9068973
    },
    "radius": "3.00",
    "first_name": "James",
    "categories": [
        "Picking up supplies",
        "Running errands",
        "Phone call"
    ]
}
```

## Error Responses

**Condition** : If one of the required fields is missing.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "error": {
        "message": "Missing 'post_type' in request body"
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
