# Create User

Create a new user account if an account with the provided email doesn't already exist. Each email address can only have one account.

**URL** : `/api/users/`

**Method** : `POST`

**Auth required** : NO

**Data constraints**

* Required fields: `first_name`, `email` and `password`

```json
{
    "full_name": "[user full name in plain text]",
    "email": "[user email in plain text]",
    "password": "[password in plain text]"
}
```

**Data example**

```json
{
    "first_name": "Zoe",
    "email": "example@user.com",
    "password": "ExamplePassword1!"
}
```

## Success Response

**Condition** : If everything is OK and all required fields are provided.

**Code** : `201 CREATED`

**Header** : `Location: /api/users/:id`

**Content example**

```json
{
    "id": 53,
    "first_name": "Zoe",
    "email": "example@user.com",
    "location": null,
    "radius": null
}
```

## Error Responses

**Condition** : If one of the required fields is missing.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "error": "Missing 'email' in request body"
}
```

### OR

**Condition** : If there is already a User with the provided email address.

**Code** : `400 BAD REQUEST`

**Content**

```json
{
    "error": "Email already taken"
}
```
### OR

**Condition** : If the password does not comply with the required format.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "error": "Password must contain 1 upper case, lower case, number and special character"
}
```
