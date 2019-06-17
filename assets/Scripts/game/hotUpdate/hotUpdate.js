require('./../../global/tools/stringExtra')
var constants = require('../../config/Constants')
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
        this.initGlobalVaribal();
        if(!this.isHotUpdate){
            this.requestServerConfig()
            return
        }
        if (!cc.sys.isNative) {
            return;
        }
        this.loginNode.active = false
        this.updateNode.active = true
        this.byteProgress.active = false
        this.fileProgress.active = false
        this.byteProgress.progress = 0;
        this.fileProgress.progress = 0;
        var self = this;
        this._storagePath = jsb.fileUtils.getWritablePath();
        this._am = new jsb.AssetsManager('', this._storagePath, this.versionCompareHandle);
        if (!cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._am.retain();
        }
        this._am.setVerifyCallback(function (path, asset) {
            var compressed = asset.compressed;
            var expectedMD5 = asset.md5;
            var relativePath = asset.path;
            var size = asset.size;
            if (compressed) {
                self.label.string = "Verification passed : " + relativePath;
                return true;
            }
            else {
                self.label.string = "Verification passed : " + relativePath + ' (' + expectedMD5 + ')';
                return true;
            }
        });
        this.checkUpdata()
    },

    initGlobalVaribal(){
        var self = this
        G.javaManage = require('../../global/java/javaManage')
        G.javaCallBackManage = new javaCallBackManage(this)

        G.httpManage = require('../../global/net/httpManage')
        G.globalSocket = cc.find('nonControlNode').getComponent('socketManage')

        G.globalLoading = cc.find('loadingNode').getComponent('globalLoading')

        G.msgBoxMgr = cc.find('msgBoxNode').getComponent('msgBoxMgr')

        G.eventManager = cc.find('systemEventNode').getComponent('systemEvent')

        G.ioUtil = require('../../global/tools/ioUtil')
        G.tools = require('../../global/tools/tools');
        G.uiFactory = require('../../global/tools/uiFactory');

        G.SelfUserData = new UserData();

        G.gameInfo.isLogined = false
        G.gameInfo.isInGame = false
        G.ioUtil.clear()
    },

    socketConnected(){
        this.node.emit(constants.EVENTNAME.Login)
    },

    //拉取配置成功
    requestSuccess(){
        this.loginNode.active = true
        this.updateNode.active = false
        G.globalSocket.setMsgHandler(this)
        G.globalSocket.connectSocket()
    },

    //拉取配置失败
    requestError(){
        var self = this
        G.msgBoxMgr.showMsgBox({
            content:'请求数据出错，再次请求！',
            clickEventCallBack:self.requestServerConfig.bind(self)
        })
    },

    requestServerConfig(){
        cc.director.loadScene('DdzGameScene')
        // var self = this
        // G.globalSocket.requestServerConfig(self.requestSuccess.bind(self),self.requestError.bind(self))
    },

    /*
    ---------------------------------------------------------------------------------------------------------

                                            热更新

    ----------------------------------------------------------------------------------------------------------
    */
    hotUpdate() {
        if (this._am && !this._updating) {
            this.byteProgress.active = true
            this.fileProgress.active = true
            this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this));
            cc.eventManager.addListener(this._updateListener, 1);

            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                this._am.loadLocalManifest(this.manifestUrl);
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
            this._am.loadLocalManifest(this.manifestUrl);
        }
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            this.label.string = 'Failed to load local manifest ...';
            this.requestServerConfig()
            return;
        }
        this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.checkCb.bind(this));
        cc.eventManager.addListener(this._checkListener, 1);

        this._am.checkUpdate();
        this._updating = true;
    },

    checkCb: function (event) {
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.label.string = "No local manifest file found, hot update skipped.";
                this.requestServerConfig()
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.label.string = "Fail to download manifest file, hot update skipped.";
                this.requestServerConfig()
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.label.string = "Already up to date with the latest remote version.";
                this.requestServerConfig()
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this.label.string = 'New version found, start try to update.';
                this.hotUpdate()
                break;
            default:
                return;
        }

        cc.eventManager.removeListener(this._checkListener);
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
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
            this._updating = false;
            this.requestServerConfig()
        }

        if (needRestart) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();

            Array.prototype.unshift(searchPaths, newPaths);
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);

            cc.game.restart();
        }
    },
});
