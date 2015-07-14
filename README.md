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
| 404 | Requested resource not found |
| 500 | Server error |

### 4xx Error Codes

4xx errors come with the following error representation:

```
{
	code: [string],
	message: [string]
}
```

### 5xx Error Codes

5xx errors are not guaranteed they return an consumable JSON error representation.

## Naming Conventions

Services use **camelCase** naming convention for JSON property names. Names contains letters, digits and special characters '_' (underscore) and '$' (dollar sign). Names starts always with letters or special characters.


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
| fields | `string` | Comma separated list of identity properties to be retrieved |

#### Actions

- auth (default)
- info
- get
- resource


**` GET auth(user, password)`**

Search for an identity that match `user` and `password` and returns a token. The token can be used to call services method that require authentication.

Sample:

`/auth?key=12345&action=auth&user=ovidiu.negus@accesa.eu&password=secret`

Response:

```
{
	status: [string], // 'success' | 'fail'
	token: [string],
	expires: [date],
	identity: [string]
}
```


**`GET auth(token)`**

Check if `token` is valid.

Response:

```
{
	status: [string], // 'valid' | 'invalid'
	token: [string],
	expires: [date]
}
```


**`GET info(token, identity, fields)`**

Returns information about the supplied identity.

Sample:

`/auth?key=12345&action=auth&token=XYZ&identity=ovidiu.negus@accesa.eu&fields=FirstName,LastName,Avatar`

Response:

```
{
	field1,
	field2,
	...
}
```


**`GET get(token, identity, filter, order, skip, take, fields)`**

Get information about about identities. `filter` and `order` parameters are not yet supported.

Response:

```
{
	from: [number],
    count: [number],
    total: [number],
    identities: [
    	{ field1, field2, ... },
        ...
    ]
}
```

Sample:

`http://api.accesa.eu/v1/auth?key=12345&token=QWERT&action=get&filter=(JobPosition='Software Developer')&skip=60&take=20`

**`GET resource(token, identity, type)`**

Returns the requested resource type. Suported resource types: { avatar }

| Resource | Description |
| ----- | ----- |
| avatar | PNG image of the identity |


**`POST info`**

[draft proposal]
Allows you to store custom information associated to a identity. The information is visible to any authenticated user. Input value for the action is a list of key and value pairs.
The key and value are both `string` with key being limited to 64 characters and value to 1024.


#### Identity Fields

| Field | Type | Description |
| ----- | ------ | ----- |
| Identity | `string` | Identity key. |
| FirstName | `string` |  |
| LastName | `string` |  |
| Avatar | `string` | URL to identity avatar |
| Birthday | `date` |  |
| Email | `string` |  |
| Skype | `string` |  |
| Phone | `string` |  |
| JobPosition | `string` |  |
| OfficeLocation | `string` |  |
| Area | `string` |  |
| Custom.FieldName | `string` | Custom defined field |


### Projects Service

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
| fields | `string` | Comma separated list of project properties to be retrieved |


#### Actions

- get (default)


**`GET get(filter, order, skip, take, show)`**

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
| fields | `string` | Comma separated list of activity properties to be retrieved |

#### Actions

- get (default)

**`GET get(filter, order, skip, take, fields)`**

Get information about activities.

Response:

```
{
	[todo]
}
```
