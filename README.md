# React EyeDrop
> A highly customizable, flow-typed color eye-dropper for your React project.
<!--
[![](https://img.shields.io/bundlephobia/min/react-eyedrop.svg)](https://bundlephobia.com/result?p=react-eyedrop@1.0.0)
[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads Stats][npm-downloads]][npm-url]
-->
With flexibility in mind, let your users eyedrop anything in your app within a minute.
Designed to work out of the box, the only required property to pass down is `onChange`.
A example project is included for basic usage.

![](readme_header.jpg)

###### Credits to [Sharon](https://unsplash.com/photos/iMdsjoiftZo) for such splendid taste in color.

## Installation

NPM:

```
npm install --save react-eyedrop
```

Yarn:

```
yarn add react-eyedrop
```

## API Reference

##### Table of contents
**[onChange](#api-onChange)** <br>
**[wrapperClasses](#api-wrapperClasses)** <br>
**[buttonClasses](#api-buttonClasses)** <br>
**[customComponent](#api-customComponent)** <br>
**[passThrough](#api-passThrough)** <br>
**[once](#api-once)** <br>
**[pickRadius](#api-pickRadius)** <br>
**[cursorActive](#api-cursorActive)** <br>
**[cursorInactive](#api-cursorInactive)** <br>
**[onInit](#api-onInit)** <br>
**[onPickStart](#api-onPickStart)** <br>
**[onPickEnd](#api-onPickEnd)** <br>

# <a name="api-onChange"></a>
#### **onChange**
###### `required`
###### Expects `function`
###### Returns an object:
###### ` { rgb: string, hex: string } `
*Example:*
```
function onChange({ rgb, hex }) {
    /* Do stuff */
}
<!-------->
<EyeDropper onChange={onChange} />
```

# <a name="api-wrapperClasses"></a>
#### **wrapperClasses**
###### Expects `string`
*Example:*
```
<EyeDropper wrapperClasses="my-css-class" />
/* or even */
<EyeDropper wrapperClasses={`my-css-class ${active ? 'my-active-css-class' : ''}`} />
```

# <a name="api-buttonClasses"></a>
#### **buttonClasses**
###### Expects `string`
*Example:*
```
<EyeDropper buttonClasses="my-css-class" />
/* or even */
<EyeDropper buttonClasses={`my-css-class ${active ? 'my-active-css-class' : ''}`} />
```

# <a name="api-customComponent"></a>
#### **customComponent**
###### Expects `React Node`
###### *Use your own component for your EyeDropping business.*
###### *Use the `onClick` prop which gets passed down.*
*Example:*
```
const Button = ({ onClick }) => <button className="btn" onClick={onClick}>My custom button</button>
<!-------->
<EyeDropper customComponent={Button} />
```

# <a name="api-passThrough"></a>
#### **passThrough**
###### Expects `string`
###### *If you use your own button component, you can choose to pass down the resulting colors as a prop named by whatever you pass in here.*
*Example:*
```
const Button = ({ onClick, droppedColors }) => <button className="btn" onClick={onClick}>My custom button</button>
<!-------->
<EyeDropper customComponent={Button} passThrough='droppedColors' />
```

# <a name="api-once"></a>
#### **once**
###### Expects `boolean`
###### Defaults to `true`
###### *Decide if EyeDropping should stop after having pressed once.*
*Example:*
```
<EyeDropper once />
/* or */
<EyeDropper once={false} />
```

# <a name="api-pickRadius"></a>
#### **pickRadius**
###### Expects `object` with the following form:
```
{
    unit: 'radius' | 'pixel',
    amount: number
}
```
###### *If you want to change the default 1x1 pixel selection, here's where you do it.*
###### For `unit`, choose either *'radius'* or *'pixel'*
*Example:*
```
<EyeDropper pickRadius={{ unit: 'pixel', amount: 3 }} />
/* This will result in 3x3 equals 9 pixels which the average color will be generated from. */
<EyeDropper pickRadius={{ unit: 'pixel', amount: 5 }} />
/* 5x5 */
<EyeDropper pickRadius={{ unit: 'pixel', amount: 7 }} />
/* 7x7 */
/* note: unit type 'pixel' only works with an odd amount */

/* or */

<EyeDropper pickRadius={{ unit: 'radius', amount: 1 }} />
/* This will result in 3x3 equals 9 pixels. */
<EyeDropper pickRadius={{ unit: 'radius', amount: 2 }} />
/* This will result in 5x5 equals 25 pixels. */
<EyeDropper pickRadius={{ unit: 'radius', amount: 3 }} />
/* This will result in 7x7 equals 49 pixels. */
```

# <a name="api-cursorActive"></a>
#### **cursorActive**
###### Expects `string`
###### Defaults to `copy`
###### *Decide what CSS cursor to use when actively EyeDropping.*
###### [Link to CSS Cursors](https://www.w3schools.com/csSref/pr_class_cursor.asp)
*Example:*
```
<EyeDropper cursorActive="cursor" />
```

# <a name="api-cursorInactive"></a>
#### **cursorInactive**
###### Expects `string`
###### Defaults to `auto`
###### *Decide what CSS cursor to revert back to once finished with EyeDropping business.*
###### [Link to CSS Cursors](https://www.w3schools.com/csSref/pr_class_cursor.asp)
*Example:*
```
<EyeDropper cursorActive="auto" />
```

# <a name="api-onInit"></a>
#### **onInit**
###### Expects `function`
###### *Callback for componentDidMount*
*Example:*
```
function getPeanut() {
    console.log('Mmm... Definately overrated.')
}
<!-------->
<EyeDropper onInit={getPeanut} />
/* Will be called when component is mounted */
```

# <a name="api-onPickStart"></a>
#### **onPickStart**
###### Expects `function`
###### *Callback for when starting to EyeDrop*
*Example:*
```
function getBananas() {
    console.log('Ahhh... Much better.')
}
<!-------->
<EyeDropper onPickStart={getBananas} />
/* Will be called when starting to EyeDrop */
```

# <a name="api-onPickEnd"></a>
#### **onPickEnd**
###### Expects `function`
###### *Callback for when finished EyeDropping*
*Example:*
```
function byeNow() {
    console.log('Stay sharp, journeyman!')
}
<!-------->
<EyeDropper onPickEnd={byeNow} />
/* Will be called when finished EyeDropping */
```

## Development setup

Run the unit tests locally:

```
npm i
/* or */
yarn

/* and then */

npm run test
```

## Release History

* 3.0.0
    * Updated pickRadius feature to work with different units; radius & pixel.
* 2.1.2
    * Fixed typo in documentation
* 2.1.1
    * Added pickRadius feature
* 2.0.1
    * Updated documentation
* 2.0.0
    * Changed prop name from buttonComponent to customComponent
* 1.0.0
    * Initial release

## Meta

Manjodh "Jodhman" Singh – [manjodheriksingh@gmail.com](mailto:manjodheriksingh@gmail.com)

Distributed under the MIT license. See [license](https://opensource.org/licenses/MIT) for more information.

[https://github.com/jodhman/](https://github.com/jodhman/)

## Contributing

1. Fork it (<https://github.com/jodhman/react-eyedrop/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

<!-- Markdown link & img dfn's
[npm-image]: https://img.shields.io/npm/v/datadog-metrics.svg?style=flat-square
[npm-url]: https://npmjs.org/package/datadog-metrics
[npm-downloads]: https://img.shields.io/npm/dm/datadog-metrics.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/dbader/node-datadog-metrics/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/dbader/node-datadog-metrics
[wiki]: https://github.com/yourname/yourproject/wiki -->