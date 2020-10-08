# Delete User's Post

Delete a post by ID.

**URL** : `/api/posts/:id/`

**URL Parameters** : `id=[integer]` where `id` is the ID of the post to be deleted.

**Method** : `DELETE`

**Auth required** : YES

## Success Response

**Condition** : If the post exists and the user is authorized to delete the post.

**Code** : `204 NO CONTENT`

**Content** : `{}`

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
