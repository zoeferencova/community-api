# Get User's Chats

Get all chat data associated with the User whose Token is provided with the request.

**URL** : `/api/chats`

**Method** : `GET`

**Auth required** : YES

## Success Responses

**Condition** : Valid Authorization Token is provided with the request.

**Code** : `200 OK`

**Content** : 

```json
[
    {
        "id": 25,
        "user1": {
            "first_name": "Zoe",
            "id": 1
        },
        "user2": {
            "first_name": "James",
            "id": 2
        },
        "post": {
            "id": 4,
            "user_id": 2,
            "post_type": "offer",
            "description": null,
            "urgency": null,
            "date_created": "2020-06-11T21:24:05.882246"
        },
        "messages": [
            {
                "id": 285,
                "chat_id": 25,
                "sender_id": 1,
                "message_timestamp": "2020-09-17T18:22:47.088676",
                "message_content": "Hi James, I'm also based in Queens and I need help getting my medication from the pharmacy while I'm quarantining. Are you near the Duane Reade on Roosevelt Ave in Jackson Heights?"
            },
            {
                "id": 286,
                "chat_id": 25,
                "sender_id": 2,
                "message_timestamp": "2020-09-17T18:23:29.967525",
                "message_content": "Hey Zoe! Nice to meet you. Yes, I'm about half a mile from there."
            }
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
