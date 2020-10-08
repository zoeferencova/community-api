# Confirm Password

Confirm that a provided password is correct (used for password change form).

**URL** : `/api/auth/confirm-password`

**Method** : `POST`

**Auth required** : YES

**Data constraints**

* Required field: `password`

```json
{
    "password": "[password in plain text]"
}
```

**Data example**

```json
{
	  "password": "Abcd1234!",
}
```

## Success Response

**Condition** : If provided password matches the user's password in the database.

**Content example**

`"correct"`

## Error Responses

**Condition** : If provided password doesn't match the user's password in the database.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "error": "Incorrect old password"
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
