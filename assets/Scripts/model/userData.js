cc.Class({
    properties: {
    	diamond: 0,//钻石
		account:null,
		password:null,
	    userId:null,//可以获取头像地址
		userName:null,
		token:null,
		lv:0,
		exp:0,
		coins:0,//金币
		gems:0,//房卡
		sign:0,
		city:0,//城市
		province:0,//省份
		ip:"",
		orgi:null,
		sex:0,
		fans:0,			//粉丝
		follows:0,		//关注
		integral:0,		//积分
		headimage:false,
		roomID:null,
		roomInfo:null,
		hallInfo:null
	},

	setUserProvince (province) {
		var self = this
    	self.province = province;
	},

	getUserProvince () {
		var self = this
    	return self.province
	},

	setUserCity (city) {
		var self = this
    	self.city = city;
	},

	getUserCity () {
		var self = this
    	return self.city
	},

	setUserIntegral (integral) {
		var self = this
    	self.integral = integral;
	},

	getUserIntegral () {
		var self = this
    	return self.integral
	},

	setUserFollows (follows) {
		var self = this
    	self.follows = follows;
	},

	getUserFollows () {
		var self = this
    	return self.follows
	},

	setUserFans (fans) {
		var self = this
    	self.fans = fans;
	},

	getUserFans () {
		var self = this
    	return self.fans
	},

	setUserHeadImage (flag) {
		var self = this
    	self.headimage = flag;
	},

	getUserHeadImage () {
		var self = this
    	return self.headimage
	},

	setUserHallInfo (hallInfo) {
		var self = this
    	self.hallInfo = hallInfo;
	},

	getUserHallInfo () {
		var self = this
    	return self.hallInfo
	},

	setUserOrgi (orgi) {
		var self = this
    	self.orgi = orgi;
	},

	getUserOrgi () {
		var self = this
    	return self.orgi
	},

	setUserToken (token) {
		var self = this
    	self.token = token;
	},

	getUserToken () {
		var self = this
    	return self.token
	},
	
	setUserRoomInfo (roomInfo) {
		var self = this
    	self.roomInfo = roomInfo;
	},

	getUserRoomInfo () {
		var self = this
    	return self.roomInfo
	},
	
	setUserDiamond (diamond) {
		var self = this
    	self.diamond = parseInt(diamond);
	},

	getUserDiamond () {
		var self = this
    	return self.diamond
	},

	setUserAccount (account) {
		var self = this
    	self.account = account
	},

	getUserAccount () {
		var self = this
    	return self.account
	},

	setUserPassword (password) {
		var self = this
    	self.password = password
	},

	getUserPassword () {
		var self = this
    	return self.password
	},

	setUserId (userId) {
		var self = this
    	self.userId = userId
	},

	getUserId () {
		var self = this
    	return self.userId
	},

	setUserName (userName) {
		var self = this
    	self.userName = userName
	},

	getUserName () {
		var self = this
    	return self.userName
	},

	setUserLV (lv) {
		var self = this
    	self.lv = parseInt(lv);
	},

	getUserLV () {
		var self = this
    	return self.lv
	},

	setUserExp (exp) {
		var self = this
    	self.exp = exp
	},

	getUserExp () {
		var self = this
    	return self.exp
	},

	setUserCoins (coins) {
		var self = this
    	self.coins = coins
	},

	getUserCoins () {
		var self = this
    	return self.coins
	},

	setUserGems (gems) {
		var self = this
    	self.gems = gems
	},

	getUserGems () {
		var self = this
    	return self.gems
	},

	setUserSign (sign) {
		var self = this
    	self.sign = sign
	},

	getUserSign () {
		var self = this
    	return self.sign
	},

	setUserIP (ip) {
		var self = this
    	self.ip = ip
	},

	getUserIP () {
		var self = this
    	return self.ip
	},

	setUserSex (sex) {
		var self = this
    	self.sex = sex
	},

	getUserSex () {
		var self = this
    	return self.sex
	},

	setUserRoomID (roomID) {
		var self = this
    	self.roomID = roomID
	},

	getUserRoomID () {
		var self = this
    	return self.roomID
	},
});