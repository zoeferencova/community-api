# Update Post

Update a post by ID.

**URL** : `/api/posts/:id/`

**URL Parameters** : `id=[integer]` where `id` is the ID of the post.

**Method** : `PATCH`

**Auth required** : YES

**Data constraints**

* Required fields: at least one of `description`, `urgency`, or `category_ids`

```json
{
    "description": "[description in plain text]",
    "urgency": "[urgency in plain text]",
    "category_ids": "[array of integers representing post categories]",
}
```

**Data example**

```json
{
    "description": "hi",
    "urgency": "high",
    "category_ids": [1, 5]
}
```

## Success Response

**Condition** : If everything is OK and all required fields are provided.

**Code** : `204 NO RESPONSE`

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

**Condition** : If none of the possible update fields are supplied.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "error": {
        "message": "Request body must contain either 'category_ids', 'description' or 'urgency'."
    }
}
```

### OR

**Condition** : If category ID's are present in the request but the array is empty.

**Code** : `404 BAD REQUEST`

**Content**

```json
{
    "error": {
        "message": "'category_ids' must include at least one value."
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
