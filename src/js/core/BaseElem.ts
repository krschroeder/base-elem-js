import type {
    AppendMethod,
    CSSProperties,
    EventName,
    EventFn,
    FindBy,
    SelectorElems,
    SelectorElem,
    SelectorRoot
} from '../types';

import BaseStatic from './BaseStatic';

// Dom shortcuts
const isArr = Array.isArray;

const {
    addClass,
    attr,
    css,
    empty,
    find,
    findBy,
    findOne,
    hasClass,
    htmlParse,
    off,
    on,
    trigger,
    rmClass,
    tgClass
} = BaseStatic

class BaseElem {
    elem: SelectorElems = [];

    constructor(selector?: string | SelectorRoot | BaseElem, base?: HTMLElement) {
        if(typeof selector === 'string') {

            this.elem = find(selector, base);

        } else if (selector instanceof BaseElem){
            this.elem = [...selector.elem];
        } else {
            //not checking type for HTMLElement[]
            if (isArr(selector)) {

                this.elem = selector;
            } else {
                this.elem = [selector];
            }
        }
        return this;
    }

    #iterate(fn: (el: HTMLElement, i:number) => void): void {
        let i = 0, elem;
        while (elem = this.elem[i]) {
            fn(elem, i++);
        }   
    }

    find(selector: string, filter?: (elem: any, i: number) => boolean): BaseElem {
        const elems = this.elem.map(elem => find(selector, elem )).flat();
        return new BaseElem(filter ? elems.filter(filter) : elems);
    }

    findBy(type: FindBy, selector: string, filter?: (elem: any, i: number) => boolean): BaseElem {
      
        const elems = this.elem.map(elem => findBy(type, selector, elem )).flat();
        return new BaseElem(filter ? elems.filter(filter) : elems);
    }

    findOne(selector: string): BaseElem {
        
        const elem = this.elem.map(elem => findOne(selector, elem));
        return new BaseElem(elem);
    }

    filter(fn: (elem: HTMLElement, i: number) => boolean): BaseElem {
        // not error checking for the document or window
        return new BaseElem ((this.elem as HTMLElement[]).filter(fn));
    }

    toArray() {
        return [...this.elem];
    }

    each(fn: (elem: HTMLElement, i: number) => void): BaseElem {
        this.#iterate(fn);
        return this;
    }

    css(attrs: string): string;
    css(attrs: Partial<CSSProperties>): BaseElem;
    css(attrs: Partial<CSSProperties> | string): string | BaseElem {
        if (typeof attrs === 'string') {
            const elem = this.elem[0] as HTMLElement;
            return css(elem, attrs);
        } else {
            this.#iterate(elem => css(elem, attrs));
        }
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

        if (typeof attrs === 'string') {
            const elem = isArr(this.elem) ? this.elem[0] : this.elem;
            return attr(elem as HTMLElement, attrs);

        } else {
            this.#iterate(elem => attr(elem as HTMLElement, attrs));
        }

        return this;
    }

    empty(): BaseElem {
        this.#iterate(empty);
        return this;
    }

    remove(): BaseElem {
        this.#iterate(elem=> (elem as HTMLElement).remove());
        return this;
    }

    insert(
        html: string | HTMLElement | HTMLElement[], 
        method: AppendMethod = 'append'
    ): BaseElem {
        this.#iterate((elem: HTMLElement) => {
            const elems = (typeof html === 'string' ? htmlParse(html) : isArr(html) ? html : [html]) as HTMLElement[];
           
            if (method === 'append') elem.append(...elems);
            if (method === 'prepend') elem.prepend(...elems);
            if (method === 'after') elem.after(...elems);
            if (method === 'before') elem.before(...elems);
        });
        return this;
    }

    html(html: string): BaseElem {
        this.#iterate((elem: HTMLElement) => {
            empty(elem);
            elem.append(...htmlParse(html));
        });
        return this;
    }

    text(text: string): BaseElem {
        this.#iterate((elem: HTMLElement) => {
            empty(elem);
            elem.append(new Text(text));
        });
        return this;
    }

    on(
        evtName: EventName | EventName[], 
        fn: EventFn, 
        delegateEl: string = null,
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

export default BaseElem;