# Serverless Condition Plugin

This plugin allows you to conditionally enable or disable functions based on the current stage.

## Installation

```bash
npm install serverless-conditional-deployment --save-dev
```

## Usage

To use the plugin, add the following section to your `serverless.yml` file:

```yml
service: service-a

provider:
  name: aws
  runtime: nodejs16.x
  memorySize: 256
  timeout: 30
  region: us-east-1
  stage: ${opt:stage, 'dev'}

plugins:
  - serverless-conditional-deployment

functions:
  function-a:
    handler: index.handlerA
    deployment:
      - 'dev'
    events:
      - http:
          path: /functiona
          method: GET
  function-b:
    handler: index.handlerB
    deployment:
      - 'stg'
    events:
      - http:
          path: /functionb
          method: GET
  function-c:
    handler: index.handlerC
    deployment:
      - 'dev'
      - 'stg'
    events:
      - http:
          path: /functionc
          method: GET
```

The `functions` section defines each function with a `deployment` property. If a function does not have a `deployment` property, it will be deployed regardless of the current stage.

`deployment` variable can be any string as long as its valid `stage` in below command -

```bash
serverless deploy --stage={deployment}
```

At the time of deployment, if stage is `dev` the serverless will deploy all lambdas where `deployment` array has `dev` mentioned.

## Note

`serverless deploy --stage=dev` command will deploy all Lambdas in Dev invironment where deployment include `dev`. In the above example, `function-a` and `function-c` will be deployed. Suppose if you change deployment value and remove `dev` from the list, your lambda and gateway path will be distroyed as well.

## Usecase

- Keep different stack environment-wise while maintaining single serverless yml
- Many times only developer need to pick specific feature set but they require a lot of manual work to just push a subset of lambdas to another environment
- This plugin is basically promoting the lambdas to environment you would choose.
- Plugin will not act on all those lambdas where deployment is not mentioned. They are bascially untouched and will be deployed to your environment

## Running Tests

To run the tests, you first need to install the necessary dependencies by running the following command in the root directory of your project:

```bash
npm install
```

Once the dependencies are installed, you can run the tests by running the following command:

```bash
npm test
```

This will run the test suite using Mocha, a popular test framework for Node.js. The test results will be displayed in the console output. If any tests fail, you'll see an error message indicating which test failed and why.

Note that you can customize the test command and options in the package.json file. For example, you can change the test command to use a different test framework or specify additional options for Mocha
