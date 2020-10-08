# Delete User's Chat

Delete a chat by ID.

**URL** : `/api/chats/:id/`

**URL Parameters** : `id=[integer]` where `id` is the ID of the chat to be deleted.

**Method** : `DELETE`

**Auth required** : YES

## Success Response

**Condition** : If the chat exists and the user is authorized to delete the chat.

**Code** : `204 NO CONTENT`

**Content** : `{}`

## Error Responses

**Condition** : If there is no chat with the supplied ID.

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

## Notes

* If a chat is deleted, all messages that correspond with this PM will be deleted as well.
