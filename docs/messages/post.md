# Create Message

Create a message for the User whose Token is provided with the request.

**URL** : `/api/messages/`

**Method** : `POST`

**Auth required** : YES

**Data constraints**

* Required fields: `chat_id` and `message_content`

```json
{
    "chat_id": "[ID of chat as an integer]",
    "message_content": "[content of the message in plain text]"
}
```

**Data example**

```json
{
    "chat_id": "65",
    "message_content": "Hi"
}
```

## Success Response

**Condition** : If everything is OK and all required fields are provided.

**Code** : `201 CREATED`

**Content example**

```json
{
    "id": 370,
    "chat_id": 65,
    "sender_id": 2,
    "message_timestamp": "2020-10-08T23:26:47.482Z",
    "message_content": "hi"
}
```

## Error Responses

**Condition** : If one of the required fields is missing.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "error": {
        "message": "Missing 'chat_id' in request body"
    }
}
```

### OR

**Condition** : If there is no chat with the supplied chat ID.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "error": {
        "message": "There is no chat with an id of 65"
    }
}
```

### OR

**Condition** : If the requesting user is not part of the chat with the supplied ID.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "error": {
        "message": "Current user is not part of the chat with the id of 65"
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
