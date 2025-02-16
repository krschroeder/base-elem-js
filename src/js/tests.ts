import $be from './base-elem-js';

declare global {
    
    interface Window {
       $be: typeof $be;
    }
}

const bes = $be.static;
const $h1 = $be('h1');
const $pinput = $be('#pinput');

$h1.css({color: 'green'});

 

const $behidden = $be('.hidden').css({display: 'block'}).attr({hidden: null});

console.log(bes.isHidden($behidden.elem[0] as HTMLElement),$behidden.css('display'), $behidden.attr('data-something'));
console.log('has "what" class',$be('ul').find('li').hasClass('what'));

const div = bes.make('div', {id: 'test', className: 'test'}, '<h2>Hello Make!</h2><p>Some copy goes here</p>');
const $div = $be(div);

$be('#makep').on('click.makep', (ev: MouseEvent, elem: HTMLHeadingElement) => {
    console.log(ev.type, elem.textContent, $pinput.attr('value'));
    $div.insert(`<p>Event: ${ev.type} <br /> ${$pinput.attr('value')}</p>`);
}, 'button');

 
// synthetic event

$div.on('[syntheticEvent]', (ev: Event, elem: HTMLDivElement) => {
    console.log(ev);
    $div.insert(`<p>Some HTML inserted by a synthetic event (${elem.nodeName})</p>`);
  
}).trigger('[syntheticEvent]')
 
const $li = $be('ul').find('li');

const $liWhat = $li.filter((elem, i) => bes.hasClass(elem, 'what'));

console.log('li with class "what"', $liWhat);

setTimeout(() => {
    $div.trigger('click.div', 'h2');
    console.log('set time out on click')
}, 1000)


$be(document.body).insert(div);
const $ulSpan = $be('ul').findOne('span');

$be(window).on('load.loaded', (ev, elem) => {
    console.log('loaded', ev)
});

$be(document).on('DOMContentLoaded', (ev, elem) => {
    console.log('content loaded', ev)
})

console.log($ulSpan);
console.log($be.BaseElem, $be)

$be(div).insert('<p>Some more copy</p>', 'before');
$be(div).insert('<p>Copy Prepended</p>', 'prepend');