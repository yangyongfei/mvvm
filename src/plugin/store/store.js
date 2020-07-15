
// 目标2：封装一个插件，使用更容易使用
let MVVM;

class Store {
  constructor(options) {
    // 定义响应式的state
    // this.$store.state.xx
    // 借鸡生蛋
    this._vm = new MVVM({
      data: {
        $store: options.state
      }
    })
    this._mutations = options.mutations
    this._actions = options.actions

    // 绑定this指向
    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)
  }

  // 只读
  get state () {
    console.log(this._vm.$store)
    return this._vm.$store
  }

  set state (val) {
    console.error('state不能直接赋值');
  }

  // 实现commit方法，可以修改state
  commit (type, payload) {
    // 拿出mutations中的处理函数执行它
    const entry = this._mutations[type]
    if (!entry) {
      console.error('未知mutaion类型');
      return
    }
    entry(this.state, payload)
  }

  dispatch (type, payload) {
    const entry = this._actions[type]

    if (!entry) {
      console.error('未知action类型');
      return
    }

    // 上下文可以传递当前store实例进去即可
    entry(this, payload)
  }
}

function install (_MVVM) {
  MVVM = _MVVM
}

// { Store, install }相当于MVVMx
// 它必须实现install方法
export default { Store, install }