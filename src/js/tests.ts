import $be from './base-elem-js';

declare global {
    
    interface Window {
       $be: typeof $be;
    }
}

const bes = $be.static;

$be('h1').css({color: 'green'});

const $behidden = $be('.hidden').css({display: 'block'}).attr({hidden: null});

console.log(bes.isHidden($behidden.elem[0]));

console.log('has "what" class',$be('ul').find('li').hasClass('what'));

const div = bes.make('div', {id: 'test', className: 'test'}, '<h2>Hello Make!</h2><p>Some copy goes here</p>');
$be(div).on('click', (ev, elem) => {
    console.log('clicked', elem.textContent);
},'h2');
$be(document.body).insert(div);

$be(div).insert('<p>Some more copy</p>', 'before');
$be(div).insert('<p>Copy Prepended</p>', 'prepend');