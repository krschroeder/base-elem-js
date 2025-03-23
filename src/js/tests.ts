import $be from './base-elem-js';
// import { merge } from './extra';


declare global {
    
    interface Window {
       $be: typeof $be;
       merge: typeof merge;
    }
}
const {merge} = $be.static;
window.merge = merge;


console.log('Extend 1', merge({yeah:'buddy',foo:'bar'}, {foo:'baz'}));
console.log('Extend 2',
    merge([true,'noFalsy'], {
        foo: '',
        yeah:'buddy',
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
        foo: "",
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

const bes = $be.static;
const $h1 = $be('h1');
const $pinput = $be('#pinput');

$h1.css({color: 'green'});

 

const $behidden = $be('.hidden').css({display: 'flex', height: '40px'}).attr({hidden: null});
const $ul = $be('ul');

console.log(
    bes.isHidden($behidden.elem[0] as HTMLElement),
    `css display: ${$behidden.css('display')}`, 
    `data attr: ${$behidden.attr('data-something')}`
);

// $behidden.css({display: null})

console.log('has "what" class', $ul.find('li').hasClass('what'));

const div = bes.make('div', {id: 'test', className: 'test'}, '<h2>Hello Make!</h2><p>Some copy goes here</p>');
const btn = bes.make('button#some-id-yo.yeah_-123bar&.foo.bar baz','Some <strong> Copy</strong>');
const btn2 = bes.make('button.whatt','Some <strong> Copy</strong>');
const $div = $be(div).insert([btn,btn2]);

const makep = bes.findOne('#makep');
const makepBtn = bes.find('button', makep); 

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
console.log('Are there <li> elements',$li.hasElems());

console.log($ul.elemRects(0))
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

console.log('div offset:',$div.elem[0]);