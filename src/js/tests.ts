import type { Selector, BaseElem } from './base-elem';

declare global {
    
    interface Window {
       $be: (selector?: Selector, base?: HTMLElement) => BaseElem;
    }
}


window.$be('h1').css({color: 'green'})