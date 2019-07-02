cc.Class({
    extends: cc.Component,

    properties: {
        wifi:cc.Sprite,
        battery:cc.ProgressBar,
        gameRoundNum:cc.Label,
        time:cc.Label,
        roomNum:cc.Label
    },

    onLoad () {
        var self = this
        var info = G.selfUserData.getUserRoomInfo()
        var roomId = G.selfUserData.getUserRoomID()
        self.setGameRoundNum(info.num_of_turns,info.conf.maxGames)
        self.setRoomNum(roomId)
        self.scheduleCallBack()
        self.schedule(self.scheduleCallBack.bind(self), 5)
    },

    scheduleCallBack(){
        var self = this
        self.updateTime()
        self.updateWifi()
        self.updateBattery()
    },

    updateTime(){
        var self = this
        var label = self.time.getComponent(cc.Label)
        if(label){
            label.string = G.tools.getCurrentTime()
        }
    },

    updateWifi(){
        var self = this
        var wifi = self.wifi.getComponent(cc.Sprite)
        if(wifi){
            var value = G.javaManage.getWifi()
            cc.loader.loadRes("image/ddzGameRes", cc.SpriteAtlas, function (err, atlas) {
                var frame = atlas.getSpriteFrame('wifi'+value);
                wifi.spriteFrame = frame;
            });
        }
    },

    updateBattery(){
        var self = this
        var battery = self.battery.getComponent(cc.ProgressBar)
        if(battery){
            var value = G.javaManage.getBattery()
            battery.progress = value
        }
    },

    setGameRoundNum(round,total){
        round = round || 0
        var self = this
        var gameRoundNum = self.gameRoundNum.getComponent(cc.Label)
        if(gameRoundNum){
            if(!total){
                total = gameRoundNum.customData?(gameRoundNum.customData.total?gameRoundNum.customData.total:round):round
            }
            gameRoundNum.string = '局数:  ' + round + ' / ' + total
            gameRoundNum.customData = {
                round:round,
                total:total
            }
        }
    },

    getGameRoundNum(){
        var self = this
        var gameRoundNum = self.gameRoundNum.getComponent(cc.Label)
        var round = total = 1
        if(gameRoundNum){
            total = gameRoundNum.customData?(gameRoundNum.customData.total?gameRoundNum.customData.total:round):round
            round = gameRoundNum.customData?(gameRoundNum.customData.round?gameRoundNum.customData.round:round):round
        }
        return {round:round,total:total}
    },

    setRoomNum(num){
        var self = this
        var roomNum = self.roomNum.getComponent(cc.Label)
        if(roomNum){
            if(!num){
                num = roomNum.customData?(roomNum.customData.roomNum?roomNum.customData.roomNum:30058):30058
            }
            roomNum.string = '房号：' + num
            roomNum.customData = {
                roomNum:num
            }
        }
    },

    getRoomNum(){
        var self = this
        var roomNum = self.roomNum.getComponent(cc.Label)
        var num = 30058
        if(roomNum){
            num = roomNum.customData?(roomNum.customData.roomNum?roomNum.customData.roomNum:num):num
        }
        return num
    },
    
    onDestroy(){
        var self = this
        self.unscheduleAllCallbacks()
    }
})