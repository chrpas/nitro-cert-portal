We estimate that upgrading a project like nitro5 takes 2-3 days. A bigger project with more third party libs etc may take about 5 days.

## Update packages

### Pick frontend package updates

Required frontend package versions for React 19 support:
- @avensia/nitro5-buildsystem > 6.0.0
- @avensia/nitro5-scope > 4.0.0
- @avensia/nitro5-scope-episerver > 3.0.0

(Be sure to install the latest versions of the above packages)


- File: `/package.json`

  Do the [same changes as in nitro5](https://github.com/avensia/nitro5/commit/bafb6e4bb7855cfbf2121f1fb2763cdf1026c658#diff-7ae45ad102eab3b6d7e7896acd08c427a9b25b346470d7bc6507b6481575d519)

- File: `/buildsystem/package.json`

  Do the [same changes as in nitro5](https://github.com/avensia/nitro5/commit/bafb6e4bb7855cfbf2121f1fb2763cdf1026c658#diff-449be2cad2df0e1ca8d95d896e4c2d9a3a390bd3150be27e86c254c705321367) and [nitro5 eslint commit](https://github.com/avensia/nitro5/pull/757/commits/6cb7360bf37000b347f17d17d3ab81b35d52faf3#diff-449be2cad2df0e1ca8d95d896e4c2d9a3a390bd3150be27e86c254c705321367)
  - replace `"@avensia/nitro5-buildsystem": "^5.12.0"` with `"@avensia/nitro5-buildsystem": "^6.1.0"`
  - Update `@avensia-oss/ts-transform-glitz-displayname` to `1.0.2`

  💡 Make sure to update to the latest available versions. In VScode you can hover the packagename with cursor and the latest version will show in a tooltip. You can also check on https://packages.avensia.com


- File: `/src/package.json`

  Do the [same changes as in nitro5](https://github.com/avensia/nitro5/commit/bafb6e4bb7855cfbf2121f1fb2763cdf1026c658#diff-cc5a2f170768969f124108ad3be7fdbcbed774c11774d99a87a3a78fef4ab97b). However skip payment and shipping packages you don't use. If you have other dependencies in your project, like third party libs you have to make sure you update those to a version compatible with React 19 and TypeScript 5.9.3

  💡 Make sure to update to the latest available versions. In VScode you can hover the packagename with cursor and the latest version will show in a tooltip. You can also check on https://packages.avensia.com

### Install frontend packages

Remove any existing `node_moduls` folder in `/`, `/src` and `/buildsystem` to be on the safe side.

Now run `yarn` in the root. Make sure you are on VPN if not in an Avensia office. All the packages should install.

It's expected that yarn lists 3 unmet dependencies:
- `react` due to `react-redux`

  In order to solve this we would have to upgrade to `redux` 5 and `react-redux` 9 which requires a lot of changes. We want this upgrade to be as small and quick as possible so we save `react-redux` for another time. `react-redux` is only using APIs that works in both React 17 & 19 so it's nothing to worry about.
- `react` due to `react-feather`

  The `react-feather` is not maintained for 2-3 years so there's no version listing react 19 as dependency available. It works fine in React 19 though so we will not touch it now.
- `tslib` due to `@microsoft/applicationinsights-web`

  We plan on removing this dependency and handle it in more performant way.

:bulb: Notice that yarn.lock have been updated. You can also run `yarn dedupe` to group dependencies better.

### Install backend packages

Required backend package versions for React 19 support:
- Avensia.Nitro5.Scope > 4.0.0
- Avensia.Nitro5.Scope.Episerver > 3.0.0
- Avensia.Nitro5.Scope.Mvc >= 2.5.1

(Be sure to install the latest versions of the above packages)

In addition, many other packages have had their version ranges updated to support the new majors. So our recommendation is to update all Avensia packages to the latest version.

- You should be able to build backend now. Please do it!
- It's expected that some new d.ts files end up in the root. These should be committed.

## Migrate eslint

Since eslint has been upgraded to a newer version, the configuration must also be updated.

If you use the nitro5 configuration today you can grab our updated config. If you want to migrate your old config, check this out: https://eslint.org/docs/latest/use/configure/migration-guide

- New config added: `eslint.config.js`
- Old config - remove: `.eslintrc.js`
- Old ignore - remove: `.eslintignore`

We have updated the logging from eslint to be more compact and clean. See `eslint.ts` in the nitro5 PR if you want to bring over the changes.

Our config will generate quite a lot of warnings reading due to a new linting rule:
> Potential leaked value that might cause unintentionally rendered values or rendering crasheseslint[react/jsx-no-leaked-render](https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-no-leaked-render.md)

This and most other lintings are auto fixable. Just run `nitro -sy eslint --fix` to fix all auto fixable issues.

## Fix common TypeScript errors

You can now run `nitro frontend:typecheck` to see how your code handle the new versions of React and TypeScript. You will probably get quite a lot of errors but our findings is that most errors are of the same type and quite quick to fix. Below are the TypeScript errors we stumbled on when doing the upgrade in Nitro5. We'd recommend that you go through these first and then if you have anything left you attack it then.

We are listing a few regex you can search for in your editor to find all occurrences. Mark the square & star symbol at the right hand side in the search bar in Visual Studio Code.

### Arguments to decorators are deprecated

This was a migration step in the Scope 9 upgrade. See [here](https://github.com/avensia/nitro/blob/develop/docs/nitro_projects/SCOPE_UPGRADE.md#arguments-to-decorators-are-deprecated) if you want more info 

Regular expression: `[a-z1-9]styled\(`

```typescript
// Deprecated
const StyledComponent = someDecorator(
  anotherDecorator(styled.Div, { color: 'red' })
);

// Recommended
const StyledComponent = styled(styled.Div, someDecorator, anotherDecorator, {
  color: 'red',
});
```

### Empty ref argument

`Error: Expected 1 arguments, but got 0. An argument for 'initialValue' was not provided.`

Regular expression:   `useRef<[a-zA-Z]+>\(\)`

Usually if you have left it empty you can just set `null` as initial value.

### Fetch priority

Changed casing. `fetchpriority` => `fetchPriority`

### Inert

Is now a boolean property

Change `{...(hasInert && { inert: '' })}` => `inert={hasInert}`

### ComponentType

Error: Generic type 'ComponentType' requires 1 type argument(s).

`ComponentType` is a generic and requires a type argument. For the occurrences in Nitro we don't care about the type so just `ComponentType<any>` will be fine.

### JSX.Element

Just search and replace
`JSX.Element` => `React.JSX.Element`

### Function as a child

Typescript will not allow a union here of React children, Glitz children and a custom children prop.

Easiest migration is to move it to a named render prop.

From
```typescript
<SomeComponent>
  {({onClick, count}) => {
    return <button onClick={onClick}>{count}</button>
  }}
</SomeComponent>
```
To
```typescript
<SomeComponent
  renderButtonCounter{({onClick, count}) => {
    return <button onClick={onClick}>{count}</button>
  }}
/>
```

## Other possible issues
If you pass `ref` to elements with a custom prop like `elementRef={ref}` you should now replace them with native prop. We have seen cases like this to create issues.

## Recommended picks
In order to fully enjoy the best experience we recommend that you pick the following changes
- React compiler https://github.com/avensia/nitro5/pull/926 enable this before regression testing begins to avoid duplicate work
- Nitro.cmd 3-4x faster startup time! 🚀 https://github.com/avensia/nitro5/pull/917
- Automatically skip yarn! https://github.com/avensia/nitro5/pull/936
- Fix suspense hydration mismatch https://github.com/avensia/nitro5/pull/914
