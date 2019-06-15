var constants = require('./config/Constants')
cc.Class({
    extends: cc.Component,

    properties: {
        soundSlider:{
            type:cc.Slider,
            default:null
        },
        effectSlider:{
            type:cc.Slider,
            default:null
        },
        onSprite:{
            type:cc.Sprite,
            default:null
        },
        offSprite:{
            type:cc.Sprite,
            default:null
        },
        loginInGameNode:{
            type:cc.Node,
            default:null
        },
        loginOutGameNode:{
            type:cc.Node,
            default:null
        },
        outGameNode:{
            type:cc.Node,
            default:null
        },
    },

    onLoad(){
        this.loginInGameNode.active = false
        this.loginOutGameNode.active = false
        this.outGameNode.active = false
        if(!G.gameInfo.isLogined){
            this.outGameNode.active = true
        }else{
            if(G.gameInfo.isInGame){
                this.loginInGameNode.active = true
            }else{
                this.loginOutGameNode.active = false
            }
        }
        
        this.soundVolume = 1
        this.effectVolume = 1
        this.toggle = 1
        var audio = G.ioUtil.get(constants.LOCALLSTORAGEKEY.AUDIO)
        if(audio){
            this.soundVolume = audio.soundVolume
            this.effectVolume = audio.effectVolume
            this.toggle = audio.toggle
        }
        this.onSprite.node.active = this.toggle==1?true:false
        this.offSprite.node.active = !this.onSprite.node.active
        this.setVolumeByToggle()
    },

    setVolumeByToggle(){
        this.soundSlider.progress = this.soundVolume
        this.effectSlider.progress = this.effectVolume

        if(this.toggle == 0){
            this.soundSlider.progress = 0
            this.effectSlider.progress = 0
        }
        this.slider(this.soundSlider,'sound',true)
        this.slider(this.effectSlider,'effect',true)
    },

    oneKey(event, customEventData){
        var node = event.target;
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        var active = this.onSprite.node.active
        this.onSprite.node.active = !active
        this.offSprite.node.active = active
        this.toggle = active==true?0:1
        this.setVolumeByToggle()
    },

    slider(obj, customEventData, isToggle){
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("slider=", obj.name," data=", customEventData);
        var progress = obj.progress
        var effect = obj.node.getChildByName('effectSprite')
        if(effect){
            effect.scaleX = progress
        }
        if(isToggle){return}
        if(customEventData == 'sound'){
            this.soundVolume = progress
        }else if(customEventData == 'effect'){
            this.effectVolume = progress
        }
        var active = false
        this.onSprite.node.active = !active
        this.offSprite.node.active = active
        this.toggle = active==true?0:1
    },

    exitGame(event, customEventData){
        var node = event.target;
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        cc.game.end();//退出游戏
    },

    close(event, customEventData){
        var node = event.target;
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        this.node.active = false
        this.save()
        if(this.node.pointScene){
            this.node.pointScene.node.active = true
        }
    },

    save(){
        var audio = {
            soundVolume:this.soundVolume,
            effectVolume:this.effectVolume,
            toggle:this.toggle
        }
        G.ioUtil.set(constants.LOCALLSTORAGEKEY.AUDIO,audio)
    },

    onDestroy(){
        this.save()
    },

    gameTable(event,customEventData){
        var node = event.target;
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        if(customEventData == 0){
            console.log('绿色桌面')
        }else{
            console.log('蓝色桌面')
        }
    },

    gameCard(event,customEventData){
        var node = event.target;
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        if(customEventData == 0){
            console.log('绿色牌面')
        }else{
            console.log('蓝色牌面')
        }
    },

    switchAccount(event,customEventData){
        var node = event.target;
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        
    }
});
