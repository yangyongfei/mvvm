let startTag = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:@][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
    endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/,
    attr = /([a-zA-Z_:@][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g


let empty = makeMap("area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr")

let block = makeMap("a,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video")

let closeSelf = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr")

let fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected")

let special = makeMap("script,style")

function makeMap(str) {
    var obj = {}, items = str.split(",");
    for (var i = 0; i < items.length; i++)
        obj[items[i]] = true;
    return obj;
}


export default function htmlParse(html) {
    var match

    while (html) {
      
        
            console.log(html)
            console.log(html.indexOf('<'))
            if (html.indexOf('</') == 0) {
                //配置结束标签
                match = html.match(endTag);
                if (match) {
                    html = html.substring(match[0].length);
                    match[0].replace(endTag, parseEndTag);
                }
               
            } else if (html.indexOf('<') == 0) {
                //匹配开始标签
                match = html.match(startTag);
                console.log(match[0])
                if (match) {
                    html = html.substring(match[0].length);
                    match[0].replace(startTag, parseStartTag);
                }
            } else {
                //文本标签
                var index  = html.indexOf('<')
                html = html.substring(index);
            }
       
       
    }
    

    function parseEndTag(){
        console.log(...arguments)
    }


    function parseStartTag(tag,tagName,rest,){
        console.log(...arguments)
        var attrs = [];
        rest.replace(attr, function (match, name) {
            var value = arguments[2] ? arguments[2] :
                arguments[3] ? arguments[3] :
                    arguments[4] ? arguments[4] :
                        fillAttrs[name] ? name : "";

            attrs.push({
                name: name,
                value: value,
                escaped: value.replace(/(^|[^\\])"/g, '$1\\\"') //"
            });
        });

        const element = {
            vm: vm,
            type: 1,
            tag:tagName,
            //属性[{name:key,value:value},...]
            attrsList: attrs,
            //属性{key1:value1,key2:value2}
            attrsMap: makeAttrsMap(attrs),//json格式转换
            parent: currentParent,
            //v-my-directive.foo.bar:arg ="expression"
            //属性//[{name:'my-directive',expression:'expression',modifiers:{foo:true,bar:true},arg:'arg'}]
            children: [],
            events: {},
            isComponent: !isHTMLTag(tag) && !isSVG(tag),
            nativeEvents: {},
            style: null,
            hook: {},
            props: {},//DOM属性
            attrs: {}//值为true,false则移除该属性
        }
        
    }


    function parseText(){
        console.log(...arguments)
    }


}

var dom = document.querySelectorAll('#app')
console.log(dom[0].innerHTML.trim())
htmlParse(dom[0].innerHTML.trim())