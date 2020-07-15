// 我们的插件：
// 1.实现一个Router类并挂载期实例
// 2.实现两个全局组件router-link和router-view

let Vue;

class VueRouter {
    // 核心任务：
    // 1.监听url变化
    constructor(options) {
        this.$options = options;
        // 缓存path和route映射关系
        // 这样找组件更快
        this.routeMap = {}
        this.$options.routes.forEach(route => {
            this.routeMap[route.path] = route
        })

        // 数据响应式
        // 定义一个响应式的current，则如果他变了，那么使用它的组件会rerender
        // Vue.util.defineReactive(this, 'current', '')

        // 请确保onHashChange中this指向当前实例
        window.addEventListener('hashchange', this.onHashChange.bind(this))
        window.addEventListener('load', this.onHashChange.bind(this))
    }

    onHashChange () {
        console.log(window.location.hash);
        this.current = window.location.hash.slice(1) || '/'
        console.log(this.routeMap[this.current])
        var dom = document.getElementById('router')
        dom.innerHTML = '<router-view></router-view>'
        var router = new Vue(this.routeMap[this.current].component)
        router && router.$mount('router-view')
    }
}

// 插件需要实现install方法
// 接收一个参数，Vue构造函数，主要用于数据响应式
VueRouter.install = function (MVVM) {
    // 保存Vue构造函数在VueRouter中使用
    Vue = MVVM
}

export default VueRouter