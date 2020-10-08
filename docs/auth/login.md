# Login

Used to collect a Token for a registered User.

**URL** : `/api/auth/login/`

**Method** : `POST`

**Auth required** : NO

**Data constraints**

```json
{
    "email": "[valid email address]",
    "password": "[password in plain text]"
}
```

**Data example**

```json
{
    "email": "example@example.com",
    "password": "Abcd123!"
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJpYXQiOjE2MDIxOTYyNjAsInN1YiI6ImphbWVzQGdtYWlsLmNvbSJ9.dZt6KK08u758KX0klU0xOROob_JWvfHMN6qgK0OgxMa",
    "user": {
        "id": 2,
        "first_name": "James",
        "email": "james@gmail.com",
        "password": "$2a$12$YCjloLSk7njYXdG5xnX1dOTvhObUR2EmiS.vwc9jIT7Hv0zGzHSTz",
        "location": "0101000020E61000002A15F99A0A7A52C0EC1D24FA6B604440",
        "radius": "4828.02"
    }
}
```

## Error Response

**Condition** : If "email" and "password" combination is wrong or if user with provided "email" does not exist.

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
    "error": "Incorrect email or password"
}
```
