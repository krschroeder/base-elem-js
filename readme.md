# Base Elem Js

`base-elem-js` is a light-weight utility for DOM manipulation, including querying elements, adding/removing classes, setting/removing attributes, transitions and handling events. This package takes advantage of many the modern features of JavaScript, which has evolved greatly over the years. The minified package comes in at __~5.4kb__ which is about __93.7%__ smaller than jQuery 3.7.1! 

## Usage
To use the `base-elem-js` utility, you need to import it as follows:

```typescript
import $be from 'base-elem-js';
```

### Use via a CDN
Or you can simply add to your project via a CDN.

```html
<!-- latest -->
<script src="https://cdn.jsdelivr.net/npm/base-elem-js"></script>
<script src="https://cdn.jsdelivr.net/npm/base-elem-js/dist/js/base-elem-js.min.js"></script>

<!-- unminified latest-->
<script src="https://cdn.jsdelivr.net/npm/base-elem-js/dist/js/base-elem-js.js"></script>

<!-- by version -->
<script src="https://cdn.jsdelivr.net/npm/base-elem-js@1.6.5"></script>
```
 
<!-- [![](https://data.jsdelivr.com/v1/package/npm/base-elem-js/badge)](https://www.jsdelivr.com/package/npm/base-elem-js) -->
<!-- ## Features

To come, in the meantime check the [Home Page](https://github.com/krschroeder/base-elem-js#readme). -->

## Base Elem Methods
```typescript
find(selector: string | (elem: HTMLElement, i: number) => HTMLElement[], filter?: (elem: any, i: number) => boolean): BaseElem

// Examples
$be('ul').find('li');
//returns list of <li>'s

const bes = $be.static;
$be('ul').find('li', el => bes.hasClass(el,'foo')); 
//returns only <li> with .foo class

$be('li').find(el => el.closest('ul'));
// returns the parent element <ul>

$be('li:first-child').find(el => el.nextElementSibling as HTMLLIElement);
// find the first then get the next element

```

### findBy
Finds elements matching the selector within the current elements and returns a new BaseElem instance.
```typescript
findBy(type: FindBy, selector: string, filter?: (elem: any, i: number) => boolean): BaseElem

// Examples
const $siteHeader = $be('#site-header'); 
//returns the <header id="site-header" /> element.

$siteHeader.findBy('tag','li'); 
//returns all the <li> items in the $siteHeader

```
Finds elements by type (id, class, or tag) within the current elements and returns a new BaseElem instance.

### findOne
```typescript
findOne(selector: string): BaseElem
```
Finds the first element matching the selector within the current elements and returns a new BaseElem instance.

### filter
```typescript
filter(fn: (elem: HTMLElement, i: number) => boolean): BaseElem
```
Finds elements based on the filtering function within the current elements and returns a new BaseElem instance.

### toArray
```typescript
toArray(): HTMLElement[]
```
Returns a copy of the array of elements from the instance.

### each
```typescript
each(fn: (elem: HTMLElement, i: number) => void): BaseElem
```
Iterates over each element and applies the provided function.

### map
```typescript
map<T>(fn: (el: HTMLElement, i: number) => T, unique: boolean = true): (T | HTMLElement)[];

// Examples

const ulsList = $be('li').map(el => $li.map(el => el.closest('ul')));
// returns array of <ul>'s.

const liNexts = $be('li').map(el => el.nextElementSibling as HTMLElement);
//return's list of the next sibling <li>'s

```
The map method returns an array of the results of applying the function to each element. Optionally, it can ensure that the results are unique. This is designed to primarily return elements, so by default it filters out 'falsy' values, so be aware! If you need to filter an attribute or derive some value querying the elements, use the Array map method instead.

### css
```typescript
css(attrs: Partial<CSSProperties> | string): BaseElem | string;

// Examples
const $h1 = $be('h1');

$h1.css({color: 'green'}); // set the color green
$h1.css('color'); //returns the color 'green'

```
Sets or gets CSS properties for the current elements. If only passing a string, will return the property value.

### addClass
```typescript
addClass(cssNames: string | string[]): BaseElem
```
Adds the specified class(es) to the current elements.

### rmClass
```typescript
rmClass(cssNames: string | string[]): BaseElem
```
Removes the specified class(es) from the current elements.

### tgClass
```typescript
tgClass(cssNames: string | string[], toggle?: boolean): BaseElem
```
Toggles the specified class(es) on the current elements.


### hasClass
```typescript
hasClass(cssNames: string | string[], method: 'some' | 'every' = 'some'): boolean
```
Checks if the current elements have the specified class(es).

### attr
```typescript
attr(attrs: Record<string, string> | string): BaseElem
```
Sets or gets attributes for the current elements.

### empty
```typescript
empty(): BaseElem
```
Empties the content of the current elements.

### remove
```typescript
remove(): BaseElem
```
Removes the current elements from the DOM.

### insert
```typescript
insert(
    html: string | HTMLElement | BaseElem | (BaseElem | HTMLElement)[], 
    method: AppendMethod = 'append'
): BaseElem

// Examples
const $body = $be.findOne(document.body);

$body.find('h1').insert('<p>Some more copy</p>', 'before');
$body.insert('<p>Copy Prepended</p>', 'prepend');

```
Inserts HTML or elements into the current elements using the specified method (append, prepend, after, before).

### html
```typescript
html(html?: string): BaseElem | string;

// Examples
const $h1 = $be.find('h1');
$h1.html();//gets the inner html of the <h1>
$h1.html('<em>Light Weight Babbbbay</em>!');

```
Sets the inner HTML of the current elements. Left blank it will return the innerHTML.

### text
```typescript
text(text?: string): BaseElem | string;
```
Sets the inner text of the current elements. Left blank it will return the textContent.

### on
```typescript
// types for the Event
export type NativeEvents = keyof HTMLElementEventMap;
export type WindowEvents = keyof WindowEventHandlersEventMap;
export type DocEvents = keyof DocumentEventMap;
export type EventName = `${NativeEvents | WindowEvents | DocEvents}.${string}` | NativeEvents | WindowEvents | DocEvents | SyntheticEvent;
 
on(
    evtName: EventName | EventName[], 
    fn: EventFn, 
    delegateEl: string | HTMLElement[] = null, 
    config: boolean | AddEventListenerOptions = false
): BaseElem;

// Examples
const $div = $be(div);

// attach a click event on a <div> and delegate the event to its <button> elements
$div.on('click.myClickName', (ev, elem) => {
    console.log('clicked', elem.textContent);
},'button');

// attach multiple events
$div.on(['mousemove.myMoveName', 'click.myClickName2'], (ev, elem) => {
    // your code here
},'button');

$div.on('[syntheticEventName]', (ev, elem) => {
    console.log('synthetic event!', ev.type, elem)
})

```
Adds an event listener to the current elements. It's recommended to namespace the events with a '.', for example `click.myClickName`. This method is not designed to keep track of multiple events o the same name, so namespacing is important if you seek to potentially remove an event. Pass in an array or single value for the `evtName` parameter. For a __synthetic event__ pass it in `[]`, so `[syntheticEventName]`, this is essentially for the best Typescript support (otherwise string would invalidate the type checking of the event name).

### off
```typescript
// see EventName type right above
off(evtName: EventName | EventName[], config: boolean | AddEventListenerOptions = false): BaseElem;

// Examples
$div.off('click.myClickName');
//remove one event

$div.off(['mousemove.myMoveName', 'click.myClickName']);
//removes multiple events

```
Removes an event listener from the current elements. Pass in the same string value as the 'on' method. Namespace with '.', or `click.myClickName` as the function name. Can also pass in an array of strings for the `evtName` param.


### trigger
```typescript
trigger(evtName: EventName, delgateEl?: string): BaseElem;

// Examples
$div.trigger('click.myClickName','button');

$div.trigger('[syntheticEventName]');

```
Triggers native events as well as synthetic events. Can also trigger namespaced events such as `click.myClickName`. 

## Extending library
The BaseElem class can be refrenced for extension as seen below.

```typescript
$be.BaseElem.prototype.superbPlugin = superbPlugin();
```


## Base Elem Static ($be.static)

### make
```typescript
make(tag: string, propsOrHTML?: Record<string, any> | string, html?: string): HTMLElement;

// Example
const { make } = $be.static;

const div = make('div', { id: 'test', className: 'test' }, 
    `<h2>Hello Make!</h2>
    <p>Some copy goes here</p>`
);
// or no props
const div2 = make('div.some-class-name#an-id-too', '<p>Some copy goes here!</p>');

document.body.append(div);

```
Creates a new HTML element with the specified tag, attributes, and inner HTML content.


### isHidden
```typescript
isHidden(elem: HTMLElement): boolean
```
Checks if the specified element is hidden (i.e., has display: none or visibility: hidden).


### isVisible
```typescript
isVisible(elem: HTMLElement): boolean
```
Checks if the specified element is visible (i.e., does not have display: none or visibility: hidden).

### elemRects
```typescript
elemRects(elem: HTMLElement): DOMRect;
```
Small wrapper over `elem.getBoundingClientRect()` that returns the proportions and positioning of an element.

### find
```typescript
find(selector: string, base: HTMLElement = document): HTMLElement[]
```
Finds elements matching the selector within the specified base element.


### findBy
```typescript
findBy(type: FindBy, selector: string, base: HTMLElement = document): HTMLElement[]
```
Finds elements by type (id, class, or tag) within the specified base element.


### findOne
```typescript
findOne(selector: string, base: HTMLElement = document): HTMLElement
```
Finds the first element matching the selector within the specified base element.

### addClass
```typescript
addClass(elem: HTMLElement, cssNames: string | string[]): void;

// Examples
const div = bes.findOne('div');

// add a single class
bes.addClass(div, 'new-class');

// add multiple
bes.addClass(div, ['new-class', 'another']);

```
Adds the specified class(es) to the element.

### rmClass
```typescript
rmClass(elem: HTMLElement, cssNames: string | string[]): void
```
Removes the specified class(es) from the element.

### tgClass
```typescript
tgClass(elem: HTMLElement, cssNames: string | string[], toggle?: boolean): void
```
Toggles the specified class(es) on the element.

### hasClass
```typescript
hasClass(elem: HTMLElement, cssNames: string | string[], method: 'some' | 'every' = 'some'): boolean
```
Checks if the element has the specified class(es).

### attr
```typescript
attr(elem: HTMLElement, attrs: Record<string, string> | string): void
```
Sets or gets attributes for the element.

### empty
```typescript
empty(elem: HTMLElement): void
```
Empties the content of the element.

### remove
```typescript
remove(elem: HTMLElement): void
```
Removes the element from the DOM.

### html
```typescript
html(elem: HTMLElement, html: string): void
```
Sets the inner HTML of the element.

### text
```typescript
text(elem: HTMLElement, text: string): void
```
Sets the inner text of the element.

### on
```typescript
on(
    baseEl: EventElem, 
    evtName: `${Event['type']}.${string}` | string, 
    fn: EventFn, 
    delegateEl: string | HTMLElement[] = null, 
    config: boolean | AddEventListenerOptions = false
);
```
Adds an event listener to the current elements. Namespace the events with a '.', for example `click.myClickName`.


### off
```typescript
off(evtName: string, config: boolean | AddEventListenerOptions = false);
```
Removes an event listener from the current elements. Pass in the same string value as the 'on' method. Namespace with '.', or `click.myClickName` as the function name.

### trigger
```typescript
trigger( target: HTMLElement, evtName: string, delegateEl?: string, config?: boolean | AddEventListenerOptions);
```
Trigger native, synthetic and namespaced navtive events.


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