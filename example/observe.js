
//  监听 和 改变数据
function defineReactive (obj, key, val) {
    // 递归
    observe(val)
    //创建dep key 11对应
    const dep = new Dep()
    Object.defineProperty(obj, key, {
        get () {
            console.log('get', key)
            // 依赖收集
            Dep.target && dep.addDep(Dep.target)
            return val
        },
        set (newVal) {
            if (newVal !== val) {
                console.log('set', key, newVal)
                //防止newval == objet
                observe(newVal)
                val = newVal
                dep.notify()
            }
        }
    })
}

//对于新加入的属性 删除 单独处理
function set (obj, key, val) {
    defineReactive(obj, key, val)
}

function observe (obj) {
    if (typeof obj !== 'object' || obj == null) {
        return
    }
    new Observe(obj)
}

class Observe {
    constructor(value) {
        this.value = value
        //数组
        if (Array.isArray(value)) {

        } else {
            //对象
            this.walk(value)
        }
    }
    walk (obj) {
        Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key]))
    }
}

//代理
function proxy (vm) {
    Object.keys(vm.$data).forEach(key => {
        //未当前实力
        Object.defineProperty(vm, key, {
            get () {
                return vm.$data[key]
            },
            set (newVal) {
                console.log(newVal)
                if (newVal !== vm.$data[key]) {
                    vm.$data[key] = newVal
                }
            }
        })
    })
}


//
class Kvue {
    constructor(options) {
        this.$options = options
        this.$data = options.data
        proxy(this)
        observe(this.$data)
        new Compile(options.el, this)
    }
}


//解析把模版 并watcher
class Compile {
    constructor(el, vm) {
        this.$vm = vm
        this.$el = document.querySelector(el)
        this.compile(this.$el)
    }

    compile (el) {
        //遍历
        el.childNodes.forEach(node => {

            //元素
            if (node.nodeType === 1) {
                this.compileElement(node)
            } else if (this.isInter(node)) {
                //文本接点
                this.compileText(node)
            }

            //递归子节点
            if (node.childNodes) {
                this.compile(node)
            }
        })
    }

    // 绑定表达式解析
    isInter (node) {
        return node.nodeType == 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }

    compileText (node) {
        console.log(node)
        console.log(RegExp.$1)
        this.update(node, RegExp.$1, 'text')
    }

    compileElement (node) {
        const attrs = node.attributes
        Array.from(attrs).forEach(attr => {
            const { name, value } = attr

            //判断是否指令
            if (name.indexOf('f-') == 0) {
                //    截取指令
                const dir = name.substring(2)
                //执行
                console.log(dir)
                this[dir] && this[dir](node, value)
            }

            // 判读是否是事件
            if (name.indexOf('@') == 0) {

            }
        })
    }

    //文本更新
    text (node, exp) {
        this.update(node, exp, 'text')
    }

    html (node, exp) {
        this.update(node, exp, 'html')
    }

    update (node, exp, dir) {
        //获取更新方法 创建
        const fn = this[dir + 'Updater']
        fn && fn(node, this.$vm[exp])
        new Watcher(this.$vm, exp, val => {
            fn && fn(node, val)
        })
    }

    textUpdater (node, value) {
        console.log(value)
        node.textContent = value
    }

    htmlUpdater (node, value) {
        console.log(value)
        node.innerHTML = value
    }
}


// watcher
class Watcher {
    constructor(vm, key, fn) {
        this.vm = vm
        this.key = key
        this.fn = fn
        //建立关系 dep watcher÷
        Dep.target = this
        this.vm[this.key]
        Dep.target = null
    }

    update () {
        //更新函数实例
        this.fn.call(this.vm, this.vm[this.key])
    }

}


class Dep {
    constructor() {
        this.deps = []
    }

    addDep (dep) {
        //订阅
        this.deps.push(dep)
    }

    notify () {
        this.deps.forEach(w => w.update())
    }

}


var vue = new Kvue({
    el: '#app',
    data: {
        counter: 1,
        ele: '<span>我是一个文本节点</span>'
    }
})

setInterval(() => {
    vue.counter++
}, 1000)