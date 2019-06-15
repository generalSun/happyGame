const HTTPROOTURL = 'http://192.168.118.128';

const EVENTNAME = {
    Login:'Login'
}

const SERVERCONFIGURL = {
	dev: HTTPROOTURL+':3001/serverconfig',
	test: HTTPROOTURL+':3001/serverconfig',
	formal: HTTPROOTURL+':3001/serverconfig',
};

const LOCALLSTORAGEKEY = {
    USERINFO:'userInfo',
    GAMECONFIG:'gameConfig',
    AUDIO:'audio',
    CARDTYPE:'cardType'
}

const THIRTINFO = {
    WX:{
        appkey: "wxafc956f84f22788f",
        appsecret: "10677f489ec36a99b7f4f1e0bf301c5e",
    }
}

const CARD_STATUS = {
	STATUS_NORMAL:1,
	STATUS_NORMAL_SELECT:2,
	STATUS_POP:3,
	STATUS_POP_SELECT:4,
	STATUS_DRAWING:5,
}

module.exports = {
    EVENTNAME:EVENTNAME,
    HTTPROOTURL:HTTPROOTURL,
    LOCALLSTORAGEKEY:LOCALLSTORAGEKEY,
    SERVERCONFIGURL:SERVERCONFIGURL,
    THIRTINFO:THIRTINFO,
    CARD_STATUS:CARD_STATUS
};