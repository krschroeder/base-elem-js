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
find(selector: string | (elem: HTMLElement, i: number) => HTMLElement[], filter?: (elem: any, i: number) => boolean): BaseElem

//Example

$be('ul').find('li');
//returns list of <li>'s

$be('ul').find('li', el => $be.static.hasClass(el,'foo')); 
//returns only <li> with .foo class

$be('li').find(el => el.closest('ul'));
// returns the parent element <ul>

$be('li:first-child').find(el => el.nextElementSibling as HTMLLIElement);
// find the first then get the next element

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
filter(fn: (elem: HTMLElement, i: number) => boolean): BaseElem
```
Finds elements based on the filtering function within the current elements and returns a new BaseElem instance.

```typescript
toArray(): HTMLElement[]
```
Returns an array of elements;

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
html(html?: string): BaseElem | string;
```
Sets the inner HTML of the current elements. Left blank it will return the innerHTML.

```typescript
text(text?: string): BaseElem | string;
```
Sets the inner text of the current elements. Left blank it will return the textContent.

```typescript
// types for the Event
export type NativeEvents = keyof HTMLElementEventMap;
export type WindowEvents = keyof WindowEventHandlersEventMap;
export type DocEvents = keyof DocumentEventMap;
export type EventName = `${NativeEvents | WindowEvents | DocEvents}.${string}` | NativeEvents | WindowEvents | DocEvents | SyntheticEvent;
 

on(evtName: EventName | EventName[], fn: EventFn, delegateEl: string = null, config: boolean | AddEventListenerOptions = false): BaseElem
```
Adds an event listener to the current elements. Namespace the events with a '.', for example `click.myClickName`. Pass in an array or single value for the `evtName` parameter. For a __synthetic event__ pass it in `[]`, so `[syntheticEventName]`, this is essentially for the best Typescript support (otherwise string would invalidate the type checking of the event name).

```typescript
// see EventName type right above
off(evtName: EventName | EventName[], config: boolean | AddEventListenerOptions = false): BaseElem
```
Removes an event listener from the current elements. Pass in the same string value as the 'on' method. Namespace with '.', or `click.myClickName` as the function name. Can also pass in an array of strings for the `evtName` param.

```typescript
trigger(evtName: EventName, delgateEl?: string): BaseElem
```
Triggers native events as well as synthetic events. Can also trigger namespaced events such as `click.myClickName`. 

## Examples

```typescript
import $be from "base-elem-js";

const bes = $be.static;

$be('h1').css({color: 'green'});

const $hidden = $be('.hidden').css({display: 'block'}).attr({hidden: null});

console.log(bes.isHidden($hidden.elem[0]));

console.log('has "what" class',$be('ul').find('li').hasClass('what'));

const div = bes.make('div', {id: 'test', className: 'test'}, '<h2>Hello Make!</h2><p>Some copy goes here</p>');
const $div = $be(div);
$div.on('click.myClickName', (ev, elem) => {
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

```typescript
on(baseEl: EventElem, evtName: `${Event['type']}.${string}` | string, fn: EventFn, delegateEl: string = null, config: boolean | AddEventListenerOptions = false)
```
Adds an event listener to the current elements. Namespace the events with a '.', for example `click.myClickName`.

```typescript
off(evtName: string, config: boolean | AddEventListenerOptions = false);
```
Removes an event listener from the current elements. Pass in the same string value as the 'on' method. Namespace with '.', or `click.myClickName` as the function name.

```typescript
trigger( target: HTMLElement, evtName: string, delegateEl?: string, config?: boolean | AddEventListenerOptions);
```
Trigger native, synthetic and namespaced navtive events.

## Base Element Static Examples

```typescript
import $bs from "base-elem-js";

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

## Animate/Transition Static Methods
This library includes a couple extra functions to help with transitions and simple animations.

### useCssAnimate
The `useCssAnimate` function is a utility for handling CSS animations on HTML elements. It provides a way to start and end CSS animations with a specified duration and optional callback function.


```typescript
const [cssAnimate, cssState] = useCssAnimate(elems: HTMLElement | HTMLElement[], baseCss: string = '');
```

Adds the following CSS classes to and element or elements

- `[custom name]-starting` or `starting` (if second param is empty) at the start of the animation
- `[custom name]-ending` or `ending` as the animation is ending
- `[custom name]-active` or `active` if the animation is active. Inactive state would be left without this class

#### Returns
`[(start: boolean, duration?: number, endFn?: () => void) => void, CSSActionStates]`: A tuple containing: A function to start the animation. An object representing the CSS action states. 

#### Example
```typescript
const [cssAnimate, cssState] = useCssAnimate(element, 'my-animation');

// To start the animation
cssAnimate(true, 500, () => {
    console.log('Animation started');
});

// To end the animation
cssAnimate(false, 500, () => {
    console.log('Animation ended');
});

console.log(cssState.starting) // returns the name of the starting class
console.log(cssState.ending) // returns the name of the ending class
console.log(cssState.active) // returns the name of the active class
```

### useTransition
The `useTransition` function is a utility for managing transitions. It provides a way to handle the start and end of transitions with a specified duration.

#### Returns
Function: A function that takes three parameters:
`startFn ((...args: any) => void)`: A function to be called when the transition starts.
`endFn ((...args: any) => void)`: A function to be called when the transition ends.
`duration (number, optional)`: The duration of the transition in milliseconds. Default is 300ms.

```typescript
const transition = useTransition();

const startTransition = () => {
    console.log('Transition started');
};

const endTransition = () => {
    console.log('Transition ended');
};

// Start the transition with a duration of 400ms
transition(startTransition, endTransition, 400);
```

#### Internal Functionality
The `useTransition` function maintains the state of the transition using a boolean flag (inTransition) and a timeout (tto). It also keeps track of the current end transition function (currEndTransitionFn).

When the returned function is called:

- If a transition is already in progress, it clears the current timeout and calls the current end transition function.
- It then calls the provided startFn to start the transition.
- It sets a timeout to call the provided endFn after the specified duration, marking the transition as complete.

This ensures that transitions are properly managed and do not overlap.