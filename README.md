# Prettier sort classes plugin

Prettier plugin that sorts class names based on a given config. If no config is provided or the class is not found in the config, the classes are sorted alphabetically (`en` locale).

## Installation

```sh
npm install --save-dev @alesmenzel/prettier-sort-classes-plugin
```

## Example

Assuming the following config

```ts
const CLASS_LIST = ['flex', 'flex-1', 'items-center', 'justify-between', 'gap-1', 'gap-2']
```

The following class names

```tsx
<div className='gap-2 aaa flex bbb items-center justify-between ccc'>
  {/* ... */}
</div>
```

will be sorted as

```tsx
<div className='flex items-center justify-between gap-2 aaa bbb ccc'>
  {/* ... */}
</div>
```

## Usage

Add the plugin to your prettier plugin configuration.

```js
module.exports = {
  // ...
  plugins: ['@alesmenzel/prettier-sort-classes-plugin'],
}
```
