var constants = require('./../../config/Constants')
cc.Class({
    extends: cc.Component,

    properties: {
        head:cc.Sprite,
        nickName:cc.Label,
        gold:cc.Label,
        creatRoomNode:cc.Node,
    },

    onLoad () {
        var self = this
        self.creatRoomNode.active = false
        // self.nickName.string = G.selfUserData.getUserName()
        // self.gold.string = G.selfUserData.getUserCoins()
        // var userid = G.selfUserData.getUserId()
        // if(userid){
        //     G.httpManage.sendRequest(constants.NET_EVENT.BASE_INFO,{userid:userid},function(event){
        //         if(event.errcode == 0){
        //             G.selfUserData.setUserName(event.name)
        //             G.selfUserData.setUserSex(event.sex)
        //             console.log(event)
        //             if(event.headimgurl){
        //                 var url = G.httpManage.accountServerUrl + '/image?url=' + encodeURIComponent(event.headimgurl) + ".jpg";
        //                 cc.loader.load(url,function (err,tex) {
        //                     if(err){
        //                         console.log(err)
        //                         return
        //                     }
        //                     var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
        //                     self.head.node.getComponent(cc.Sprite).spriteFrame = spriteFrame
        //                 });
        //             }
        //         }
        //     },null,G.httpManage.accountServerUrl);
        // }
    },

    onCreateRoomClickCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        self.creatRoomNode.active = true
    },

    onJoinRoomClickCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
    },
});
