import type {
    FindBy,
    AppendMethod,
    EventFn,
    Selector,
    CSSProperties
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
    elem: HTMLElement[] | HTMLElement = [];

    constructor(selector?: Selector | BaseElem, base?: HTMLElement) {
        if(typeof selector === 'string') {

            this.elem = find(selector, base);

        } else if (selector instanceof BaseElem){
            this.elem = selector.elem;
        } else {
            //not checking type for HTMLElement[]
            this.elem = selector;
        }
        return this;
    }

    #elemOrElems(fn: (elem: HTMLElement, i:number) => void): void {
        isArr(this.elem) ? 
            this.elem.forEach(fn) : 
            fn(this.elem, 0)
        ;
    }

    find(selector: string, filter?: (elem: any, i: number) => boolean): BaseElem {
        if (isArr(this.elem)) {
            const elems = this.elem.map(elem => find(selector, elem )).flat();
            return new BaseElem(filter ? elems.filter(filter) : elems);

        } else {
            const elems = find(selector, this.elem);
            return new BaseElem(filter ? elems.filter(filter) : elems);
        }
        
    }

    findBy(type: FindBy, selector: string, filter?: (elem: any, i: number) => boolean): BaseElem {
        if (isArr(this.elem)) {
            const elems = this.elem.map(elem => findBy(type, selector, elem )).flat();
            return new BaseElem(filter ? elems.filter(filter) : elems);
        } else {
            const elems = findBy(type, selector, this.elem);

            if (isArr(elems)) { 

                return new BaseElem(filter ? elems.filter(filter) : elems);
            } else {
                return new BaseElem(filter(elems, 0) ? new BaseElem(elems) : new BaseElem([]));
            }
        } 
    }

    findOne(selector: string): BaseElem {
        if (isArr(this.elem)) {
            const elem = this.elem.map(elem => findOne(selector, elem));
            
            return new BaseElem(elem[0] !== null ? elem[0] : []);
        } else {
            return new BaseElem(findOne(selector, this.elem));
        }
    }

    each(fn: (elem: HTMLElement, i: number) => void): BaseElem {
        this.#elemOrElems(fn);
        return this;
    }

    css(attrs: string): string;
    css(attrs: Partial<CSSProperties>): BaseElem;
    css(attrs: Partial<CSSProperties> | string): string | BaseElem {

        this.#elemOrElems(elem => css(elem, attrs));
        const attrIsStr = typeof attrs === 'string';

        if (isArr(this.elem)) {
            if(attrIsStr) {
                return css(this.elem[0], attrs);
            } else {
                this.elem.forEach(elem => css(elem, attrs));
            }
        } else {
            const strVal = css(this.elem, attrs);

            if (strVal) return strVal;
        }
        return this;
    }

    addClass(cssNames: string | string[]): BaseElem {
        this.#elemOrElems(elem => addClass(elem, cssNames));

        return this;
    }

    rmClass(cssNames: string | string[]): BaseElem {
        this.#elemOrElems(elem => rmClass(elem, cssNames));

        return this;
    }

    tgClass(cssNames: string | string[], toggle?: boolean): BaseElem {
        this.#elemOrElems(elem => tgClass(elem, cssNames, toggle));

        return this;
    }

    hasClass(cssNames: string | string[], method: 'some' | 'every' = 'some'): boolean {
        return !isArr(this.elem) ? 
            hasClass(this.elem, cssNames) : 
            method === 'some' ? 
            this.elem.some(elem => hasClass(elem, cssNames)): 
            this.elem.every(elem => hasClass(elem, cssNames))
        ;
    }

    attr(attrs: Record<string,string> | string): BaseElem {
        this.#elemOrElems(elem => attr(elem, attrs));

        return this;
    }

    empty(): BaseElem {
        this.#elemOrElems(empty);
        return this;
    }

    remove(): BaseElem {
        this.#elemOrElems(elem => elem.remove());
        return this;
    }

    insert(
        html: string | HTMLElement | HTMLElement[], 
        method: AppendMethod = 'append'
    ): BaseElem {
        this.#elemOrElems(elem => {
            const elems = typeof html === 'string' ? htmlParse(html) : isArr(html) ? html : [html];
           
            if (method === 'append') elem.append(...elems);
            if (method === 'prepend') elem.prepend(...elems);
            if (method === 'after') elem.after(...elems);
            if (method === 'before') elem.before(...elems);
        });
        return this;
    }

    html(html: string): BaseElem {
        this.#elemOrElems(elem => {
            empty(elem);
            elem.append(...htmlParse(html));
        });
        return this;
    }

    text(text: string): BaseElem {
        this.#elemOrElems(elem => {
            empty(elem);
            elem.append(new Text(text));
        });
        return this;
    }

    on(
        evtName: `${Event['type']}.${string}` | string, 
        fn: EventFn, 
        delegateEl: string = null,
        config: boolean | AddEventListenerOptions = false
    ): BaseElem {
        this.#elemOrElems(elem => on(elem, evtName, fn, delegateEl, config));
        return this;
    }

    trigger(evtName: string, delgateEl?: string): BaseElem {
        this.#elemOrElems(elem => trigger(elem, evtName, delgateEl));
        return this;
    }

    off(evtName: string, config: boolean | AddEventListenerOptions = false): BaseElem {
        this.#elemOrElems(elem => off(elem, evtName, config));
        return this;
    }
}

export default BaseElem;