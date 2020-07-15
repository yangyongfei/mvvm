var snabbdom = require('snabbdom');
var patch = snabbdom.init([ // Init patch function with chosen modules
    require('snabbdom/modules/class').default, // makes it easy to toggle classes
    require('snabbdom/modules/props').default, // for setting properties on DOM elements
    require('snabbdom/modules/style').default, // handles styling on elements with support for animations
    require('snabbdom/modules/eventlisteners').default, // attaches event listeners
]);

var h = require('snabbdom/h').default; // helper function for creating vnodes

var container = document.getElementById('container');

var vnode = h('div#container.two.classes', { on: { click: someFn } }, [
    h('span', { style: { fontWeight: 'bold' } }, '首次加载'),
    ' 更新',
    h('a', { props: { href: '/foo' } }, '链接')
]);

// 首次加载
patch(container, vnode);

var newVnode = h('div#container.two.classes', { on: { click: anotherEventHandler } }, [
    h('span', { style: { fontWeight: 'normal', fontStyle: 'italic' } }, '更新完成的dom'),
    ' l '
]);


//更新
function someFn () {
    patch(vnode, newVnode);
}

//清空
function anotherEventHandler () {
    patch(vnode, { text: '' });
}