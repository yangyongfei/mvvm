module.exports = function (html){
    var obj = {
        template:'',
        script:'',
        style:''
    }
 
    while (html) {
        htmt =  html.trim()
        if (html.indexOf('<template>') > -1) {
            //匹配template
            index = html.indexOf('</template>');
            if (index>-1) {
                obj.template =  html.substring(0,index).replace('<template>','')
                html = html.substring(index+11);
            }
        } 
        
        
        if (html.indexOf('<script>') > -1) {
            //匹配script
            var start = html.indexOf('<script>')
            index = html.indexOf('</script>');

            console.log(start,index)
            if (index>-1) {
                obj.script =  html.substring(start+9,index)
                html = html.substring(index+9);
            }
            
          
        }  

        if(html.indexOf('<style>') > -1) {
            //匹配style
            var start = html.indexOf('<style>')
            index = html.indexOf('</style>');
            if (index>-1) {
                obj.style =  html.substring(start,index).replace('<style>','')
                html = html.substring(index+8);
            }

            var _asc = obj.script.split(',')
            console.log(_asc)
            _asc.splice(-1,0,'template:'+JSON.stringify( obj.template)) 
            _asc.splice(-1,0,'style:'+ JSON.stringify(obj.style)) 
            obj.script = _asc.join(',\n')
            console.log( obj.script)
        }
  

        if(html.indexOf('<template>')<0 && html.indexOf('<style>') < 0 && html.indexOf('<script>') < 0){
            html = ''
            break
        }
        
    }

    return obj.script
}