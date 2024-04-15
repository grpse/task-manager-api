
## Description

Created using the framework NestJs with the following major libraries and purposes:
- passport - login local strategy
- jwt - user identification
- prisma - db interaction
- bcrypt - password encryption

## Considerations

(Don't)s for simplicity:
- Didn't added the auditing columns or history tables;
- Bearer authentication with JWT with salted password;
- Prisma for data access layer (services), but understand the perf issues it might have;
- bcrypt

Auth
- POST /signup - create user account
- POST /login - returns a access token to interact with the tasks endpoints

Tasks
- POST /tasks - create a new task
- GET /tasks - retrive current logged in user tasks
- PATCH /tasks/:taskId - update the tasks with id

## Data structure
User 1 -> * Tasks

## Requirements

- docker and docker-compose
- node >18
- npm

## Installation

```bash
cd task-manager-api
docker-compose up -d
```

## Running the app local

build and run
```bash
npm install && npm run build && npm run start
```

run dev env
```bash
npm install && npm run start:dev
```

After installation can interact with [OpenApi generated interface in the browser](http://localhost:3000/api-docs)