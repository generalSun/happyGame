
var Constants = require('./../../config/Constants')
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad(){
        var self = this
        self.m_socketProcess = self.node.getComponent('login_socketProcess')
        G.javaCallBackManage.setHandler(self)
    },

    getGPSLocation: function () {
        var latitude = 0;
        var longitude = 0;
        var locationDesc = '';
        cc.log('---获取用户定位开始： latitude：[' + latitude + '],longitude:[' + longitude + ']');
        if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) {
            latitude = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity",
                "getLatitude", "()F");
            longitude = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity",
                "getLongitude", "()F");
            locationDesc = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity",
                "getGPSDesc", "()Ljava/lang/String;");

        } else if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
            latitude = jsb.reflection.callStaticMethod("AppController",
                "getLatitude");
            longitude = jsb.reflection.callStaticMethod("AppController",
                "getLongitude");
            locationDesc = jsb.reflection.callStaticMethod("AppController",
                "getGPSDesc");
        } else {
            latitude = 12.343455657;
            longitude = 112.098745634;
            locationDesc = '测试-gps地址信息'
        }
        cc.log('---获取用户定位结束： latitude：[' + latitude + '],' +
            'longitude:[' + longitude + ']' +
            'locationDesc:[' + locationDesc + ']');
        return encodeURI('&latitude=' + latitude + '&longitude=' + longitude + '&locationDesc=' + locationDesc);
    },

    //更换场景
    changeScene(){
        G.gameInfo.isLogined = true
        G.gameInfo.isInGame = false
        G.gameInfo.isGamePlay = false
        if(cc.director.getScene().name != 'HallScene'){
            cc.director.loadScene('HallScene')
        }
    },

    //微信登陆成功回调
    wxLoginSuccessCallBack (msg) {
        var data = {
            code:msg.code
        }
        
    },

    //微信登陆失败回调
    wxLoginFailCallBack (msg) {
        
    },

    onDestroy(){
        var self = this
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa   login has destory')
    },
});
