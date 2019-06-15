var javaManage = {
    WxLogin:function(){
        if (!cc.sys.isNative) {
            return;
        }
        jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'WxLogin', "()V")
    },

    getDeviceId:function(){
        if (!cc.sys.isNative) {
            return;
        }
        var id = jsb.reflection.callStaticMethod('org/cocos2dx/javascript/util/DeviceInfo', 'getDeviceId', "()V")
        return id;
    },

    getWifi:function(){
        if (!cc.sys.isNative) {
            return 1;
        }
        var wifi = jsb.reflection.callStaticMethod('org/cocos2dx/javascript/util/AppActivity', 'getWifi', "()V")
        return wifi || 1;
    },

    getBattery:function(){
        if (!cc.sys.isNative) {
            return 0.5;
        }
        var battery = jsb.reflection.callStaticMethod('org/cocos2dx/javascript/util/AppActivity', 'getBattery', "()V")
        return battery || 0.5;
    },
}

// public static final String APP_ID = "wxafc956f84f22788f";
// //设置估计有问题
// public static final String APP_SERECET = "10677f489ec36a99b7f4f1e0bf301c5e";

module.exports = javaManage