
## Description

Created using the framework NestJs with the following major libraries and purposes:
- passport - login local strategy
- jwt - user identification
- prisma - db interaction
- bcrypt - password encryption

## Considerations

Tasks belong to users (1 user to many tasks).

Didn't added the auditing columns for simplicity.

/signup - create user account
/login - returns a access token to interact with the tasks endpoints

## Requirements

- docker and docker-compose

## Installation

- docker-compose up -d

## Running the app

After installation can interact with [OpenApi generated interface in the browser](http://localhost:3000/api-docs)