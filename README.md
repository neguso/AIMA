# Accesa Service Bus

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
| key  | string | Application key required to access the service. Each client application has it's own key. |
| action | string | Action to be executed |
| user | string | User name |
| password | string | User password |
| token | string | Authentication token |

#### Actions

- auth
- info

##### auth

**`auth(user, password)`**

Search for an identity that match `user` and `password` and returns a token. The token is used to call services method that require authentication.

Response:

```
{
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
	token: [string],
	expires: [date]
}
```

Field `expires` is `null` if the token has expired.


##### info

**`info(identity)`**

Returns information about the identity.

Response:

```
{
	identity: [string],
	firstname: [string],
	lastname: [string]
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


