# Accesa Service Bus

The document contains a proposal for Accesa Service Bus interface.


## Accesa Services

- Identity
- Projects
- Timesheet


## Errors

Services use standard HTTP response codes to indicate success or failure of an API request.

| Status | Description |
| ----- | ----- |
| 200 | Ok |
| 400 | Invalid request or missing parameters |
| 401 | Unauthorized request, authentication token is missing or invalid |
| 403 | Forbidden, authenticated user doesn't have access to requested resource  |
| 500 | Server error |

### 4xx Error Codes

4xx errors come with the following error representation:

```
{
	code: [number],
	message: [string],
	<optional additional specific error information>
}
```

### 5xx Error Codes

5xx errors are not guaranteed they return an consumable JSON error representation.

## Naming Conventions

Services use **camelCase** naming convention for JSON property names.


## Services Specification

### Identity Service

`http://api.accesa.eu/v1/auth?...`

#### Parameters

| Name | Type | Description |
| ----- | ----- | ----- |
| key  | `string` | Application key required to access the service. Each client application has it's own key. |
| action | `string` | Action to be executed |
| user | `string` | User name |
| password | `string` | User password |
| token | `string` | Authentication token |

#### Actions

- auth
- info

**`auth(user, password)`**

Search for an identity that match `user` and `password` and returns a token. The token can be used to call services method that require authentication.

Response:

```
{
	status: [string], // 'success' | 'fail'
	token: [string],
	expires: [date],
	identity: [string]
}
```

Sample:

`http://api.accesa.eu/v1/auth?key=12345&action=auth&user=ovidiu.negus&password=secret`

**`auth(token)`**

Check if `token` is valid.

Response:

```
{
	status: [string], // 'valid' | 'invalid'
	token: [string],
	expires: [date]
}
```

**`info(identity)`**

Returns information about the identity.

Response:

```
{
	identity: [string],
	firstName: [string],
	lastName: [string]
}
```


### Projects Service

#### Request

`http://api.accesa.eu/v1/projects?...`

#### Parameters

| Name | Type | Description |
| ----- | ----- | ----- |
| key  | `string` | Application key required to access the service. Each client application has it's own key. |
| token | `string` | Authetication token |
| action | `string` | Action to be executed |
| filter | `string` | Filter expression used to retrieve projects |
| order | `string` | Order expression used to sort projects |
| skip | `number` | Records to skip from the result list. Value must be `>= 0`. Default value is `0` |
| take | `number` | Records to take from the result list. Value must be `> 0`, maximum value is `100`. Default value is `20` |
| show | `string` | List of project properties to be retrieved |


#### Actions

- get

##### get

**`get(filter, order, skip, take, show)`**

Get information about projects.

Response:

```
{
	from: [number],
    count: [number],
    total: [number],
    projects: [
    	{
        	field1,
            field2,
            ...
        },
        ...    
    ]
    
}
```

Sample:

`http://api.accesa.eu/v1/projects?key=12345&token=QWERT&action=get&filter=(id=23)&skip=60&take=20`


### Timesheet Service

Request

`http://api.accesa.eu/v1/timesheet?...`

Parameters

| Name | Type | Description |
| ----- | ----- | ----- |
| key  | `string` | A unique key required to access the service |
| token | `string` | Authetication token |
| action | `string` | Action to be executed |
| filter | `string` | Filter expression used to retrieve activities |
| order | `string` | Order expression used to sort activities |
| skip | `number` | Records to skip from the result list. Value must be `>= 0`. Default value is `0` |
| take | `number` | Records to take from the result list. Value must be `> 0`, maximum value is `100`. Default value is `20` |
| show | `string` | List of activity properties to be retrieved |

#### Actions

- get

##### get

**`get(filter, order, skip, take, show)`**

Get information about activities.

Response:

```
{
	[todo]
}
```


