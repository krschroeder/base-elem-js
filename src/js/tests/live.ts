import $be from '../base-elem-js';
// import { merge } from './extra';


declare global {
    
    interface Window {
       $be: typeof $be;
       merge: typeof $be.merge;
    }
}
 
window.merge = $be.merge;
window.$be = $be;


console.log('Extend 1', $be.merge({yeah:'buddy',foo:'bar', baz: {buzzy:'yeahhh'}}, {foo:'baz', baz: {buddy:'RC', foob: 'magoob'}}));
console.log('Extend 2',
    $be.merge([true, 'noNull'], {
        foo: '',
        yeah:'buddy',
        arr: 'z',
        baz: {
            buddy:'boo',
            lvl3: {
                foo: 'og foo',
                bar: 'BARRR'
            }
        }
    }, 
    {
        // foo:'yo bro he ride the 20" Momo!', 
        foo: null,
        arr: [1,2,3,4,5],
        baz: {
            what:'light weight babayy',
            buddy: '',
            lvl3: {
                foo: 'barrio',
                bazzaro: 'bazzaro'
            }
        }
    },
    {yeah: '3rd object merge'})
);

 
const $h1 = $be('h1');
const $pinput = $be('#pinput');

$h1.css({color: '#888'});


const $behidden = $be('.hidden').css({display: 'flex', height: '40px'}).attr({hidden: null});
const $ul = $be('ul');

console.log(
    $be.isHidden($behidden.elem[0] as HTMLElement),
    `css display: ${$behidden.css('display')}`, 
    `data attr: ${$behidden.attr('data-something')}`
);

// $behidden.css({display: null})

console.log('has "what" class', $ul.find('li').hasClass('what'));

const div = $be.make('div', {id: 'test', className: 'test'}, '<h2>Hello Make!</h2><p>Some copy goes here</p>');
const btn = $be.make('button#some-id-yo.yeah_-123bar&.foo.bar baz','Some <strong> Copy</strong>');
const btn2 = $be.make('button.whatt','Some <strong> Copy</strong>');
const $div = $be(div).insert([btn,btn2]);

const makep = $be.findOne('#makep');
const makepBtn = $be.find('button', makep); 

// console.log('make p btn', makepBtn)
$be(makep).on('click.makep', (ev: MouseEvent, elem: HTMLHeadingElement) => {
    console.log(ev.type, elem.textContent, $pinput.attr('value'));
    $div.insert(`<p>Event: ${ev.type} <br /> ${$pinput.attr('value')}</p>`);
}, 'button');

 
// synthetic event

$div.on('[syntheticEvent]', (ev: Event, elem: HTMLDivElement) => {
    console.log(ev);
    $div.insert(`<p>Some HTML inserted by a synthetic event (${elem.nodeName})</p>`);
  
}).trigger('[syntheticEvent]')
 
const $li = $ul.find('li');

console.log('Are there <li> elements',$li.hasEls, $li.size);

console.log($ul.elemRects(0));
console.log('Li Siblings:', $li.get(1).siblings('li'));
console.log('Li Siblings (no selector):', $li.get(1).siblings());
console.log('Li et all siblings', $li.get(1).siblings('li', true))
// console.log('Are there <code> elements', $be('code').hasElems())
const $liOne = $ul.find('li:first-child');
console.log('first li',$liOne.find(el => el.nextElementSibling as HTMLLIElement));
console.log('near: parent', $li.find((el) => el.closest('ul')));
// console.log('near: parent', $li.near('parent'));
console.log('near: next', $li.find((el) => el.nextElementSibling as HTMLElement));

const foo = $li.map(el => el.closest('ul'));

$be(foo).addClass('red')
console.log('li text', $li.map(el => el.textContent));

console.log('ul HTML',$ul.text());
$ul.find('strong').text('Setting some bold text!');

$ul.on('[syntheticEventName]', (ev, elem) => {
    console.log('synthetic event!', ev.type, elem)
}).trigger('[syntheticEventName]');

const $liWhat = $li.filter((elem, i) => $be.hasClass(elem, 'what'));

console.log('li with class "what"', $liWhat);

setTimeout(() => {
    $div.trigger('click.div', 'h2');
    console.log('set time out on click')
}, 1000)


$be(document.body).insert(div);
console.log('$uls', $be('ul'))
const $ulSpan = $be('ul').findOne('span');

$be(window).on('load.loaded', (ev, elem) => {
    console.log('loaded', ev)
});

$be(document).on('DOMContentLoaded', (ev, elem) => {
    console.log('content loaded', ev)
})

console.log('$ulSpan',$ulSpan);
console.log($be.BaseElem, $be)

$be(div).insert('<p>Some more copy</p>', 'before');
$be(div).insert('<p>Copy Prepended</p>', 'prepend');

console.log('div offset:',$div.elem[0]);

const $untilElem = $be('.until-elem');
const $liAncestors = $be('.start-elem').parents('li', $untilElem).css({background: '#ccc'});
$liAncestors.get(0).css({background: '#060'});
console.log('Until Elem', $liAncestors); 