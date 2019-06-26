var constants = require('./../../config/Constants')
cc.Class({
    extends: cc.Component,

    properties: {
        mode:[cc.Toggle],
        difen:[cc.Toggle],
        jushuxuanze:[cc.Toggle],
    },

    init(info){
        var rule = JSON.parse(info.rule)
        rule = rule || {}
        var self = this
        console.log('斗地主游戏规则：')
        console.log(rule)
        for(var key in rule){
            var value = rule[key]
            if(self[key]){
                for(var i = 0; i < self[key].length; i++){
                    self[key][i].node.active = false
                }
                for(var i = 0; i < value.length; i++){
                    var index = value[i]
                    if(self[key][index]){
                        self[key][index].node.active = true
                    }
                }
            }
        }
        console.log('end init')
    },

    getResult(arr){
        for(var i = 0; i < arr.length; i++){
            var toggle = arr[i]
            if(toggle.node.getComponent(cc.Toggle).isChecked){
                return i
            }
        }
    },

    onLoad () {
        var self = this
    },

    createRoomCallBack(event,customEventData){
        var self = this
        var node = event.target;
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        var mode = self.getResult(self.mode)
        var difen = self.getResult(self.difen)
        var jushuxuanze = self.getResult(self.jushuxuanze)
        var rule = 0
        /**
            LAI_ZI      = 0x00000008,   --癞子
         */
        if(mode == 1){
            rule = rule | 0x00000008
        }
        
        var conf = {
            type:'ddz',
            rule:rule,
            difen:difen,
            jushuxuanze:jushuxuanze,
            playerMaxNum:3
        }
        var data = {
            account: G.selfUserData.getUserAccount(),
            sign: G.selfUserData.getUserSign(),
            conf: JSON.stringify(conf)
        }
        G.httpManage.sendRequest(constants.HTTP_NET_EVENT.CREATE_PRIVATE_ROOM, data, function(event){
            console.log('CREATE_PRIVATE_ROOM :'+event)
            if (event.errcode !== 0) {
                if (event.errcode == 2222) {
                    G.msgBoxMgr.showMsgBox({content:'钻石不足，创建房间失败!'})
                }else {
                    G.msgBoxMgr.showMsgBox({content:'创建房间失败,错误码:'+ event.errcode})
                }
            }else {
                G.globalSocket.setIp(event.ip)
                G.globalSocket.setPort(event.port)
                G.globalSocket.connectSocket(event)
            }
        },function(msg){
            console.log('CREATE_PRIVATE_ROOM :'+msg.errmsg)
        },null,'正在创建斗地主房间...');
    }
});
