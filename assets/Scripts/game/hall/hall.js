var constants = require('./../../config/Constants')
cc.Class({
    extends: cc.Component,

    properties: {
        head:cc.Sprite,
        nickName:cc.Label,
        gold:cc.Label,
        creatRoomNode:cc.Node,
        enterRoomNode:cc.Node,
    },

    onLoad () {
        var self = this
        self.m_checkHasGame = false
        G.globalSocket.removeAllMsgHandler()
        G.globalSocket.addMsgHandler(self)

        self.creatRoomNode.active = false
        self.enterRoomNode.active = false
        self.nickName.string = G.selfUserData.getUserName()
        self.gold.string = G.selfUserData.getUserCoins()
        var userId = G.selfUserData.getUserId()
        if(userId){
            G.httpManage.sendRequest(constants.HTTP_NET_EVENT.BASE_INFO,{userId:userId},function(event){
                if(event.errcode == 0){
                    G.selfUserData.setUserName(event.name)
                    G.selfUserData.setUserSex(event.sex)
                    console.log(event)
                    if(event.headimgurl){
                        var url = G.httpManage.accountServerUrl + '/image?url=' + encodeURIComponent(event.headimgurl) + ".jpg";
                        cc.loader.load(url,function (err,tex) {
                            if(err){
                                console.log(err)
                                return
                            }
                            var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
                            self.head.node.getComponent(cc.Sprite).spriteFrame = spriteFrame
                        });
                    }
                }
            },null,G.httpManage.accountServerUrl);
        }
    },

    onCreateRoomClickCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        self.creatRoomNode.active = true
        self.creatRoomNode.getComponent('createRoom').init(G.gameListInfo)
    },

    onJoinRoomClickCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        self.enterRoomNode.active = true
        self.enterRoomNode.getComponent('enterRoom').init(self.enterRoom.bind(self))
    },

    enterRoom:function(roomId,callBack){
        var self = this;
        var data = {
            account: G.selfUserData.getUserAccount(),
            sign: G.selfUserData.getUserSign(),
            roomId: roomId
        }
        G.httpManage.sendRequest(constants.HTTP_NET_EVENT.ENTER_PRIVATE_ROOM,data,function(event){
            console.log('ENTER_PRIVATE_ROOM :')
            console.log(event)
            if (event.errcode !== 0) {
                if(event.errcode == -1){
                    G.globalLoading.setLoadingVisible(true,'正在进入房间...')
                    setTimeout(function(){
                        self.enterRoom(roomId,callBack);
                    },5000);
                }else{
                    var content = "房间["+ roomId +"]不存在，请重新输入!";
                    if(event.errcode == 4){
                        content = "房间["+ roomId + "]已满!";
                    }
                    G.msgBoxMgr.showMsgBox({content:content})
                    if(callBack){
                        callBack(event)
                    }
                }
            }else {
                G.globalSocket.setIp(event.ip)
                G.globalSocket.setPort(event.port)
                G.globalSocket.connectSocket(event)
            }
        },function(msg){
            console.log('ENTER_PRIVATE_ROOM :'+msg.errmsg)
        },null,'正在进入房间...');
    },

    connectSuccess(data){
        console.log('connectSuccess')
        var sd = {
            token:data.token,
            roomId:data.roomId,
            time:data.time,
            sign:data.sign,
        };
        G.globalSocket.send(constants.SOCKET_NET_EVENT.LOGIN,sd)
        G.globalSocket.listenMsg(constants.SOCKET_NET_EVENT.LOGIN_RESULT)
        G.globalSocket.listenMsg(constants.SOCKET_NET_EVENT.LOGIN_FINISHED)
    },

    login_result(data){
        console.log('login_result')
        console.log(data);
        if(data.errcode === 0){
            var data = data.data;
            G.selfUserData.setUserRoomID(data.roomId)
            G.selfUserData.setUserRoomInfo(data)
        }else{
            console.log(data.errmsg);   
        }
    },
            
    login_finished(data){
        console.log('login_finished');
        var self = this
        self.changeScene()
    },

    //更换场景
    changeScene(){
        var info = G.selfUserData.getUserRoomInfo()
        if(!info)return;
        var type = info.conf.type
        var gameScene = type+'GameScene'
        G.gameInfo.isLogined = true
        G.gameInfo.isInGame = true
        if(cc.director.getScene().name != gameScene){
            cc.director.loadScene(gameScene)
        }
    },

    update(dt){
        var self = this
        var roomID = G.selfUserData.getUserRoomID()
        if(roomID && !self.m_checkHasGame){
            self.enterRoom(roomID);
            self.m_checkHasGame = true
        }else{
            self.m_checkHasGame = true
        }
    },

    setButtonCallBack(event, customEventData){
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        var setNode = self.node.getChildByName('setNode')
        if(setNode){
            setNode.active = true;
            return;
        }
        console.log('thert is not the node set')
        cc.loader.loadRes('prefabs/setNode', cc.Prefab, function(err, prefab) {
            if (err) {
                cc.log(err.message || err);
                return;
            }
            var node = cc.instantiate(prefab);
            node.active = true;
            self.node.addChild(node);
        });
    }
});
