# PA Media Technical Test

An example api as per [the spec](https://gist.github.com/oliverdrew/93bc4ff677305bb5f15f1a0ec5d609f4)

### Running locally

You can start the application locally like this:

```bash
npm run docker
```

This will start a docker container containing the serverless-offline application with [src](./src) mounted in the correct location so recompilation still works.

#### API Documentation

When the application is running in docker, the [api documentation](http://localhost:3001) will be available. You can send requests to the locally running application from here.

#### Tests

You can run the unit tests with ```npm run test```.

To lint, do ```npm run lint``` ( or ```npm run lint -- --fix``` ).

Linting ( with fix ) will be run for staged files pre commit, and modified files will be restaged. Unit tests relating to changed files since the last commit are also run pre commit.

On push, all unit tests are run. Test coverage is calculated and evaluated against a ( 100% ) coverage level threshold.

Once the unit tests have run, [a coverage report](http://localhost:3001/coverage) will be available.
