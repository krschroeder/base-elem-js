# Base Elem Js

`base-elem-js` is a light-weight utility for DOM manipulation, including querying elements, adding/removing classes, setting/removing attributes, transitions and handling events. This package takes advantage of many the modern features of JavaScript, which has evolved greatly over the years. The minified package comes in at __7kb__ which is about __92%__ smaller than jQuery 3.7.1! 

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
<script src="https://cdn.jsdelivr.net/npm/base-elem-js@2.1.0"></script>
```
 
<!-- [![](https://data.jsdelivr.com/v1/package/npm/base-elem-js/badge)](https://www.jsdelivr.com/package/npm/base-elem-js) -->
<!-- ## Features

To come, in the meantime check the [Home Page](https://github.com/krschroeder/base-elem-js#readme). -->

## Base Elem Methods

### Root Selector

The root selector grabs all elements via the `querySelectorAll` underneath the hood. It initializes a new instance of the `BaseElem` class, which serves as a lightweight wrapper for DOM elements. It allows for easy manipulation, traversal, and interaction with HTML elements.


```typescript
$be(selector?: string | SelectorRoot | BaseElem, base?: HTMLElement): 
```

#### Examples
```typescript
// Example 1: Initialize with a CSS selector
const $baseElem = $be('.my-class');

// Example 2: Initialize with a base element
const parent = document.getElementById('parent');
const $scopedElem = $be('.child-class', parent);

// Example 3: Initialize with an existing BaseElem instance
const $copiedElem = $be($baseElem);

// Example 4: Initialize with an array of elements
const lis = $be.find('li');//documented below in 'Static' section, returns HTMLElement[];
const $arrayElem = $be(lis);

// Example 5: Initialize with no elements
const emptyElem = $be();

```
### find

Finds elements via `querySelectorAll` within the current `BaseElem` instance and returns a new one based on the new selection.

```typescript
find(selector: string | (elem: HTMLElement, i: number) => HTMLElement[], filter?: (elem: any, i: number) => boolean): BaseElem
```

#### Examples
```typescript
$be('ul').find('li');
//returns list of <li>'s

$be('ul').find('li', el => $be.hasClass(el,'foo')); 
//returns only <li> with .foo class

$be('li').find(el => el.closest('ul'));
// returns the parent element <ul>

$be('li:first-child').find(el => el.nextElementSibling as HTMLLIElement);
// find the first then get the next element

```

### findBy
Finds elements by type (id, class, or tag) within the current elements and returns a new BaseElem instance. Choosing the type will select elements by `getElementById`, `getElementsByClassName` and `getElementsByTagName` underneath the hood.

```typescript
findBy(type: FindBy, selector: string, filter?: (elem: any, i: number) => boolean): BaseElem

```

#### Examples
```typescript
const $siteHeader = $be('#site-header'); 
//returns the <header id="site-header" /> element.

$siteHeader.findBy('tag','li'); 
//returns all the <li> items in the $siteHeader

$siteHeader.findBy('id', 'logo');
//returns element with the id 'logo'

$siteHeader.findBy('class', 'container');
//returns all items with the class 'container'

```

### findOne
Finds the first element matching the selector within the current elements and returns a new BaseElem instance.

```typescript
findOne(selector: string): BaseElem
```

### filter
Finds elements based on the filtering function within the current elements and returns a new BaseElem instance.

```typescript
filter(fn: (elem: HTMLElement, i: number) => boolean): BaseElem
```

### toArray
Returns a copy of the array of elements from the instance.

```typescript
toArray(): HTMLElement[]
```

### each
Iterates over each element and applies the provided function.

```typescript
each(fn: (elem: HTMLElement, i: number) => void): BaseElem
```

### get
Gets an exact element in the collection of elements.

```typescript
get(i: number): BaseElem
```

### map
The map method returns an array of the results of using the callback function to each element. Optionally, it can ensure that the results are unique. This is designed to primarily return elements, so by default it filters out 'falsy' values. If you need to filter an attribute or derive some value querying the elements, use the Array map method instead.

```typescript
map<T>(fn: (el: HTMLElement, i: number) => T, unique: boolean = true): (T | HTMLElement)[];

// Examples

const ulsList = $be('li').map(el => $li.map(el => el.closest('ul')));
// returns array of <ul>'s.

const liNexts = $be('li').map(el => el.nextElementSibling as HTMLElement);
//return's list of the next sibling <li>'s

```


### parents
The `parents` method retrieves all ancestor elements of the current elements that match a given CSS selector. The top-most element is stored first.

```typescript
parents(selector: string, untilElem?: HTMLElement | BaseElem | string): BaseElem
```

#### Examples
```typescript
const $childElem = $be('.child-element');

// Get all ancestor elements matching the selector '.parent-class'
const $parentElems = $childElem.parents('.parent-class');

// Get all ancestor elements matching '.parent-class' until the element with class '.stop-here',
// alternatively an HTMLElement can be passed
const $parentElemsUntil = $childElem.parents('.parent-class', '.stop-here');

// Remove '.active' class, then focus on the first <a> tag if the Escape key is hit
const $mainNav = $be('.main-nav');
$mainNav.on('keydown.mainNav', 'a', (elem, e) => {

    if (e.key === "Escape") {
        const $elLiParents = $be(document.activeElement).parents('li', $mainNav);
        // remove .active class from parent <li>
        $elLiParents.rmClass('.active')
        // focus on the first element
        .get(0).find('a').elem[0].focus();
    }
});
```

### siblings

The `siblings` method retrieves the sibling elements of a specific element in the current `BaseElem` instance. Optionally, it can filter the siblings by a CSS selector, include the reference element itself, and specify which element in the collection to use as the reference.

```typescript
siblings(
    selector?: string, 
    includeKeyEl?: boolean, 
    index?: number
): BaseElem
```

#### Examples
```typescript
const $li = $be('ul li');

const $siblingLis = $li.siblings('li'); //returns all siblings
const $siblings = $li.siblings();// just returns all sibling elements
const $siblingsIncludingKeyEl = $li.siblings('li', true);// include the siblings with the key/starting element;
```


### prev
The `prev` method retrieves the `previousElementSibling`, or if passing in a selector it can find the previous sibling that matches that criteria. If there is not a match available, the method will simply return the same element.

```typescript
const $li = $be('ul li:last-child');
const $prevLi = $li.prev('li'); // or just $li.prev()

```

### next
The `next` does the same as the `prev` method, except of course it retrieves the `nextElementSibling`. It also behaves the same as the `prev` method if there is no match or next sibling.

```typescript
const $li = $be('ul li');
const $nextLi = $li.next('li'); // or just $li.next()

```

### css
Sets or gets CSS properties for the current elements. If only passing a string, will return the property value.

```typescript
css(attrs: Partial<CSSProperties> | string): BaseElem | string;
```

#### Examples
```typescript
const $h1 = $be('h1');

$h1.css({color: 'green'}); // set the color green
$h1.css('color'); //returns the color 'green'

```

### addClass
Adds the specified class(es) to the current elements.

```typescript
addClass(cssNames: string | string[]): BaseElem
```

### rmClass
Removes the specified class(es) from the current elements.

```typescript
rmClass(cssNames: string | string[]): BaseElem
```

### tgClass
Toggles the specified class(es) on the current elements.

```typescript
tgClass(cssNames: string | string[], toggle?: boolean): BaseElem
```


### hasClass
Checks if the current elements have the specified class(es).

```typescript
hasClass(cssNames: string | string[], method: 'some' | 'every' = 'some'): boolean
```

### attr
Sets or gets attributes for the current elements.

```typescript
attr(attrs: Record<string, string> | string): BaseElem
```

### elemRects
Small wrapper over `elem.getBoundingClientRect()` that returns the proportions and positioning the first element if an index is not specified. Will return `undefined` if the index passed in is out of bounds of the `elem` array on the `BaseElem` object.

```typescript
elemRects(index: number = 0): DOMRect;
```

### offset
Retrieves the `top` and `left` values of an element relative to the document.

```typescript
offset(index: number = 0): {top: number, left: number};
```

### hasEls
Slightly easier way than determining if there are results than `$queryResult.elems.length`.

```typescript
hasEls: boolean //getter version
```
#### Example

```typescript
const $hashLinks = $be('a[href^="#"]');

if ($hashLinks.hasEls) {
    // do something
}

```

### size
A slightly easier way to get the length of the elements rather than `$beQuery.elems.length`

#### Example
```typescript
$be('li').size
//returns the length of the li elements
```


### empty
Empties the content of the current elements.

```typescript
empty(): BaseElem
```

### remove
Removes the current elements from the DOM.

```typescript
remove(): BaseElem
```

### insert
Inserts HTML or elements into the current elements using the specified method (append, prepend, after, before).

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

### html
Sets the inner HTML of the current elements. Left blank it will return the innerHTML.

```typescript
html(html?: string): BaseElem | string;

// Examples
const $h1 = $be.find('h1');
$h1.html();//gets the inner html of the <h1>
$h1.html('<em>Light Weight Babbbbay</em>!');

```

### text
Sets the inner text of the current elements. Left blank it will return the textContent.

```typescript
text(text?: string): BaseElem | string;
```

### on

Adds an event listener to the current elements. It's recommended to namespace the events with a '.', for example `click.myClickName`. This method is not designed to keep track of multiple events of the same name, so namespacing is important if you seek to potentially remove an event. Pass in an array or single value for the `evtName` parameter. For a __synthetic event__ pass it in `[]`, so `[syntheticEventName]`, this is essentially for the best Typescript support (otherwise string would invalidate the type checking of the event name).

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

### off
Removes an event listener from the current elements. Pass in the same string value as the 'on' method. Namespace with '.', or `click.myClickName` as the function name. Can also pass in an array of strings for the `evtName` param.

```typescript
// see EventName type right above
off(evtName: EventName | EventName[], config: boolean | AddEventListenerOptions = false): BaseElem;

// Examples
$div.off('click.myClickName');
//remove one event

$div.off(['mousemove.myMoveName', 'click.myClickName']);
//removes multiple events

```


### trigger
Triggers native events as well as synthetic events. Can also trigger namespaced events such as `click.myClickName`. 

```typescript
trigger(evtName: EventName, delgateEl?: string): BaseElem;

// Examples
$div.trigger('click.myClickName','button');

$div.trigger('[syntheticEventName]');

```

## Extending library
The BaseElem class can be refrenced for extension as seen below.

```typescript
$be.BaseElem.prototype.superbPlugin = superbPlugin();
```


## Base Elem Static

### make
Creates a new HTML element with the specified tag, attributes, and inner HTML content.

```typescript
$be.make(tag: string, propsOrHTML?: Record<string, any> | string, html?: string): HTMLElement;

// Example
const div = $be.make('div', { id: 'test', className: 'test' }, 
    `<h2>Hello Make!</h2>
    <p>Some copy goes here</p>`
);
// or no props
const div2 = $be.make('div.some-class-name#an-id-too', '<p>Some copy goes here!</p>');

document.body.append(div);

```

### isHidden
Checks if the specified element is hidden (i.e., has display: none or visibility: hidden).

```typescript
$be.isHidden(elem: HTMLElement): boolean
```


### isVisible
Checks if the specified element is visible (i.e., does not have display: none or visibility: hidden).

```typescript
$be.isVisible(elem: HTMLElement): boolean
```

### elemRects
Small wrapper over `elem.getBoundingClientRect()` that returns the proportions and positioning of an element.

```typescript
$be.elemRects(elem: HTMLElement): DOMRect;
```

### offset
Retrieves the `top` and `left` values of an element relative to the document.

```typescript
$be.offset(elem: HTMLElement): {top: number, left: number};
```
### find
Finds elements matching the selector within the specified base element.

```typescript
$be.find(selector: string, base: HTMLElement = document): HTMLElement[]
```


### findBy
Finds elements by type (id, class, or tag) within the specified base element.

```typescript
$be.findBy(type: FindBy, selector: string, base: HTMLElement = document): HTMLElement[]
```


### findOne
Finds the first element matching the selector within the specified base element.

```typescript
$be.findOne(selector: string, base: HTMLElement = document): HTMLElement
```

### map
The `map` function iterates over an array of HTML elements, applies a callback function to each element, and returns a new array containing the results. Optionally, it can ensure that the results are unique. The map function in this context is meant for DOM elements.

```typescript
$be.map<T>(
    elems: HTMLElement[], 
    fn: (el: HTMLElement, i: number) => T, 
    unique?: boolean
): (HTMLElement | T)[]
```

#### Examples
```typescript
const paras = $be.find('p');

const excellentP = $be.map(paras, (el) => $be.hasClass('.excellent'));
console.log(excellentP); // only <p> with the .excellent class

const lis = $be.find('li');
const uls = $be.map(lis, (el) => el.closest('ul'));
console.log(uls);// list of all the containing <ul> elements
```

### parents
Returns all the ancestor element of the target element.

```typescript
$be.parents(elem: HTMLElement, selector: string, untilElem?: HTMLElement | string): BaseElem
```



### siblings
The `siblings` function retrieves all sibling elements of a given element. Optionally, it can filter the siblings by a CSS selector and include the original element in the results.

```typescript
$be.siblings(
    elem: HTMLElement, 
    selector?: string, 
    includeKeyEl?: boolean
): HTMLElement[]
```

#### Examples
```typescript
import $be from 'base-elem-js';

// Example 1: Get all siblings of an element
const element = $be.findOne('.my-element');
const allSiblings = $be.siblings(element);
console.log(allSiblings); // [<div>, <span>, <p>, ...]

// Example 2: Get siblings that match a selector
const filteredSiblings = $be.siblings(element, '.filter-class');
console.log(filteredSiblings); // [<div.filter-class>, <span.filter-class>, ...]

// Example 3: Include the reference element in the results
const siblingsWithKeyEl = $be.siblings(element, null, true);
console.log(siblingsWithKeyEl); // [<div>, <span>, <p>, <.my-element>, ...]
```


### prev
The `prev` function retrieves the `previousElementSibling`, or if passing in a selector it can find the previous sibling that matches that criteria. If there is not a match available, the function will simply return the same element.

```typescript
const lastLi = $be.findOne('li:last-child');
const prevLi = $be.prev(lastLi,'li'); // or just $be.prev(lastLi) to get previous sibling

```

### next
The `next` does the same as the `prev` function, but retrieves the `nextElementSibling`. It also behaves the same if there is no match or next sibling.

```typescript
const firstLi = $be.findOne('li');
const $nextLi = $be.next(firstLi, 'li'); // or just $be.next(firstLi)
```

### addClass
Adds the specified class(es) to the element.

```typescript
$be.addClass(elem: HTMLElement, cssNames: string | string[]): void;

// Examples
const div = $be.findOne('div');

// add a single class
$be.addClass(div, 'new-class');

// add multiple
$be.addClass(div, ['new-class', 'another']);

```

### rmClass
Removes the specified class(es) from the element.

```typescript
$be.rmClass(elem: HTMLElement, cssNames: string | string[]): void
```

### tgClass
Toggles the specified class(es) on the element.

```typescript
$be.tgClass(elem: HTMLElement, cssNames: string | string[], toggle?: boolean): void
```

### hasClass
Checks if the element has the specified class(es).

```typescript
$be.hasClass(elem: HTMLElement, cssNames: string | string[], method: 'some' | 'every' = 'some'): boolean
```

### attr
Sets or gets attributes for the element.

```typescript
$be.attr(elem: HTMLElement, attrs: Record<string, string> | string): void
```

### empty
Empties the content of the element.

```typescript
$be.empty(elem: HTMLElement): void
```

### remove
Removes the element from the DOM.

```typescript
$be.remove(elem: HTMLElement): void
```

### html
Sets the inner HTML of the element.

```typescript
$be.html(elem: HTMLElement, html: string): void
```

### text
Sets the inner text of the element.

```typescript
$be.text(elem: HTMLElement, text: string): void
```


### htmlParse

The `htmlParse` function parses a string of HTML into an array of DOM `ChildNode` objects. It ensures that any `<script>` tags in the input are removed for security and non-executability.

```typescript
$be.htmlParse(htmlStr: string): ChildNode[];
```

#### Examples

```typescript
import $be from 'base-elem-js';

// Example 1: Parse a simple HTML string
const nodes = $be.htmlParse('<h1>Light-weight Babbbyyyyy!</h1><p>Yeah buddy!</p>');
console.log(nodes); // [HTMLHeadingElement, HTMLParagraphElement]

// Example 2: Parse HTML with a script tag (script will be removed)
const nodesWithScript = $be.htmlParse('<div>Content</div><script>alert("Hi");</script>');
console.log(nodesWithScript); // [HTMLDivElement]
```

### on
Adds an event listener to the current elements. Namespace the events with a '.', for example `click.myClickName`.

```typescript
$be.on(
    baseEl: EventElem, 
    evtName: `${Event['type']}.${string}` | string, 
    fn: EventFn, 
    delegateEl: string | HTMLElement[] = null, 
    config: boolean | AddEventListenerOptions = false
);
```


### off
Removes an event listener from the current elements. Pass in the same string value as the 'on' method. Namespace with '.', or `click.myClickName` as the function name.

```typescript
$be.off(evtName: string, config: boolean | AddEventListenerOptions = false);
```

### trigger
Trigger native, synthetic and namespaced navtive events.

```typescript
$be.trigger( 
    target: HTMLElement, 
    evtName: string, 
    delegateEl?: string | null, 
    data?: any[], 
    config?: boolean | AddEventListenerOptions
);
```

### merge
The `merge` function is a utility for combining multiple objects into a single target object. It supports options for deep merging, excluding null or falsy values.

```typescript
$be.merge(
    configOrTarget: MergeOptions | MergeOptions[] | GenericObj, 
    ...objects: GenericObj[]
): GenericObj
```
#### Parameters
1. configOrTarget
    - Type: MergeOptions | MergeOptions[] | GenericObj  
    - Description: The first parameter can either be:
        - A configuration option or array of options ('deep', 'noNull', 'noFalsy').
        - The target object to merge into.
2. ...objects
    - Type: `GenericObj[]`
    - Description: One or more objects to merge into the target object.

#### Options
The following options can be passed as part of configuration as the first paramenter:

- 'deep'/true: Enables deep merging of nested objects.
- 'noNull': Excludes properties with null values from the merged result.
- 'noFalsy': Excludes properties with falsy values (`null, undefined, false, 0, ''`) from the merged result.
- Or an array of the above.
__note:__ Falsy or `null` values will not be removed from the base target object.

#### Examples

##### Basic Merge
```typescript
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };

const result = $be.merge(obj1, obj2);
console.log(result); // { a: 1, b: 3, c: 4 }
```
##### Deep Merge
```typescript
const obj1 = { a: { x: 1 }, b: 2 };
const obj2 = { a: { y: 2 }, c: 3 };

const result = $be.merge(['deep'], obj1, obj2); 
const result2 = $be.merge(true, obj1, obj2);// or could pass in `true` for first param
console.log(result); // { a: { x: 1, y: 2 }, b: 2, c: 3 }
```

##### Exclude `null` or Falsy Values
```typescript
const obj1 = { a: 1, b: 'B', c: 'C', d: "D" };
const obj2 = { b: 2, c: null, d: '' };

const result = $be.merge('noNull', obj1, obj2);
console.log(result); // { a: 1, b: 2 }
```

## Utils

### toType
Fixes the `typeof` which isn't actually reliable in JS. Taken verbatim from [Angus Croll](https://goo.gl/pxwQGp) and is used internally in this project.

```typescript
$be.toType(object: any);
```

#### Examples
```typescript
$be.toType([]) // returns 'array'
$be.toType('') // return 'string'
$be.toType(null) // returns 'null' (instead of 'object')

// etc...
```

Few utility short-cuts used internally that are now available.

### af
Short-cut for `Array.from`.

### isStr
Short-cut function for `typeof someVar === 'string'`.

### isArr
Short-cut for `Array.isArray`.

### oa
Short-cut for `Object.assign`.

## Animate/Transition Static Methods
This library includes a couple extra functions to help with transitions and simple animations.

### useCssAnimate
The `useCssAnimate` function is a utility for handling CSS animations on HTML elements. It provides a way to start and end CSS animations with a specified duration and optional callback function.


```typescript
const [cssAnimate, cssState] = $be.useCssAnimate(elems: HTMLElement | HTMLElement[], baseCss: string = '');
```
Adds the following CSS classes to and element or elements

- `[custom name]-starting` or `starting` (if second param is empty) at the start of the animation
- `[custom name]-ending` or `ending` as the animation is ending
- `[custom name]-active` or `active` if the animation is active. Inactive state would be left without this class

#### Returns
`[(start: boolean, duration?: number, endFn?: () => void) => void, CSSActionStates]`: A tuple containing: A function to start the animation. An object representing the CSS action states. 

#### Example
```typescript
const [cssAnimate, cssState] = $be.useCssAnimate(element, 'my-animation');

// To start the animation
$be.cssAnimate(true, 500, () => {
    console.log('Animation started');
});

// To end the animation
$be.cssAnimate(false, 500, () => {
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
const transition = $be.useTransition();

const startTransition = () => {
    console.log('Transition started');
};

const endTransition = () => {
    console.log('Transition ended');
};

// Start the transition with a duration of 400ms
$be.transition(startTransition, endTransition, 400);
```

#### Internal Functionality
The `useTransition` function maintains the state of the transition using a boolean flag (inTransition) and a timeout (tto). It also keeps track of the current end transition function (currEndTransitionFn).

When the returned function is called:

- If a transition is already in progress, it clears the current timeout and calls the current end transition function.
- It then calls the provided startFn to start the transition.
- It sets a timeout to call the provided endFn after the specified duration, marking the transition as complete.

This ensures that transitions are properly managed and do not overlap.