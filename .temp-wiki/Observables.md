In order to reduce the amount of code we send to the end customer we use a small, custom implementation ([@avensia/observable](https://github.com/avensia/observable)) to deal with state and state updates rather than using a third-party libraries such as Redux, XState, MobX, etc. While these libraries are great they're a bit bigger than what we need for Excite and Nitro. There's nothing stopping you from using them directly yourself but neither Excite nor Nitro wants to make such a choice for you.

For more info, see the documentation in the package: https://github.com/avensia/observable

## Also see
- https://github.com/avensia/nitro/pull/812
