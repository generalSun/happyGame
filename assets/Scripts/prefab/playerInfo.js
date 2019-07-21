var Constants = require('./../config/Constants')
cc.Class({
    extends: cc.Component,

    properties: {
        m_nickName:cc.Label,
        m_gold:cc.Label,
        m_head:cc.Sprite,
        m_diamond:cc.Label,
        m_userId:cc.Label,
        m_roomCard:cc.Label
    },

    onLoad () {
        var self = this
        self.node.on('touchend',self.hide,self)
    },

    show(info){
        if(!info)return
        var self = this
        self.node.active = true
        self.m_nickName.string = G.tools.interceptName(info.name || "")
        self.m_gold.string = info.gold || ""
        self.m_diamond.string = info.diamond || ''
        self.m_userId.string = info.userId || ''
        self.m_roomCard.string = info.roomCard || ''
        // G.httpManage.sendRequest(Constants.HTTP_NET_EVENT.BASE_INFO,{userId:userId},function(event){
        //     if(event.errcode == 0){
        //         G.selfUserData.setUserName(event.name)
        //         G.selfUserData.setUserSex(event.sex)
        //         console.log(event)
        //         if(event.headimgurl){
        //             var url = G.httpManage.accountServerUrl + '/image?url=' + encodeURIComponent(event.headimgurl) + ".jpg";
        //             cc.loader.load(url,function (err,tex) {
        //                 if(err){
        //                     console.log(err)
        //                     return
        //                 }
        //                 var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
        //                 self.m_head.node.getComponent(cc.Sprite).spriteFrame = spriteFrame
        //             });
        //         }
        //     }
        // },null,G.httpManage.accountServerUrl);
    },

    hide(){
        var self = this
        self.node.active = false
    },

    closeButtonCallBack(event,customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        self.hide()
    },

    onDestroy(){
        var self = this
        
    }
})