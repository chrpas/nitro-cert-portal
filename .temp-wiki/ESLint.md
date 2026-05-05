## ESLint
ESLint statically analyzes your code either in your editor or on-demand via a CLI-interface. It is based on a set of rules to quickly be able to find problems that are important to you. It is built into most text editors. You can use existing configurations and plugins or even [write your own](https://github.com/avensia-oss/eslint-plugin)!

Run ESLint by `nitro.cmd eslint`. You can use the `nitro.cmd eslint --fix` command to autofix all the basic formatting and whitespace errors. This will return a list of all the errors that you need manual intervention to fix.

## Prettier
We also have a package called `prettier` which is more responsible for code formatting, making sure all our code looks clean and uniform no matter who has written it. 

ESLint is using a plugin to integrate with prettier to make sure that they work together.