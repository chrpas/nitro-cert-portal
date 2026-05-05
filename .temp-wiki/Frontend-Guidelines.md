This guide provides practical and consistent frontend development guidelines for the Nitro5 project. The goal is to foster a clean, maintainable, and enjoyable codebase that promotes collaboration and scalability.

# 📚 Table of Contents

- [Component Structure](#component-structure)
  - [Rationale](#component-structure-rationale)
  - [What makes this hard to read?](#component-structure-what-makes-this-hard-to-read)
  - [Why our approach is better](#component-structure-why-our-approach-is-better)
- [Readability](#readability)
- [Naming Files](#naming-files)
  - [React components](#naming-files-react-components)
  - [Other files](#naming-files-other-files)
  - [Acronyms and abbreviations](#naming-files-acronyms-and-abbreviations)

---

## 🔧 Component Structure

In Nitro5, we use **functional components** as the standard. While class components still exist in the codebase, they should be **gradually refactored** to functional components when feasible.

We follow a **consistent component structure** as outlined below:

```tsx
1️⃣ // Imports
import React from 'react';
import { styled } from '@glitz/react';
import { Style } from '@glitz/core';
import { useSelector } from 'Shared/State';
import { spacingOne } from 'Shared/Style';
import Button from 'Shared/Button';

2️⃣ // Constants & utility functions
const SOME_CONSTANT = 'SOME_CONSTANT_VALUE';

3️⃣ // Prop type definitions
type PropType = {
  someProp: boolean;
};

4️⃣ // Component definition
function SomeComponent(props: PropType) {
  const { someProp } = props; // 5️⃣ Destructure props
  const culture = useSelector(state => state.appShellData.culture); // 6️⃣ Use Redux state

  const onClick = () => {
    console.log('Button clicked');
  };

  if (!someProp) return null; // 7️⃣ Early bail

  return (
    <SomeComponentWrapper> {/* 8️⃣ Wrapper */}
      <AnotherComponent css={someProp && anotherComponentOptionalDecorator}>
        {culture}
      </AnotherComponent>

      <Button onClick={onClick}>Click me</Button>
    </SomeComponentWrapper>
  );
}

9️⃣ // Component export
export default SomeComponent;

🔟 // Styles
const SomeComponentWrapper = styled.div({
  marginRight: spacingOne,
});

const AnotherComponent = styled.div({
  marginRight: spacingOne,
});

const anotherComponentOptionalDecorator = styled({
  marginTop: spacingOne,
});
```

* 1️⃣ **Imports at the top.**
* 2️⃣ **Constants & utility functions** – Constants in `UPPER_SNAKE_CASE`.
* 3️⃣ **Prop type definitions** – The main prop type that gathers multiple types should be named `PropType`.
* 4️⃣ **Component definition** – Typed with `PropType` and props not destructured instantly.
* 5️⃣ **Destructure props** – For readability reasons.
* 6️⃣ **Use Redux state** – Read data from the Redux store.
* 7️⃣ **Bail when needed** – If the component shouldn't render unless some conditions are met, bail with `null`.
* 8️⃣ **Component wrapper name** – The name of our component wrappers should be `<ComponentName>Wrapper`. Example: If the component name is `ProductCard` it should be `ProductCardWrapper`. This makes life easier when using React dev tools.
* 9️⃣ **Component export** – The main component default export should be placed right below the component definition.
* 🔟 **Styles** – Styled components and other style definitions at the bottom. Optional styles that are applied only when certain conditions are met depending on props should also be declared here for caching reasons if possible.

<h3 id="component-structure-rationale">Rationale</h3>

A clean and consistent structure isn't just about aesthetics — it's about reducing **mental overhead**. When a file is structured in a predictable way, developers can understand and navigate it faster, spot bugs more easily, and extend components without confusion.

To see why our guidelines matter, let’s look at an anti-pattern example:

```tsx
// This is intentionally hard to read
// ❌ Everything inline: connect, styled, forwardStyle, props, and logic
export default connect(
  (state) => ({
    currentUrl: state.currentPage.url,
  })
)(
  styled(
    forwardStyle({
      name,
      currentUrl,
    }: {
      name: string;
      currentUrl: string;
    }) {
      return name ? (
        <styled.Div css={{ padding: '12px', backgroundColor: '#f2f2f2' }}>
          <p>Hi {name}, you are on: {currentUrl}</p>
        </styled.Div>
      ) : (
        <></>
      );
    }
  )
);
```

<h3 id="component-structure-what-makes-this-hard-to-read">What makes this hard to read?</h3>

To understand this code, your brain must:

1. **Parse the export chain backwards** to figure out what's actually being rendered.
2. Mentally unravel multiple HOCs (`connect`, `styled`, and `forwardStyle`) applied inline.
3. Infer the component's name (if any) and purpose without seeing its declaration.
4. Guess what props it accepts and in what shape, since there's no standalone `PropType`.
5. Jump between **logic**, **styling**, and **state mapping** all in a single block.

This results in cognitive load and makes onboarding, reviewing, and debugging much harder.

<h3 id="component-structure-why-our-approach-is-better">Why our approach is better</h3>

Compare that with a clean and structured component using our conventions:

```tsx
// 3️⃣ Prop type definition
type PropType = {
  name: string;
};

// 4️⃣ Component definition
function AccountInfo(props: PropType) {
  const { name } = props; // 5️⃣ Destructure props
  const currentUrl = useSelector(state => state.currentPage.url); // 6️⃣ Use Redux state

  if (!name) return null; // 7️⃣ Early bail

  return (
    <AccountInfoWrapper>
      <p>Hi {name}, you are on: {currentUrl}</p>
    </AccountInfoWrapper>
  );
}

// 9️⃣ Export — HOCs applied clearly and cleanly
export default styled(AccountInfo);

// 🔟 Styles
const AccountInfoWrapper = styled.div({
  padding: '12px',
  backgroundColor: '#f2f2f2',
});
```

* **Clear separation of concerns**: type, logic, UI, styles, and export are in predictable places.
* **`PropType` is reusable and extendable** — no need to rewrite or untangle inline types.
* **Component is named and declared** — which aids DevTools, stack traces, and readability.
* **HOCs like `styled()` are applied at the bottom**, where the default export lives.
* Developers can scan and grok the component in **seconds**, not minutes.

---

## 🧠 Readability

Writing clear, easy-to-understand code should always be your first priority.

**Premature optimization is the enemy of readability.** Optimize only when you have solid empirical evidence that a performance issue exists. Optimization often sacrifices clarity, maintainability, and developer time — so be sure it’s worth it. Here are some key readability guidelines with examples:

Destructuring props reduces repetition and makes your code easier to scan by clearly showing what data your component uses.

**✅ Prefer:**

```tsx
type PropType = Backend.PriceModel

function SomeComponent(props: PropType)  {
  const { originalPrice, discount, quantity } = props;
  const totalPrice = (originalPrice - discount) * quantity;

  return <div>Total: {totalPrice}</div>;
}
```

**❌ Avoid:**

```tsx
function SomeComponent(props: { originalPrice: number; discount: number; quantity: number }) {
  return <div>Total: {(props.originalPrice - props.discount) * props.quantity}</div>;
}
```

Built-in array methods like `.forEach()`, `.map()`, and `.filter()` improve readability by expressing intent clearly and avoiding boilerplate loop code.

**✅ Prefer:**

```tsx
products.forEach(addToCart);
```

**❌ Avoid:**

```tsx
for (let i = 0; i < products.length; i++) {
  addToCart(products[i]);
}
```

Clear, meaningful names save time for readers and reduce cognitive load by making code self-documenting.

**✅ Prefer:**

```tsx
const isPasswordMinCharsMet = (password: string): boolean => {
  return password.length >= 6;
}
```

**❌ Avoid:**

```tsx
const handleP = (val: string) => {
  if (val.length < 6) {
    return false;
  } else {
    return true;
  }
};

```

Nested ternaries or long inline conditionals are difficult to read and maintain. Extract logic into well-named functions to clarify intent.

**✅ Prefer:**

```tsx
const pickSpacingByView = (view: View, isCompact: boolean): number => {
  if (view === View.PDP) return spacingOne;
  if (view === View.MINICART) return spacingThree;
  if (view === View.VARIANTSELECTOR) return spacingThree;
  if (view === View.PRODUCTCARD) return isCompact ? spacingTwo : spacingFour;
  return spacingSix;
};
```

**❌ Avoid:**

```tsx
const spacing =
  view === View.PDP
    ? spacingOne
    : view === View.MINICART || view === View.VARIANTSELECTOR
    ? spacingThree
    : view === View.PRODUCTCARD && isCompact
    ? spacingTwo
    : view === View.PRODUCTCARD && !isCompact
    ? spacingFour
    : spacingSix;
```

### Use early returns (bail out) to reduce nested ifs

Deeply nested if-statements increase cognitive load and make code harder to follow. Early returns simplify logic flow by handling edge cases upfront.

**✅ Prefer:**

```tsx
function getUserProfileStatus(user: User | null): string {
  if (!user) return "No user found";
  if (!user.isActive) return "User inactive";
  if (!user.hasProfile) return "User profile missing";

  return "User profile available";
}
```

**❌ Avoid:**

```tsx
function getUserProfileStatus(user: User | null): string {
  if (user) {
    if (user.isActive) {
      if (user.hasProfile) {
        return "User profile available";
      } else {
        return "User profile missing";
      }
    } else {
      return "User inactive";
    }
  } else {
    return "No user found";
  }
}
```

---

## 🗂️ Naming Files

To keep our file structure clean, consistent, and easy to navigate, follow these naming conventions:

<h3 id="naming-files-react-components">React components</h3>

Use **`PascalCase`** for all React component files and their component name should match the file name:

* `HeroContent.tsx`
* `CompactViewPdp.tsx`

<h3 id="naming-files-other-files">Other files (hooks, utilities, configs, etc.)</h3>

Use **`lower-kebab-case`** for all other files.

* `use-viewport.ts`
* `use-retrieve-vto-add-variation.ts`
* `format-price.ts`

<h3 id="naming-files-acronyms-and-abbreviations">Acronyms and abbreviations</h3>

We do **not** treat acronyms or abbreviations specially.
That means:

* In `PascalCase`: only capitalize the **first letter**, just like a normal word.
* In `lower-kebab-case`: use all **lowercase**, like any other word.

**✅ Prefer:**

```plaintext
ScoImpersonationPage.tsx
CompactViewPdp.tsx
use-retrieve-vto-add-variation.ts
```

**❌ Avoid:**

```plaintext
SCOImpersonationPage.tsx     ❌ (All caps acronym)
CompactViewPDP.tsx           ❌ (All caps abbreviation)
use-retrieve-VTO-add-variation.ts  ❌ (Uppercase in kebab-case)
```