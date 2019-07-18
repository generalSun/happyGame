require('./../../global/tools/stringExtra')
require('./../../global/tools/buttonExtra')
var Constants = require('./../../config/Constants')
var hotUpdate = require('../../utils/hotUpdate')
var UserData = require('./../../model/userData')
var TAG = 'index.js'
cc.Class({
    extends: cc.Component,

    properties: {
        byteLabel: cc.Label,
        fileLabel: cc.Label,
        byteProgress: cc.ProgressBar,
        fileProgress: cc.ProgressBar,
        label: cc.Label,
        manifestUrl: {
            type:cc.Asset,
            default:null
        },
        isHotUpdate:false
    },

    onLoad(){
        var self = this
        self.initGlobalVaribal();
        if(!self.isHotUpdate){
            self.changeScene()
            return
        }
        if (!cc.sys.isNative) return;
        self.m_hotUpdate = new hotUpdate()
        self.m_hotUpdate.initHotUpdate(self.manifestUrl,self.verifycallback.bind(self),self.updateCallBack.bind(self))
        self.m_hotUpdate.checkUpdata()
    },

    initGlobalVaribal(){
        var self = this
        G.javaManage = require('../../global/java/javaManage')
        G.javaCallBackManage = require('./../../global/java/javaCallBackManage')

        G.ioUtil = require('../../global/tools/ioUtil')
        G.tools = require('../../global/tools/tools');

        G.audioManager = cc.find('audioNode').getComponent('AudioMgr')
        G.audioManager.init()
        G.audioManager.playBGM('bgMain.mp3')
        
        G.eventManager = cc.find('systemEventNode').getComponent('systemEvent')
        G.eventManager.init()

        G.httpManage = require('../../global/net/httpManage')

        G.globalSocket = cc.find('nonControlNode').getComponent('socketManage')
        G.globalSocket.init()

        G.globalLoading = cc.find('loadingNode').getComponent('globalLoading')
        G.globalLoading.init()

        G.msgBoxMgr = cc.find('msgBoxNode').getComponent('msgBoxMgr')
        G.msgBoxMgr.init()

        G.alterMgr = cc.find('alterNode').getComponent('alterMgr')
        G.alterMgr.init()

        G.selfUserData = new UserData();

        G.gameInfo.isLogined = false
        G.gameInfo.isInGame = false
        G.gameInfo.isGamePlay = false
        // G.ioUtil.clear()
    },

    verifycallback(filePath,asset){
        console.log(TAG, "setVerifyCallback  ", filePath);
    },

    updateCallBack(code, event){
        var self = this
        if (code != Constants.UPDATE_CODE.OK){
            if (code == Constants.UPDATE_CODE.UPDATEING_ASSETS){
                self.byteProgress.progress = event.getPercent();
                self.fileProgress.progress = event.getPercentByFile();
                self.fileLabel.string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                self.byteLabel.string = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();
                var msg = event.getMessage();
                if (msg) {
                    self.label.string = 'Updated file: ' + msg;
                }
            }else if(code == Constants.UPDATE_CODE.NEW_VERSION_FOUND){
                G.msgBoxMgr.showMsgBox({
                    content:'检测到版本更新，是否进行更新？',
                    sureClickEventCallBack:function(){
                        self.m_hotUpdate.hotUpdate()
                    },
                    cancelClickEventCallBack:function(){
                        self.changeScene()
                    }
                })
            }else if(code == Constants.UPDATE_CODE.UPDATE_FAILED){
                G.msgBoxMgr.showMsgBox({
                    content:'更新失败，请重新更新！',
                    sureClickEventCallBack:function(){
                        self.m_hotUpdate.hotUpdate()
                    }
                })
            }else if(code == Constants.UPDATE_CODE.UPDATE_FINISHED){
                self.changeScene()
            }else{
                self.label.string = code;
            }
        }else{
            self.changeScene()
        }
    },

    //更换场景
    changeScene(){
        if(cc.director.getScene().name != 'LoginScene'){
            cc.director.loadScene('LoginScene')
        }
    },

    onDestroy(){
        var self = this
        if(self.m_hotUpdate){
            self.m_hotUpdate.onDestroy()
        }
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa   index has destory')
    },
});
