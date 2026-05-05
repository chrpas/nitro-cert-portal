Nitro supports A/B testing [Optimizely Feature Experimentation](https://github.com/avensia/nitro5/wiki/Optimizely-Feature-Experimentation).

Nitro supports three kinds of A/B tests:
* Client side tests
* Server side tests using CMS blocks that editors can setup themselves
* Server side tests that needs to be added to the code base by developers

**Client side** tests make use of well-known HTML attributes (like `data-test-id="minicart-button"`) that are added to some well known HTML elements such as the add-to-cart button, the complete purchase button, etc. See https://github.com/avensia/nitro5/wiki/Test-ids

Pure client side tests can often be setup without any assistance from a developer.

Client side tests are limited to modifing the content that was sent to the browser, and can be used e.g. to change simple texts on buttons or change how certain elements look. But client side tests are not optimal if you want to test completely different content against each other, like testing if a "Recommend based on cart" or "Recommend based on customer" products block performs best on the start page. It would of course be possible to send both these versions to all users and let the client side test hide one of them. But that would mean sending twice as much content to the client and also that both content versions will initially be rendered until the client side test hides one of them, leading to a less than optimal user experience.

Instead, we can use **server side tests** to to serve different content depending on which group/variation the user was assigned to. There are two types of server side tests: tests that an editor can setup without any assistance from a developer (assuming the test is using already existing CMS blocks), and more complicated tests which need to be added to code by a developer. 

## Also see
- [Optimizely Feature Experimentation](https://github.com/avensia/nitro5/wiki/Optimizely-Feature-Experimentation)