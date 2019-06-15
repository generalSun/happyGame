var IOUtil = {
    get:function(key){
        var value = cc.sys.localStorage.getItem(key);
        if(typeof value == 'string'){
            value = JSON.parse(value)
        }
        return value
    },
    set:function(key , value){
        cc.sys.localStorage.setItem(key, JSON.stringify(value));
    },
    remove:function(key){
        cc.sys.localStorage.removeItem(key);
    },
    clear:function(){
        cc.sys.localStorage.clear();
    }
}

module.exports = IOUtil
