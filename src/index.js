import Watcher from './core/observer/watcher'
import { query, warn, idToTemplate, toString, resolveAsset, hasOwn, isFunction, createElement, remove, bind } from './core/utils'
import { initData, initComputed, initMethods, initWatch } from './core/instance'
import { compileToFunctions } from './core/parser'
import { patch, h, VNode } from './core/vnode'
import { directive } from './plugin/directives'


let uid = 0;
export default class MVVM {
  constructor(options) {
    this.$options = options;
    this.$options.delimiters = this.$options.delimiters || ["{{", "}}"]
    this._uid = uid++;
    this._watchers = [];

    callHook(this, 'beforeCreate')

    if (options.router) {
      this.$router = options.router
    }
    if (options.store) {
      this.$store = options.store
    }

    if (options.data) {
      initData(this, options.data)
    }

    if (options.computed) {
      initComputed(this, options.computed)
    }

    if (options.watch) {
      initWatch(this, options.watch)
    }

    if (options.methods) {
      initMethods(this, options.methods)
    }

    if (options.el) {
      this.$mount(options.el);
    }
    callHook(this, 'created');
  }

  // 安装插件
  static use (plugin) {
    plugin && plugin.install && plugin.install.call(this, MVVM);
  }

  //监听新对象
  static $set (target, key, val) {
    if (Array.isArray(target) && Number(key) !== NaN) {
      target.length = Math.max(target.length, key)
      target.splice(key, 1, val)
      return val
    }
    if (hasOwn(target, key)) {
      target[key] = val
      return val
    }
    const ob = target.__ob__
    if (target._isMVVM || (ob && ob.vmCount)) {
      //避免给根节点添加监听
      return val
    }
    if (!ob) {
      target[key] = val
      return val
    }
    defineReactive(ob.value, key, val)
    ob.dep.notify()
    return val
  }
  static $delete (target, key) {
    if (Array.isArray(target) && typeof key === 'number') {
      target.splice(key, 1)
      return
    }
    const ob = target.__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
      return
    }
    if (!hasOwn(target, key)) {
      return
    }
    delete target[key]
    if (!ob) {
      return
    }
    ob.dep.notify()
  }
  $mount (el) {
    let options = this.$options;
    //渲染入口
    this.$el = el = el && query(el);
    //判断是否用户自定义render h函数,则不需要template
    if (!options.render) {
      //获取template
      let template = options.template
      if (template) {
        if (typeof template === 'string') {
          //获取script的template模板
          if (template[0] === '#') {
            template = idToTemplate(template)
          }
          //获取DOM类型tempalte
        } else if (template.nodeType) {
          template = template.innerHTML
        }
        //直接从入口处获取template
      }
      //生成render函数
      if (template) {
        //生成render函数
        console.log(render)
        const render = compileToFunctions(template, this);
        options.render = render;
      }
    }

    callHook(this, 'beforeMount')

    //加入watcher
    var vm = this;
    console.log(vm)
    this._watcher = new Watcher(this, function () { vm._update(vm._render()) })


    if (!this._vnode) {
      this._isMounted = true
      callHook(this, 'mounted')
    }

    return this
  }
  $watch (expOrFn, cb, options) {
    const vm = this
    options = options || {}
    options.user = true
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
      cb.call(vm, watcher.value)
    }
    return function unwatchFn () {
      watcher.teardown()
    }
  }

  $forceUpdate () {
    return this._render()
  }

  $destroy () {
    const vm = this
    callHook(this, 'beforeDestroy');
    if (this.$parent) {
      remove(this.$parent.$children, vm)
    }
    if (vm._watcher) {
      vm._watcher.teardown()
    }
    let i = vm._watchers.length
    while (i--) {
      vm._watchers[i].teardown()
    }
    if (vm.$data.__ob__) {
      vm.$data.__ob__.vmCount--
    }
    vm._patch(this.$el, { text: '' });
    callHook(vm, 'destroyed');
    vm.$off();
  }
  _patch = patch
  _s = toString
  _render () {
    let render = this.$options.render

    let vnode
    try {
      //自动解析的template不需要h,用户自定义的函数需要h
      vnode = render.call(this, this._h);
    } catch (e) {
      warn(`render Error : ${e}`)
    }
    console.log(vnode)
    return vnode
  }
  _update (vnode) {
    if (this._isMounted) {
      callHook(this, 'beforeUpdate')
    }
    this.prevVnode = this._vnode
    this._vnode = vnode;
    console.log(this.prevVnode, this._vnode)
    if (!this.prevVnode) {
      this.$el = this._patch(this.$el, vnode)
    } else {
      this.$el = this._patch(this.prevVnode, vnode)
    }
    if (this._isMounted) {
      callHook(this, 'updated')
    }
  }
  //渲染template和component
  _h (sel, data, children) {
    console.log('_h', sel, data)
    data = data || {}
    //没有attr时,child顶上 
    if (Array.isArray(data)) {
      children = data
      data = {}
    }
    data.hook = data.hook || {}
    if (this.$options.destroy) {
      data.hook.destroy = bind(this.$options.destroy, this)
    }
    if (Array.isArray(children)) {
      let faltChildren = []
      children.forEach((item) => {
        if (Array.isArray(item)) {
          faltChildren = faltChildren.concat(item)
        } else {
          faltChildren.push(item)
        }
      })
      children = faltChildren.length ? faltChildren : children
    }

    if (typeof sel == 'string') {
      let Ctor = resolveAsset(this.$options, 'components', sel)
      if (Ctor) {
        return this._createComponent(Ctor, data, children, sel)
      }
    }
    return h(sel, data, children)
  }
  //创建组件
  //子组件option,属性,子元素,tag
  _createComponent (Ctor, data, children, sel) {
    Ctor.data = mergeOptions(Ctor.data);
    let componentVm;
    let Factory = this.constructor
    let parentData = this.$data
    data.hook.insert = (vnode) => {
      Ctor.data = Ctor.data || {};
      var el = createElement('sel')
      vnode.elm.append(el)
      Ctor.el = el;
      componentVm = new Factory(Ctor);
      vnode.key = componentVm.uid;
      componentVm._isComponent = true
      componentVm.$parent = this;
      (this.$children || (this.$children = [])).push(componentVm);
      //写在调用父组件值
      for (let key in data.attrs) {
        if (Ctor.data[key]) {
          warn(`data:${key},已存在`);
          continue;
        }
        Object.defineProperty(componentVm, key, {
          configurable: true,
          enumerable: true,
          get: function proxyGetter () {
            return parentData[key]
          }
        })
      }
    }
    // sel += '.content'
    Ctor._vnode = new VNode(sel, data, [], undefined, createElement(sel));
    return Ctor._vnode
  }
  //渲染for时,返回多个render
  _l (val, render) {
    let ret, i, l, keys, key
    if (Array.isArray(val) || typeof val === 'string') {
      ret = new Array(val.length)
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = render(val[i], i)
      }
    } else if (typeof val === 'number') {
      ret = new Array(val)
      for (i = 0; i < val; i++) {
        ret[i] = render(i + 1, i)
      }
    } else if (isObject(val)) {
      keys = Object.keys(val)
      ret = new Array(keys.length)
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i]
        ret[i] = render(val[key], key, i)
      }
    }
    return ret
  }

}

MVVM.use(directive);
global.MVVM = MVVM;


//获取data 因为data有可能为
function mergeOptions (options) {
  let opt = Object.assign({}, options)
  let data = opt.data
  if (isFunction(data)) {
    opt.data = data()
  }
  return opt
}

//生命周期钩子函数
function callHook (vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers) {
    if (Array.isArray(handlers)) {
      for (let i = 0, j = handlers.length; i < j; i++) {
        try {
          handlers[i].call(vm)
        } catch (e) {
          handleError(e, vm, `${hook} hook`)
        }
      }
    } else {
      handlers.call(vm)
    }
  }
}


