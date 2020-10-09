# Delete User

Delete a user by ID.

**URL** : `/api/users/:id/`

**URL Parameters** : `id=[integer]` where `id` is the ID of the user to be deleted.

**Method** : `DELETE`

**Auth required** : YES

## Success Response

**Condition** : If the user exists.

**Code** : `204 NO CONTENT`

**Content** : `{}`

## Error Responses

**Condition** : If there is no user with the supplied ID.

**Code** : `404 NOT FOUND`

**Content**

```json
{
    "error": {
        "message": "User doesn't exist"
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

* If a user is deleted, all posts, messages, and chats that correspond with this user will be deleted as well.
