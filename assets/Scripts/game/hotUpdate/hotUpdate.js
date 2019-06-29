require('./../../global/tools/stringExtra')
var Constants = require('../../config/Constants')
var javaCallBackManage = require('../../global/java/javaCallBackManage')
var UserData = require('./../../model/userData')
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
        loginNode:cc.Node,
        updateNode:cc.Node,
        isHotUpdate:false
    },

    onLoad() {
        var self = this;
        self.initGlobalVaribal();
        if(!self.isHotUpdate){
            self.hotUpdateEnd()
            return
        }
        if (!cc.sys.isNative) return;
        self.initHotUpdate()
    },

    initGlobalVaribal(){
        var self = this
        G.javaManage = require('../../global/java/javaManage')
        G.javaCallBackManage = new javaCallBackManage(self)

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
        
        G.uiFactory = require('../../global/tools/uiFactory');

        G.globalLoading = cc.find('loadingNode').getComponent('globalLoading')
        G.globalLoading.init()

        G.msgBoxMgr = cc.find('msgBoxNode').getComponent('msgBoxMgr')
        G.msgBoxMgr.init()

        G.selfUserData = new UserData();

        G.gameInfo.isLogined = false
        G.gameInfo.isInGame = false
        // G.ioUtil.clear()
    },

    hotUpdateEnd(){
        var self = this
        self.loginNode.active = true
        self.updateNode.active = false
        if(self.node.getComponent('login').hotUpdateEnd){
            self.node.getComponent('login').hotUpdateEnd()
        }
    },

    hotUpdateError(){
        var self = this
        G.msgBoxMgr.showMsgBox({
            content:'更新文件出错，点击确认将继续更新，取消将退出游戏！',
            sureClickEventCallBack:function(){
                if (!self._updating) {
                    self.label.string = 'Retry failed Assets...';
                    self._am.downloadFailedAssets();
                }
            },
            cancelClickEventCallBack:function(){
                cc.game.end();//退出游戏
            }
        })
    },

    /*
    ---------------------------------------------------------------------------------------------------------

                                            热更新

    ----------------------------------------------------------------------------------------------------------
    */
    initHotUpdate(){
        var self = this;
        self.loginNode.active = false
        self.updateNode.active = true
        self.byteProgress.active = false
        self.fileProgress.active = false
        self.byteProgress.progress = 0;
        self.fileProgress.progress = 0;
        
        self._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-assets');
        self._am = new jsb.AssetsManager('', self._storagePath, self.versionCompareHandle);

        self._am.setVerifyCallback(function (filePath, asset) {
            var compressed = asset.compressed;
            var expectedMD5 = asset.md5;
            var relativePath = asset.path;
            var size = asset.size;
            var downloadState = asset.downloadState;
            if (compressed) {
                self.label.string = "Verification passed : " + relativePath;
            }else {
                self.label.string = "Verification passed : " + relativePath + ' (' + expectedMD5 + ')';
            }
            return true;
        });
        self.label.string = 'Hot update is ready, please check or directly update.';
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            this._am.setMaxConcurrentTask(2);
        }

        self.checkUpdata()
    },

    versionCompareHandle(versionA, versionB){
        var vA = versionA.split('.');
        var vB = versionB.split('.');
        for (var i = 0; i < vA.length; ++i) {
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || 0);
            if (a === b) {
                continue;
            }
            else {
                return a - b;
            }
        }
        if (vB.length > vA.length) {
            return -1;
        }
        else {
            return 0;
        }
    },

    hotUpdate() {
        if (this._am && !this._updating) {
            this.byteProgress.active = true
            this.fileProgress.active = true
            this._am.setEventCallback(this.updateCb.bind(this));
            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                // Resolve md5 url
                var url = this.manifestUrl.nativeUrl;
                if (cc.loader.md5Pipe) {
                    url = cc.loader.md5Pipe.transformURL(url);
                }
                this._am.loadLocalManifest(url);
            }

            this._am.update();
            this._updating = true;
        }
    },

    checkUpdata() {
        console.log('检查更新')
        if (this._updating) {
            this.label.string = 'Checking or updating ...';
            this.byteProgress.active = true
            this.fileProgress.active = true
            return;
        }
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            var url = this.manifestUrl.nativeUrl;
            if (cc.loader.md5Pipe) {
                url = cc.loader.md5Pipe.transformURL(url);
            }
            this._am.loadLocalManifest(url);
        }
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            this.label.string = 'Failed to load local manifest ...';
            this.hotUpdateEnd()
            return;
        }
        this._am.setEventCallback(this.checkCb.bind(this));
        this._am.checkUpdate();
        this._updating = true;
    },

    checkCb: function (event) {
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.label.string = "No local manifest file found, hot update skipped.";
                this.hotUpdateEnd()
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.label.string = "Fail to download manifest file, hot update skipped.";
                this.hotUpdateEnd()
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.label.string = "Already up to date with the latest remote version.";
                this.hotUpdateEnd()
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this.label.string = 'New version found, start try to update.';
                this.hotUpdate()
                break;
            default:
                return;
        }
        this._am.setEventCallback(null);
        this._checkListener = null;
        this._updating = false;
    },

    updateCb: function (event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.label.string = 'No local manifest file found, hot update skipped.';
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                this.byteProgress.progress = event.getPercent();
                this.fileProgress.progress = event.getPercentByFile();

                this.fileLabel.string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                this.byteLabel.string = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();

                var msg = event.getMessage();
                if (msg) {
                    this.label.string = 'Updated file: ' + msg;
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.label.string = 'Fail to download manifest file, hot update skipped.';
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.label.string = 'Already up to date with the latest remote version.';
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                this.label.string = 'Update finished. ' + event.getMessage();
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                this.label.string = 'Update failed. ' + event.getMessage();
                this._updating = false;
                this._canRetry = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                this.label.string = 'Asset update error: ' + event.getAssetId() + ', ' + event.getMessage();
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                this.label.string = event.getMessage();
                break;
            default:
                break;
        }

        if (failed) {
            this._am.setEventCallback(null);
            this._updateListener = null;
            this._updating = false;
            this.hotUpdateError()
        }

        if (needRestart) {
            this._am.setEventCallback(null);
            this._updateListener = null;
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();

            Array.prototype.unshift.apply(searchPaths, newPaths);
            G.ioUtil.set(Constants.LOCALLSTORAGEKEY.HOTUPDATESEARCHPATHS,JSON.stringify(searchPaths))
            jsb.fileUtils.setSearchPaths(searchPaths);
            cc.audioEngine.stopAll();
            cc.game.restart();
        }
    },

    onDestroy: function () {
        if (this._updateListener) {
            this._am.setEventCallback(null);
            this._updateListener = null;
        }
    }
});
