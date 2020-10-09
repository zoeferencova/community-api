# Create Chat

Create a chat for the User whose Token is provided with the request.

**URL** : `/api/chats/`

**Method** : `POST`

**Auth required** : YES

**Data constraints**

* Required fields: `user2Id` and `postId`

```json
{
    "user2Id": "[ID of receiver as integer]",
    "postId": "[ID of post that initiated chat as integer]"
}
```

**Data example**

```json
{
    "user2Id": "1",
    "postId": "1"
}
```

## Success Response

**Condition** : If everything is OK and all required fields are provided.

**Code** : `201 CREATED`

**Content example**

```json
{
    "id": 65,
    "user1": {
        "first_name": "James",
        "id": 2
    },
    "user2": {
        "first_name": "Test",
        "id": 1
    },
    "post": {
        "id": 4,
        "user_id": 2,
        "post_type": "offer",
        "description": null,
        "urgency": null,
        "date_created": "2020-06-11T21:24:05.882246"
    }
}
```

## Error Responses

**Condition** : If one of the required fields is missing.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "error": {
        "message": "Missing 'user2Id' in request body"
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
