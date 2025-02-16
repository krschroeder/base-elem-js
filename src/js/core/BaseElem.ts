import type {
    AppendMethod,
    CSSProperties,
    EventName,
    EventFn,
    FindBy,
    SelectorElems,
    Selector,
    SelectorElem
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

    constructor(selector?: Selector | BaseElem, base?: HTMLElement) {
        if(typeof selector === 'string') {

            this.elem = find(selector, base);

        } else if (selector instanceof BaseElem){
            this.elem = isArr(selector.elem) ? [...selector.elem] : selector.elem;
        } else {
            //not checking type for HTMLElement[]
            this.elem = selector;
        }
        return this;
    }

    #elemOrElems(fn: (elem: SelectorElems, i:number) => void): void {
        if (isArr(this.elem)) {
            let i = 0, elem;
            while (elem = this.elem[i]) {
                fn(elem, i++);
            }
          
        } else fn(this.elem, 0);
    }

    find(selector: string, filter?: (elem: any, i: number) => boolean): BaseElem {
        if (isArr(this.elem)) {
            const elems = this.elem.map(elem => find(selector, elem )).flat();
            return new BaseElem(filter ? elems.filter(filter) : elems);

        } else {
            const elems = find(selector, (this.elem as HTMLElement | Document));
            return new BaseElem(filter ? elems.filter(filter) : elems);
        }
        
    }

    findBy(type: FindBy, selector: string, filter?: (elem: any, i: number) => boolean): BaseElem {
        if (isArr(this.elem)) {
            const elems = this.elem.map(elem => findBy(type, selector, elem )).flat();
            return new BaseElem(filter ? elems.filter(filter) : elems);
        } else {
            const elems = findBy(type, selector, (this.elem as HTMLElement | Document));

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
            return new BaseElem(findOne(selector, (this.elem as HTMLElement | Document)));
        }
    }

    filter(fn: (elem: HTMLElement, i: number) => boolean): BaseElem {
        if (isArr(this.elem)) {
            return new BaseElem (this.elem.filter(fn));
        } else {
            return new BaseElem(fn(this.elem as HTMLElement, 0) ? this.elem : []);
        }
    }

    toArray() {
        return isArr(this.elem) ? this.elem : [this.elem];
    }

    each(fn: (elem: HTMLElement, i: number) => void): BaseElem {
        this.#elemOrElems(fn);
        return this;
    }

    css(attrs: string): string;
    css(attrs: Partial<CSSProperties>): BaseElem;
    css(attrs: Partial<CSSProperties> | string): string | BaseElem {
        if (typeof attrs === 'string') {
            const elem = (isArr(this.elem) ? this.elem[0] : this.elem) as HTMLElement;
            return css(elem, attrs);
        } else {
            this.#elemOrElems(elem => css(elem as HTMLElement, attrs));
        }
        return this;
    }

    addClass(cssNames: string | string[]): BaseElem {
        this.#elemOrElems(elem => addClass(elem as HTMLElement, cssNames));

        return this;
    }

    rmClass(cssNames: string | string[]): BaseElem {
        this.#elemOrElems(elem => rmClass(elem as HTMLElement, cssNames));

        return this;
    }

    tgClass(cssNames: string | string[], toggle?: boolean): BaseElem {
        this.#elemOrElems(elem => tgClass(elem as HTMLElement, cssNames, toggle));

        return this;
    }

    hasClass(cssNames: string | string[], method: 'some' | 'every' = 'some'): boolean {
        return !isArr(this.elem) ? 
            hasClass(this.elem as HTMLElement, cssNames) : 
            method === 'some' ? 
            this.elem.some(elem => hasClass(elem, cssNames)): 
            this.elem.every(elem => hasClass(elem, cssNames))
        ;
    }

    attr(attrs: string): string;
    attr(attrs: Record<string,string> ): BaseElem;
    attr(attrs: Record<string,string> | string): BaseElem | string {

        if (typeof attrs === 'string') {
            const elem = isArr(this.elem) ? this.elem[0] : this.elem;
            return attr(elem as HTMLElement, attrs);

        } else {
            this.#elemOrElems(elem => attr(elem as HTMLElement, attrs));
        }

        return this;
    }

    empty(): BaseElem {
        this.#elemOrElems(empty);
        return this;
    }

    remove(): BaseElem {
        this.#elemOrElems(elem => (elem as HTMLElement).remove());
        return this;
    }

    insert(
        html: string | HTMLElement | HTMLElement[], 
        method: AppendMethod = 'append'
    ): BaseElem {
        this.#elemOrElems((elem: HTMLElement) => {
            const elems = (typeof html === 'string' ? htmlParse(html) : isArr(html) ? html : [html]) as HTMLElement[];
           
            if (method === 'append') elem.append(...elems);
            if (method === 'prepend') elem.prepend(...elems);
            if (method === 'after') elem.after(...elems);
            if (method === 'before') elem.before(...elems);
        });
        return this;
    }

    html(html: string): BaseElem {
        this.#elemOrElems((elem: HTMLElement) => {
            empty(elem);
            elem.append(...htmlParse(html));
        });
        return this;
    }

    text(text: string): BaseElem {
        this.#elemOrElems((elem: HTMLElement) => {
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
                this.#elemOrElems((elem: SelectorElem) => on(elem, evName, fn, delegateEl, config));
            }
        } else {
            this.#elemOrElems((elem: SelectorElem) => on(elem, evtName, fn, delegateEl, config));
        }
        return this;
    }

    trigger(evtName: string, delgateEl?: string): BaseElem {
        this.#elemOrElems((elem: SelectorElem) => trigger(elem, evtName, delgateEl));
        return this;
    }

    off(evtName: EventName | EventName[], config: boolean | AddEventListenerOptions = false): BaseElem {

        if (isArr(evtName)) {
            for (const evName of evtName) {
                this.#elemOrElems((elem: SelectorElem) => off(elem, evName, config));
            }
        } else {
            this.#elemOrElems((elem: SelectorElem) => off(elem, evtName, config));
        }
        return this;
    }
}

export default BaseElem;