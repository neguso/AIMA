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

Request:
`http://api.aima.accesa.eu/v1/activities&[parameters]`

Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| key | string | A unique key required to access the service |
| auth | string | Authentication token |
