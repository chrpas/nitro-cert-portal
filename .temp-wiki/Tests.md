## Backend tests
Backend tests are built using  [MSTest](https://learn.microsoft.com/en-us/visualstudio/test/using-microsoft-visualstudio-testtools-unittesting-members-in-unit-tests?view=vs-2022) and [FakeItEasy](https://fakeiteasy.github.io/).

**Unit tests** can be found in `Avensia.Common.Tests`. You can run tests in three ways:
1. Using Visual studio (find the Test menu and choose "Run")
2. With `nitro test`
3. With `dotnet test` (in same folder as *.sln or *.csproj)

> :warning: Although tests are run on TeamCity for every build, failed tests won't fail the build. This is due to a shortcoming in the buildsystem, where status codes are not properly propagated. There is a [PR to fix this](https://github.com/avensia/nitro5-packages/pull/214).

Note that also nitro5-packages has unit and integration tests. 

## Frontend tests
Frontend tests are built using [Jest](https://jestjs.io/). Run them with `nitro frontend:test`.

If you get any snapshot failing, but you are happy with the output you get you just run `nitro frontend:test-update` and commit the updated snapshot files. Next time the tests run they will validate against these new snapshots.

## Automated UI tests
Nitro contains automated UI tests using Cypress, see the [automation_tests](https://github.com/avensia/nitro5/tree/develop/automation_tests) folder in the root.

Tests can be run both with- and without UI, and videos will be recorded during the tests. Currently all tests are executed against https://nitro5-demo.avensia.com, so projects need to modify the urls and selectors in `automation_tests/cypress/selectors`.

To run the automated tests:
1. `cd automation_tests`
2. `yarn`
3. `cypress run`

You can also use `cypress open` to open the cypress window.

Also see: https://github.com/avensia/nitro5/pull/149

## Load tests
The idea with **load tests** is to make a stress test on the system to find breaking points and see how the application performs under load.
Load testing a Nitro site can be done with K6, see [Load testing with K6](https://github.com/avensia/nitro5/wiki/Load-testing-with-K6).