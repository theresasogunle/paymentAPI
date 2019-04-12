# Setting Up

This will guide you in setting up this project

## 1. Prisma Setup
This project runs on prisma, so you have to setup prisma

- To setup prisma locally using docker - [view this link](https://www.prisma.io/docs/1.30/get-started/01-setting-up-prisma-new-database-TYPESCRIPT-t002/)
- To setup prisma quickly without docker - [view this link](https://www.prisma.io/docs/get-started/01-setting-up-prisma-demo-server-TYPESCRIPT-t001/)

## 2. Environment Variables
We have 2 environment variables.

1. `test.env` - this is the environment variables that will run when we run our tests
2. `.env` - this is the environment variable that will run when we run the project

```bash
cp .env.example .env
cp .env.example test.env
```

> Environment Variables contains the following

- `PRISMA_ENDPOINT` - This is the endpoint you have after setting up prisma in [step1](#_1-prisma-setup)
- `MG_API_KEY` - Get this from mailgun dashboard
- `MG_DOMAIN` - Get this from mailgun dashboard
- `JWT_SECRET` - A secret used for encoding and decoding tokens
- `ENV` - You can set this to `PROD`, `TEST`

## 3. Run
Install dependencies and run the code
```bash
npm i
npm run dev
```