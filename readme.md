# Base Elem Js

`base-elem-js` is a lightweight utility for DOM manipulation, including querying elements, adding/removing classes, setting attributes, and handling events. The minified package comes in at ~5kb! It is designed to work with a collection of elements or a single element.

## Usage

To use the `base-elem-js` utility, you need to import it as follows:

```typescript
import $be from 'base-elem-js;
```

### Use via a CDN

```html
<script src="https://cdn.jsdelivr.net/npm/base-elem-js"></script>
```
 

<!-- ## Features

To come, in the meantime check the [Home Page](https://github.com/krschroeder/base-elem-js#readme). -->

## Base Elem Methods ($be().*)
```typescript
find(selector: string, filter?: (elem: any, i: number) => boolean): BaseElem
```
Finds elements matching the selector within the current elements and returns a new BaseElem instance.
```typescript
findBy(type: FindBy, selector: string, filter?: (elem: any, i: number) => boolean): BaseElem
```
Finds elements by type (id, class, or tag) within the current elements and returns a new BaseElem instance.

```typescript
findOne(selector: string): BaseElem
```
Finds the first element matching the selector within the current elements and returns a new BaseElem instance.

```typescript
each(fn: (elem: HTMLElement, i: number) => void): BaseElem
```
Iterates over each element and applies the provided function.

```typescript
css(attrs: Partial<CSSProperties> | string): BaseElem | string
```
Sets or gets CSS properties for the current elements. If only passing a string, will return the property value.

```typescript
addClass(cssNames: string | string[]): BaseElem
```
Adds the specified class(es) to the current elements.

```typescript
rmClass(cssNames: string | string[]): BaseElem
```
Removes the specified class(es) from the current elements.

```typescript
tgClass(cssNames: string | string[], toggle?: boolean): BaseElem
```
Toggles the specified class(es) on the current elements.

```typescript
hasClass(cssNames: string | string[], method: 'some' | 'every' = 'some'): boolean
```
Checks if the current elements have the specified class(es).

```typescript
attr(attrs: Record<string, string> | string): BaseElem
```
Sets or gets attributes for the current elements.

```typescript
empty(): BaseElem
```
Empties the content of the current elements.

```typescript
remove(): BaseElem
```
Removes the current elements from the DOM.

```typescript
insert(html: string | HTMLElement | HTMLElement[], method: AppendMethod = 'append'): BaseElem
```
Inserts HTML or elements into the current elements using the specified method (append, prepend, after, before).

```typescript
html(html: string): BaseElem
```
Sets the inner HTML of the current elements.

```typescript
text(text: string): BaseElem
```
Sets the inner text of the current elements.

```typescript
on(evtName: `${Event['type']}.${string}` | string, fn: EventFn, delegateEl: string = null, config: boolean | AddEventListenerOptions = false): BaseElem
```
Adds an event listener to the current elements. Namespace the events with a '.', for example `click.myClickName`.


```typescript
trigger(evtName: string, config?: EventInit): BaseElem
```
Triggers native events as well as synthetic events.

```typescript
off(evtName: string, config: boolean | AddEventListenerOptions = false): BaseElem
```
Removes an event listener from the current elements. Pass in the same string value as the 'on' method. Namespace with '.', or `click.myClickName` as the function name.


## Examples

```typescript
import $be from './base-elem-js';

const bes = $be.static;

$be('h1').css({color: 'green'});

const $hidden = $be('.hidden').css({display: 'block'}).attr({hidden: null});

console.log(bes.isHidden($hidden.elem[0]));

console.log('has "what" class',$be('ul').find('li').hasClass('what'));

const div = bes.make('div', {id: 'test', className: 'test'}, '<h2>Hello Make!</h2><p>Some copy goes here</p>');
const $div = $be(div);
$div.on('click', (ev, elem) => {
    console.log('clicked', elem.textContent);
},'h2');
$be(document.body).insert(div);

$div.insert('<p>Some more copy</p>', 'before');
$div.insert('<p>Copy Prepended</p>', 'prepend');
```
## Extending library
The BaseElem class can be refrenced for extension as seen below.

```typescript
$be.BaseElem.prototype.foo = bar();
```


## Base Elem Static ($be.static)


```typescript
trigger(target: HTMLElement | Window | Document, evtName: string, config?: EventInit): BaseElem
```
Triggers native events as well as synthetic events.

```typescript
make(tag: string, attrs?: Record<string, any>, html?: string): HTMLElement
```
Creates a new HTML element with the specified tag, attributes, and inner HTML content.

```typescript
isHidden(elem: HTMLElement): boolean
```
Checks if the specified element is hidden (i.e., has display: none or visibility: hidden).

```typescript
isVisible(elem: HTMLElement): boolean
```
Checks if the specified element is visible (i.e., does not have display: none or visibility: hidden).

```typescript
find(selector: string, base: HTMLElement = document): HTMLElement[]
```
Finds elements matching the selector within the specified base element.

```typescript
findBy(type: FindBy, selector: string, base: HTMLElement = document): HTMLElement[]
```
Finds elements by type (id, class, or tag) within the specified base element.

```typescript
findOne(selector: string, base: HTMLElement = document): HTMLElement
```
Finds the first element matching the selector within the specified base element.

```typescript
addClass(elem: HTMLElement, cssNames: string | string[]): void
```
Adds the specified class(es) to the element.

```typescript
rmClass(elem: HTMLElement, cssNames: string | string[]): void
```
Removes the specified class(es) from the element.

```typescript
tgClass(elem: HTMLElement, cssNames: string | string[], toggle?: boolean): void
```
Toggles the specified class(es) on the element.

```typescript
hasClass(elem: HTMLElement, cssNames: string | string[], method: 'some' | 'every' = 'some'): boolean
```
Checks if the element has the specified class(es).

```typescript
attr(elem: HTMLElement, attrs: Record<string, string> | string): void
```
Sets or gets attributes for the element.

```typescript
empty(elem: HTMLElement): void
```
Empties the content of the element.

```typescript
remove(elem: HTMLElement): void
```
Removes the element from the DOM.

```typescript
insert(elem: HTMLElement, html: string | HTMLElement | HTMLElement[], method: AppendMethod = 'append'): void
```
Inserts HTML or elements into the specified element using the specified method (append, prepend, after, before).

```typescript
html(elem: HTMLElement, html: string): void
```
Sets the inner HTML of the element.

```typescript
text(elem: HTMLElement, text: string): void
```
Sets the inner text of the element.

## Base Element Static

```typescript
import $bs from './core/BaseStatic';

const bes = $bs.static;

const div = bes.make('div', { id: 'test', className: 'test' }, '<h2>Hello Make!</h2><p>Some copy goes here</p>');
document.body.appendChild(div);

bes.addClass(div, 'new-class');
bes.rmClass(div, 'test');
bes.tgClass(div, 'toggle-class');

console.log(bes.hasClass(div, 'new-class'));

bes.attr(div, { 'data-test': 'value' });
console.log(bes.attr(div, 'data-test'));

bes.empty(div);
bes.html(div, '<p>New content</p>');
bes.text(div, 'New text');

bes.insert(div, '<p>Inserted content</p>', 'before');
```