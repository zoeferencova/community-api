# Update User

Update a user by ID.

**URL** : `/api/users/:id/`

**URL Parameters** : `id=[integer]` where `id` is the ID of the user.

**Method** : `PATCH`

**Auth required** : YES

**Data constraints**

* Required fields: at least one of `first_name`, `email`, `location`, `radius`, or `password`

```json
{
    "first_name": "[first name in plain text]",
    "email": "[email in plain text]",
    "location": "[object containing a lat decimal value and lng decimal value]",
    "radius": "[string containing radius decimal value]",
    "password": "[password in plain text]"
}
```

**Data example**

```json
{
    "first_name": "Zoe",
    "email": "zoe@example.com",
    "location": {
        "lat": 40.7532952,
        "lng": -73.9068973
    },
    "radius": "3.00",
    "password": "Update1!"
}
```

## Success Response

**Condition** : If everything is OK and at least one of the required fields are provided.

**Code** : `204 NO RESPONSE`

## Error Responses

**Condition** : If there is no post with the supplied ID.

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

**Condition** : If none of the possible update fields are supplied.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "error": {
        "message": "Request body must contain either 'first_name', 'email', 'password', location' or 'radius'."
    }
}
```

### OR

**Condition** : If the supplied email address already belongs to an account.

**Code** : `404 BAD REQUEST`

**Content**

```json
{
    "error": "Email address is taken"
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
