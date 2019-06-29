var Constants = require('./../../config/Constants')

cc.Class({
    extends: cc.Component,

    properties: {
        bgmVolume:1.0,
        sfxVolume:1.0,
    },

    init: function () {
        var self = this
        cc.game.addPersistRootNode(self.node)
        var bgmVolume = self.bgmVolume
        var sfxVolume = self.sfxVolume
        var audio = G.ioUtil.get(Constants.LOCALLSTORAGEKEY.AUDIO);
        if(audio){
            bgmVolume = parseFloat(audio.soundVolume)
            sfxVolume = parseFloat(audio.effectVolume)
            if(audio.toggle == 0){
                bgmVolume = 0
                sfxVolume = 0
            }
        }
        self.setSFXVolume(sfxVolume)
        self.setBGMVolume(bgmVolume,true)
    },
    
    getUrl:function(url){
        return cc.url.raw("resources/sounds/" + url);
    },
    
    playBGM(url){
        var self = this
        var audioUrl = self.getUrl(url);
        cc.loader.load(audioUrl, function(error,clip){
            if(error){
                throw error
            }
            var bgmVolume = cc.audioEngine.getMusicVolume()
            console.log('播放背景音乐：'+url + '    音量：'+self.bgmVolume+','+bgmVolume)
            cc.audioEngine.playMusic(clip,true);
        });
    },
    
    playSFX(url){
        var self = this
        var audioUrl = self.getUrl(url);
        if(self.sfxVolume > 0){
            cc.loader.load(audioUrl, function(error,clip){
                if(error){
                    throw error
                }
                var audioId = cc.audioEngine.playEffect(clip,false); 
            }); 
        }
    },
    
    setSFXVolume:function(v){
        var self = this
        if(self.sfxVolume != v){
            self.sfxVolume = v;
            cc.audioEngine.setEffectsVolume(v); 
        }
    },
    
    setBGMVolume:function(v,force){
        var self = this
        if(self.bgmVolume != v || force){
            self.bgmVolume = v;
            cc.audioEngine.setMusicVolume(v);
        }
    },
    
    pauseAll:function(){
        cc.audioEngine.pauseAll();
    },
    
    resumeAll:function(){
        cc.audioEngine.resumeAll();
    }
});
