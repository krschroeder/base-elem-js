import $be from './base-elem-js';

declare global {
    
    interface Window {
       $be: typeof $be;
    }
}

const bes = $be.static;
const $h1 = $be('h1');

$h1.css({color: 'green'});

 

const $behidden = $be('.hidden').css({display: 'block'}).attr({hidden: null});

console.log(bes.isHidden($behidden.elem[0]),$behidden.css('display'));

console.log('has "what" class',$be('ul').find('li').hasClass('what'));

const div = bes.make('div', {id: 'test', className: 'test'}, '<h2>Hello Make!</h2><p>Some copy goes here</p>');
$be(div).on('click.div', (ev, elem: HTMLElement) => {
    console.log('clicked', elem.textContent);
    $be(div).off('click.div');
},'h2');

$be(div).on('click.again', (ev, elem: HTMLElement) => {
    console.log('clicked again', elem.textContent);
    $be(div).off('click.again');
});


$be(document.body).insert(div);
const $ulSpan = $be('ul').findOne('span');

console.log($ulSpan);
console.log($be.BaseElem, $be)

$be(div).insert('<p>Some more copy</p>', 'before');
$be(div).insert('<p>Copy Prepended</p>', 'prepend');