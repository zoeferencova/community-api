# Get Chat by ID

Get chat by chat ID.

**URL** : `/api/chats/:id/`

**URL Parameters** : `id=[integer]` where `id` is the ID of the chat.

**Method** : `GET`

**Auth required** : YES

## Success Responses

**Condition** : Chat exists and User is authorized to view this chat.

**Code** : `200 OK`

**Content** : 

```json
{
    "id": 65,
    "user1": {
        "first_name": "James",
        "id": 2
    },
    "user2": {
        "first_name": "Zoe",
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

**Condition** : If the chat does not exist.

**Code** : `404 NOT FOUND`

**Content**

```json
{
    "error": {
        "message": "Chat doesn't exist"
    }
}
```

### OR

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
