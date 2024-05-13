# Document for the Original Access App

This repo contains the front end code and the serverless lambda function specifications for running the access application.

## Running the frontend application locally

To run the frontend application locally, you will need to have [nodejs](https://nodejs.org/en/download/) installed and [yarn](https://classic.yarnpkg.com/lang/en/docs/install/) then follow these steps to get up and running

```bash
cd access_frontned
yarn
yarn start
```

this should open the application at http://localhost:3000

## Deploying the serverless lambda functions

The part of the application that actually does the computation lives in the lambda_functions/ folder.

We use serverless to manage the deployment of these functions. To deploy your own version of the lambda functions, you will need to

- Install [nodejs](https://nodejs.org/en/download)
- Install [serverless](https://www.serverless.com/framework/docs/getting-started)
- Set up an AWS account
- Set up an [IAM user](https://www.serverless.com/framework/docs/providers/aws/guide/credentials) on that account with the required permissions
- Download the [credentials](https://www.serverless.com/framework/docs/providers/aws/guide/credentials) for that user and set up that profile on your local machine
- Set up an S3 bucket for the processing steps.
- Edit serverless.yml to point to the correct bucket and path

```yaml
environment:
  # Bucket that is used to store the data for the calculations
  ACCESS_BUCKET: "access-metrics-dev"
  # Path within the bucket to be used to store the data
  ACCESS_PATH: "jobs"
  REGION_NAME: "us-east-2"
```

- Install the [serverless-python-requirements](https://www.serverless.com/plugins/serverless-python-requirements)
- From the lambda_funcitons folder run `sls deploy` to deploy the application.
- This will give you an endpoint for the generated api. Note this down to be able to connect the frontend

## Connecting the frontend application and the backend application

We need to tell the front end application the URL of the API we just deployed. to do this we should only need to change one line of code

in the file access_frontned/src/Hooks/useJobRunner simply change the BASE_URL constant to be the one reported by serverless when you deployed.

```
const BASE_URL = "Your api endpoint"
```
