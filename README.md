# PA Media Technical Test

An example api as per [the spec](https://gist.github.com/oliverdrew/93bc4ff677305bb5f15f1a0ec5d609f4)

The API allows the creation of lists and items within them ( ie, todo lists )

It is implemented as a serverless framework application, in which each endpoint is handled by an AWS lambda. However, the application and its dependencies run in docker containers for local development.

### Running locally

You can start the application locally like this:

```bash
npm run docker
```

This will start a docker container containing the serverless-offline application with [src](./src) mounted in the correct location so recompilation still works.

Whenever anything in the package.json changes, the image will rebuild on the next startup to ensure all dependencies are available in the image.

Although you dont need to do an ```npm install``` to run the dockerised application, you will need to for development - there are things that run pre commit and pre push that need the dependencies to be available.

###### API Documentation

When the application is running in docker, the [api documentation](http://localhost:3001) will be available, in a dockerised swagger-ui.

You can send requests to the locally running application from here.

### Tests

You can run the unit tests with ```npm run test```.

To lint, do ```npm run lint``` ( or ```npm run lint -- --fix``` ).

Linting ( with fix ) will be run for staged files pre commit, and modified files will be restaged. Unit tests relating to changed files since the last commit are also run pre commit.

On push, all unit tests are run. Test coverage is calculated and evaluated against a ( 100% ) coverage level threshold.

###### Coverage Report

Once the unit tests have run, [a coverage report](http://localhost:3001/coverage) will be available.

This is mounted in the nginx web server of the api documentation docker image, which can be run with ```npm run docker```

###### Integration Tests

You can run the integration tests with ```npm run integration```.

These tests will make a variety of requests to the **locally running** application, and make assertions on the response, so you'll need to do ```npm run docker``` before running them.

###### Complexity Analysis

It seems like it should be pretty straightforward to use [the eslint cyclometic complexity rule](https://eslint.org/docs/rules/complexity) - though this would require using a less opinionated linter than the one currently in use ( ie, so we have modify access to the rule set )

There are services ( eg SonarCube ) available in docker that can be used to statically analyse code for a variety of things, including complexity. However, from a cursory inspection none seem to support typescript 4 yet, similar to the packages in the npm registry that facilitate complexity analysis.
