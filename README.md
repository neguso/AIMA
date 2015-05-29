# AIMA Mobile Aplication

The document contains a proposal for Accesa Service Bus interface.


## Services List

- Identity
- Projects
- Timesheet


## Service Specification

### Identity Service

#### Request

`http://api.accesa.eu/v1/auth?...`

#### Parameters

| Name | Type | Description |
| ----- | ----- | ----- |
| key  | string | Application key required to access the service. Each client application has it's own key |
| action | string | Action to be executed |
| user | string | User name |
| password | string | User password |
| token | string | Authentication token |

#### Actions

- auth
- info

##### auth

`auth(user, password)`

Search for an identity that match `user` and `password` and returns a token. The token is used to call services method that require authentication.

Response

```
{
  token: [string],
  expires: [date],
  identity: [string]
}
```

Sample

`http://api.accesa.eu/v1/auth?key=12345&action=auth&user=ovidiu.negus&password=secret`

`auth(token)`

Check if `token` is valid.

Response

```
{
  token: [string],
  expires: [date]
}
```

Field `expires` is `null` if the token has expired.

##### info

`info(identity)`

Returns information about the identity.

Response

```
{
  identity: [string],
	firstname: [string],
	lastname: [string]
}
```


### Timesheet Service

Request

`http://api.accesa.eu/v1/timesheet?...`

Parameters

| Name | Type | Description |
| ----- | ----- | ----- |
| key  | string | A unique key required to access the service |
| auth | string | Authentication token |
| action | string | Action to be executed |
| skip | number | Data items to skip |
| take | number | Data items to take |
| order | string | |
| from | date | Dates interval start |
| to | date | Dates interval end |


