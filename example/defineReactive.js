
//data  数据监听
function defineReactive (obj, key, val) {

    Object.defineProperty(obj, key, {

        get () {
            console.log('读取值', val)
            return val
        },
        set (newval) {
            console.log('设置值', newval)
            val = newval
        }

    })
}

function Observer (obj) {
    //假定对象
    const keys = Object.keys(obj)
    for (let i = 0, l = keys.length; i < l; i++) {
        defineReactive(obj, keys[i], obj[keys[i]])
    }
}

//对象  
var data = { a: 1 }
Observer(data)
console.log(data.a)
data.a = 2
console.log(data.a)


//数组
// var data = [1, 2]
// Observer(data)
// console.log(data[0])
// data[0] = 7
// data.push(3)




