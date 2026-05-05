In a multisite scenario, you usually want a different look-and-feel for your different sites. This is possible to achieve by checking "if this site do this else do that", but this way of working does not scale very well.

Instead, you should use the theming support in nitro. By creating a theme configuration file for each site, we are moving the handling of differences to configuration files and the code will be written as if these differences were feature toggles. 

![image](https://github.com/avensia/nitro5/assets/6929325/ad1d0a0c-3909-4f89-9c9a-a51494e41d14)

Another benefit of using the theming support in nitro is that code and components belonging to `site2` will not be downloaded and run by `site1` and vice versa.

## Use cases for using theming
* Different look-and-feel for different sites in a multisite solution.
* Different look-and-feel for B2C and B2B on the same site.
* Multiple domains for the same solution where each domain should have its own look and feel but the functionality should be the same accross all sites.
* Dark theme, christmas theme etc.
* A/B testing changes in the user experience if you intend to A/B test larger changes than just "change the color of the background" or "change the text of the buy button".
* If the requirements of the site is to have a targeted experience depending on the device (mobile/tablet/desktop or Windows/Android/iOS, etc).

Do note that themes are a flat level meaning that if you use multisite and want a dark theme you will need to do something like `site1`, `site1DarkTheme`, `site2`, `site2DarkTheme`.

# Best practices

The theming feature is very powerful and it's possible to create two very different sites in the same code base. However this is not really desired. The more each theme diff from the other the more difficult it will be to manage over time. We suggest that you use it with carefulness and talk with the customer about this at an early stage to set the expectations.

By just doing the following changes you will usually get the feeling of the brand together with content and products.
* Logotype
* Colors
* Fonts
* Buttons (colors, border radius, etc)

Doing some changes in the header/footer is usually not that big deal either or change a component on a few pages but doing totally different layouts everywhere will be an effort to maintain. Inform the customer and try to steer them into this direction of as few differences as possible but listen to their needs.

If done well developers will be able to write code without really thinking about which site they are developing. If done poorly with big diff and poor refactoring then two themes may require **more** than 2x burden to maintain.

## How to use themes

### Configuring a theme

In `SiteLayout/Theming` there is one config file for each theme. The theme is created by adding the `@ThemeContext` pragma at the top. 

Example of config settings in `nitrox.tsx`

```js
/**
 * @ThemeContext nitrox
 */
const theme: ThemeContextType = {
  name: 'nitrox',
  header: {
    height: 120,
    topBarBackgroundColor: '#efefef',
    hasFavorites: true,
  }
// ...
}
```

The `header` section above contains examples of the type of properties that are recommended in this config: **numeric values** (such as height), **color values** and **boolean values**. Note that pure CSS does not belong in this config - instead we recommend using the values in the config to construct your CSS in the tsx files.


### Using the theme configuration
Use the `useCurrentTheme()` hook to get the values from the theme config, like:

```jsx
function MyTestHeader() {
    const header = useCurrentTheme().header;

  return (
    <styled.Header css={{ height: header.height }}>
      <TopBar css={{ height: header.topBarBackgroundColor }} /> 
        {header.hasFavorites && <Favorites />}
    </styled.Header>
  )
}
```

For Glitz styled components, the theme config is available if you pass an array as value to a property:
```jsx
const MyTestComponent = styled.div({
  height: (theme) => theme.header.height,
});
```

## Theme specific components

### Different components using the @Theme pragma
For components with the `@ComponentFor` pragma, you can use multiple components for the same view model, and use the `@Theme` pragma to specify which theme this component should be included in:

```js
/**
 * @ComponentFor StartPageViewModel
 * @Theme site2
 */
```

Nitro will look at the `@Theme` pragma and select the correct component depending on the current theme. The component without a `@Theme` pragma is considered the default theme. 

By default all components are shared in the same bundle. However when you create theme specific components they will end up in separate bundle file, specific for each theme. If you for some reason want to, can override this with the `@Bundle` pragma.

### Different component using theme config
The `@Theme` pragma can only be used for components that has the `@ComponentFor` pragma (e.g. components in the components registry). For other components, like your logo component, you can create a property in your theme config where you specify which component to use for this particular theme, like:

```js
{
  name: 'nitrox',
  logo: {
    Component: NitroXLogo,
  },
}
```

> Note! These components will be resolved in a **global context**. So every import in this file will be resolved and downloaded at application startup even if it only will be used on a specific page. So if possible, we recommend you use the `@Theme` pragma instead.


## Theming the splashscreen
The splashscreen is found in `src\Avensia.Shop\Views\Shared\_Splashscreen.cshtml` and the startersite contains partial views for each theme:
```cshtml
@await Html.PartialAsync($"_Splashscreen-{themeName}")
```
In the splashscreen partial views, you can utilize inline styling for changing color etc for each theme.

> Note! `themename` is case sensitive.

## Theming the favicon
Place your favicon in a folder with the same name as the theme in `src/Avensia.Shop/wwwroot/favicons` and it will just work. 

> Note! that the favicon name is case sensitive.

## Color themes
We have another theming concept called "Color themes" that we've previously called just "Theme". These are color themes we are using in Glitz. 

The "color themes" are **color combinations** that works and can be reused. Since this should be possible to change per theme the color theme configuration is found in the theme config in `SiteLayout/Theming`. This is used as input to create the Glitz theme.

To create a Glitz color theme (that will be used for all child components), you pass a data object to the `theme` prop on a Glitz `ThemeProvider`. This data object can then the queried in Glitz `styled` functions by providing a function to the CSS property value instead of a static value. The theme object data (let's call it `glitzThemeData`) is given as a first argument to the provided function, like:

```ts
styled.div({ color: (glitzThemeData) => glitzThemeData.color })`.
```

In `Shared/GlitzTheme` we have a factory function to create these GlitzThemes and we are also creating a ready to use set of styled components with input from the color themes in the theme configuration. With this factory we are creating a `BaseTheme` which is wrapping the entire SiteLayout in the `SiteLayout/Container` component. This is the reason why you can always utilize the Glitz themes in the entire application.

## Setting the current theme
To set the current theme for a HTTP request, you implement `ICurrentTheme.GetCurrentThemeName()`. 

`GetCurrentThemeName()` gets passed a request object which contains the current HTTP request and the current `IScopeModel` (which is for example your `StartPageViewModel`). This means that you can switch themes when you navigate between different pages. But it also lets you set a theme depending on the domain name or current site name for example.

The theme name that you return from `GetCurrentThemeName()`  will be set as a redux state `currentTheme` at root level. If you simply want the default theme, return  `CurrentThemeRequest.DefaultThemeName`. 

### Switching themes in frontend

To update the theme in frontend you can dispatch the `setTheme` redux action creator from scope:

```jsx
import { setTheme } from '@avensia/scope';
import { useDispatch } from 'react-redux';


const Header = (props) => {
  const dispatch = useDispatch();
  return <button onClick={() => dispatch(setTheme('darktheme'))}>Switch theme</button>;
};
```

> Note! While it is possible to update the current theme in frontend, there is no built in synchronization between the current theme in frontend and the current theme in backend, so you probably want to add a cookie or explicitly notify backend when the frontend switches theme.