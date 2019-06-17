var Constants = require('./../config/Constants')
cc.Class({
    extends: cc.Component,

    properties: {
        anim: cc.Animation,
    },

    onLoad(){
        var self = this
        self.m_currentAnimationState = null 
    },

    playAnim (name,start) {
        var self = this
        self.m_currentAnimationState = self.anim.play(name,start);
    },

    setAnimationCurveData(name,args){
        var self = this
        if(!self.m_currentAnimationState)return;
        var curveData = self.m_currentAnimationState.clip.curveData
        var props = curveData.props
        if(!props[name])return;
        props[name] = [].concat(args)
    },

    pauseAnim(name){
        var self = this
        self.anim.pause(name);
    },

    resumeAnim(name){
        var self = this
        self.anim.resume(name);
    },

    stopAnim(name) {
        var self = this
    	self.anim.stop(name);
    },

    setCurrentAnimTime(time,name) {
        var self = this
    	self.anim.setCurrentTime(time,name);
    },

    playAdditive(name,start){
        var self = this
        self.m_currentAnimationState  = self.anim.playAdditive(name,start);
    },

    setAnimationState(name){
        var self = this
        name = name || this.anim.defaultClip.name
        self.m_currentAnimationState = self.anim.getAnimationState(name);
    },

    getAnimationState(){
        var self = this
        return self.m_currentAnimationState
    },
});
