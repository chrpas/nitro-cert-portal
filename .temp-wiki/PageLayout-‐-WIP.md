This describes the PageLayout component and what the different props affect.

`Basic` is the default exported PageLayout component which renders a div-element.

`<Basic appearanceWidth="normal" hasGap={true} layout={PageLayout.OneToOne} />`

- `appearanceWidth` - The page container width. This is marked with dashed red lines in the picture. This is the widest the PageLayout will be. If the browser viewport is for example 1920px wide then there will be whitespace between the dashed red lines and the browser viewport. This is area is marked with red curvy lines in the picture.
   - `appearanceWidth="normal"` - `PageLayout` will not exceed 1280px in width
   - `appearanceWidth="narrow"` - `PageLayout` will not exceed 768px in width
   - `appearanceWidth="full"` - `PageLayout` will stretch all the way out to the browsers viewport

- `hasGap` - When the browser viewport is more narrow than the PageLayout width then this props enables margins between the PageLayout and the browser viewport. If this is false then content will strech all the way to the viewport edge. This can be desired when have an image in your PageLayout but when you have text you want some kind of margin to the browser viewport.

`layout` - 


![image](https://github.com/avensia/nitro5/assets/2861562/fbb2e8cc-a230-4cc7-be6f-511399567539)

temp pic
![image](https://github.com/avensia/nitro5/assets/2861562/b62e625e-ff1a-4c76-a8d6-b0e9e2e29b2e)
