# AIMA Mobile Aplication

## Required Features
- create activity
- update activity
- delete activity
- show a message when list is empty
- logoff

## Optional Features
- user profile view
- settings view

## Service Specification

### Identity Service

#### Request

`http://api.accesa.eu/v1/auth&[parameters]`

#### Parameters

| Name | Type | Description |
| ----- | ----- | ----- |
| key  | string | A unique key required to access the service |
| action | string | Action to be executed |
| user | string | User name |
| password | string | |
| auth | string | Authentication token

#### Actions

- auth
- info

##### auth

`auth(user, password)`

Search for an identity that match `user` and `password` and returns a token. The token is used to call services method that require authentication.

`auth(token)`
Check if token is valid


Response

```
{
  token: [string],
  expires: [date],
  identity: [string]
}
```

### Activities Service

Request

`http://api.accesa.eu/v1/activities&[parameters]`

Parameters

| Name | Type | Description |
| ----- | ----- | ----- |
| key  | string | A unique key required to access the service |
| auth | string | Authentication token |
| skip | number | Data items to skip |
| take | number | Data items to take |
| order | string | |
| from | date | Dates interval start |
| to | date | Dates interval end |


