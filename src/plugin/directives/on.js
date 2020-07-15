export const directiveOn = {
    template2Vnode: function (el, dir) {
        //获取属性值 
        let exp = dir.expression;
        console.log(dir)
        if (dir.arg) {
            el.events[dir.arg] = exp;
        }
    }
}