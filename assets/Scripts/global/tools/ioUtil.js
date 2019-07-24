"use strict";
var IOUtil = {
    get:function(key){
        var value = cc.sys.localStorage.getItem(key);
        if(value != null && typeof value == 'string' && value.length > 0){
            if(value.length > 0){
                value = JSON.parse(value);
            }else{
                value = null
            }
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
