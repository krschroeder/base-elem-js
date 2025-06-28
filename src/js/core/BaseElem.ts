import type {
    AppendMethod,
    CSSProperties,
    EventName,
    EventFn,
    FilterFn,
    FindBy,
    MapFn,
    SelectorElems,
    SelectorElem,
    SelectorRoot
} from '../types';

import BaseStatic from './BaseStatic';
import { isArr, isStr } from './helpers';
 

const {
    addClass,
    attr,
    css,
    elemRects,
    empty,
    find,
    findBy,
    findOne,
    map,
    hasClass,
    htmlParse,
    off,
    on,
    parents,
    siblings,
    trigger,
    rmClass,
    tgClass
} = BaseStatic

const noElemMsg = 'Element is not defined with index: ';

class BaseElem {
    elem: SelectorElems = [];

    constructor(selector?: string | SelectorRoot | BaseElem, base?: HTMLElement) {
        if(isStr(selector)) {

            this.elem = find(selector, base);

        } else if (selector instanceof BaseElem){
            this.elem = [...selector.elem];
        } else {
            //not checking type for HTMLElement[]
            if (selector) {
                this.elem = isArr(selector) ? selector : [selector];
            }
        }
        return this;
    }

    // ---------------
    // region Private Methods
    // ---------------
    #iterate(fn: (el: HTMLElement, i:number) => void): void {
        let i = 0, elem;
        while (elem = this.elem[i]) {
            fn(elem, i++);
        }   
    }

    #strOrObj <T>(attrs: T, fn: (elem: HTMLElement, attrs: T) => string = () => ''): string {
        if (isStr(attrs)) {
            const elem = this.elem[0] as HTMLElement;
            return fn(elem, attrs);
        } else {
            this.#iterate(elem => fn(elem, attrs));
        }
        return '';
    }

    #content(fn:(content: string) => string | Node | ChildNode[], content?: string) {
        if (content) {
            this.#iterate((elem: HTMLElement) => {
                empty(elem);
                const nodes = fn(content);
                isArr(nodes) ? elem.append(...nodes): elem.append(nodes);
            });
        } else {
            // return copy
            return this.elem[0];
        }
        return null;
    }

    // ---------
    // region Selectors
    // ---------
    find(selector: string | MapFn, filter?: FilterFn): BaseElem {
        if (isStr(selector)) {

            const elems = this.elem.map(elem => find(selector, elem)).flat();
            return new BaseElem(filter ? elems.filter(filter) : elems);
        } else {
           
            return new BaseElem(this.map<ReturnType<typeof selector>>(selector, true))
        }
    }

    findBy(type: FindBy, selector: string, filter?: (elem: any, i: number) => boolean): BaseElem {
      
        const elems = this.elem.map(elem => findBy(type, selector, elem )).flat();
        return new BaseElem(filter ? elems.filter(filter) : elems);
    }

    findOne(selector: string): BaseElem {
        
        const elem = this.elem.map(elem => findOne(selector, elem)).filter(Boolean);
        return new BaseElem(elem);
    }

    filter(fn: FilterFn): BaseElem {
        // not error checking for the document or window
        return new BaseElem ((this.elem as HTMLElement[]).filter(fn));
    }

    // -------------------
    // region Array and iteration
    // -------------------
    toArray() {
        return [...this.elem];
    }

    map <T>(fn: (el: HTMLElement, i:number) => T, unique: boolean = false): (HTMLElement | T)[] {
        return map (this.elem as HTMLElement[], fn, unique);
    }

    parents(selector: string, untilElem?: HTMLElement | BaseElem | string): BaseElem {
        if (untilElem instanceof BaseElem) untilElem = untilElem.elem[0] as HTMLElement;
        const elems = map(this.elem as HTMLElement[], (elem) => parents(elem, selector, untilElem));
        return new BaseElem(elems.flat());
    }

    siblings(selector?: string, includeKeyEl: boolean = false, index: number = 0) : BaseElem {
        return new BaseElem(siblings(this.elem[index] as HTMLElement, selector, includeKeyEl));
    }

    get(index: number): BaseElem {
        const elem = this.elem[index];
        if (elem) return new BaseElem(elem);
        else console.warn(noElemMsg + index);
    }

    each(fn: (elem: HTMLElement, i: number) => void): BaseElem {
        this.#iterate(fn);
        return this;
    }

    // ---------------------
    // region Attributes and styles
    // ---------------------
    css(attrs: string): string;
    css(attrs: Partial<CSSProperties>): BaseElem;
    css(attrs: Partial<CSSProperties> | string): string | BaseElem {

        const val = this.#strOrObj(attrs, css);
        if (val) return val;
        return this;
    }

    addClass(cssNames: string | string[]): BaseElem {
        this.#iterate(elem => addClass(elem, cssNames));

        return this;
    }

    rmClass(cssNames: string | string[]): BaseElem {
        this.#iterate(elem => rmClass(elem, cssNames));

        return this;
    }

    tgClass(cssNames: string | string[], toggle?: boolean): BaseElem {
        this.#iterate(elem => tgClass(elem as HTMLElement, cssNames, toggle));

        return this;
    }

    hasClass(cssNames: string | string[], method: 'some' | 'every' = 'some'): boolean {
        return !isArr(this.elem) ? 
            hasClass(this.elem as HTMLElement, cssNames) : 
            method === 'some' ? 
            this.elem.some(elem => hasClass(elem as HTMLElement, cssNames)): 
            this.elem.every(elem => hasClass(elem as HTMLElement, cssNames))
        ;
    }

    attr(attrs: string): string;
    attr(attrs: Record<string,string> ): BaseElem;
    attr(attrs: Record<string,string> | string): BaseElem | string {
        const val = this.#strOrObj(attrs, attr);
        if (val) return val;
        return this;
    }

    elemRects(index: number = 0) {
        const elem = this.elem[index] as HTMLElement;
        if (elem) {
            return elemRects(elem);
        } else console.warn(noElemMsg + index);
    }

    get hasEls():boolean {
        return this.elem.length > 0;
    }

    get size():number {
        return this.elem.length;
    }

    // ------------------------------
    // region Removal and Appending Elements
    // ------------------------------
    empty(): BaseElem {
        this.#iterate(empty);
        return this;
    }

    remove(): BaseElem {
        this.#iterate(elem=> (elem as HTMLElement).remove());
        return this;
    }

    insert(
        html: string | HTMLElement | BaseElem | (BaseElem | HTMLElement)[], 
        method: AppendMethod = 'append'
    ): BaseElem {
        this.#iterate((elem: HTMLElement) => {
            const elems = (isArr(html) ? html.map(getElems).flat() : isStr(html) ? htmlParse(html) : getElems(html)) as HTMLElement[];
 
            if (method === 'append')    elem.append(...elems);
            if (method === 'prepend')   elem.prepend(...elems);
            if (method === 'after')     elem.after(...elems);
            if (method === 'before')    elem.before(...elems);
        });
        return this;
    }
    
    html(): string;
    html(html: string): BaseElem;
    html(html?: string): BaseElem | string {

        const retEl = this.#content(htmlParse, html);
        if (retEl) return (retEl as HTMLElement).innerHTML.trim();

        return this;
    }

    text(): string;
    text(text: string): BaseElem;
    text(text?: string): BaseElem | string {

        const retEl = this.#content((text: string) => new Text(text), text);
        if (retEl) return (retEl as HTMLElement).textContent.trim();
       
        return this;
    }

    // ------
    // region Events
    // ------
    on(
        evtName: EventName | EventName[], 
        fn: EventFn, 
        delegateEl: string | HTMLElement[] = null,
        config: boolean | AddEventListenerOptions = false
    ): BaseElem {

        if (isArr(evtName)) {
            for (const evName of evtName) {
                this.#iterate((elem: SelectorElem) => on(elem, evName, fn, delegateEl, config));
            }
        } else {
            this.#iterate((elem: SelectorElem) => on(elem, evtName, fn, delegateEl, config));
        }
        return this;
    }

    trigger(evtName: string, delgateEl?: string): BaseElem {
        this.#iterate((elem: SelectorElem) => trigger(elem, evtName, delgateEl));
        return this;
    }

    off(evtName: EventName | EventName[], config: boolean | AddEventListenerOptions = false): BaseElem {

        if (isArr(evtName)) {
            for (const evName of evtName) {
                this.#iterate((elem: SelectorElem) => off(elem, evName, config));
            }
        } else {
            this.#iterate((elem: SelectorElem) => off(elem, evtName, config));
        }
        return this;
    }
}

// 
// Helper
// 

const getElems = (el:HTMLElement | BaseElem) => el instanceof BaseElem ? el.elem : [el];

export default BaseElem;