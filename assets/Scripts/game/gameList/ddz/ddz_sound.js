var config = function(){
    this.sex = 'girl'
    this.sound = {
        '3D1':'ddz/'+this.sex+'/3D1.ogg',
        '3D2':'ddz/'+this.sex+'/3D2.ogg',
        '4D2':'ddz/'+this.sex+'/4D2.ogg',
        '4D22':'ddz/'+this.sex+'/4D22.ogg',
        baojing1:'ddz/'+this.sex+'/baojing1.ogg',
        baojing2:'ddz/'+this.sex+'/baojing2.ogg',
        bigger_u1:'ddz/'+this.sex+'/bigger_u1.ogg',
        bigger_u2:'ddz/'+this.sex+'/bigger_u2.ogg',
        bigger_u3:'ddz/'+this.sex+'/bigger_u3.ogg',
        card_Size1:'ddz/'+this.sex+'/card_Size1.ogg',
        card_Size2:'ddz/'+this.sex+'/card_Size2.ogg',
        card_Size3:'ddz/'+this.sex+'/card_Size3.ogg',
        card_Size4:'ddz/'+this.sex+'/card_Size4.ogg',
        card_Size5:'ddz/'+this.sex+'/card_Size5.ogg',
        card_Size6:'ddz/'+this.sex+'/card_Size6.ogg',
        card_Size7:'ddz/'+this.sex+'/card_Size7.ogg',
        card_Size8:'ddz/'+this.sex+'/card_Size8.ogg',
        card_Size9:'ddz/'+this.sex+'/card_Size9.ogg',
        card_Size10:'ddz/'+this.sex+'/card_Size10.ogg',
        card_Size11:'ddz/'+this.sex+'/card_Size11.ogg',
        card_Size12:'ddz/'+this.sex+'/card_Size12.ogg',
        card_Size13:'ddz/'+this.sex+'/card_Size13.ogg',
        card_Size14:'ddz/'+this.sex+'/card_Size14.ogg',
        card_Size15:'ddz/'+this.sex+'/card_Size15.ogg',
        dui1:'ddz/'+this.sex+'/dui1.ogg',
        dui2:'ddz/'+this.sex+'/dui2.ogg',
        dui3:'ddz/'+this.sex+'/dui3.ogg',
        dui4:'ddz/'+this.sex+'/dui4.ogg',
        dui5:'ddz/'+this.sex+'/dui5.ogg',
        dui6:'ddz/'+this.sex+'/dui6.ogg',
        dui7:'ddz/'+this.sex+'/dui7.ogg',
        dui8:'ddz/'+this.sex+'/dui8.ogg',
        dui9:'ddz/'+this.sex+'/dui9.ogg',
        dui10:'ddz/'+this.sex+'/dui10.ogg',
        dui11:'ddz/'+this.sex+'/dui11.ogg',
        dui12:'ddz/'+this.sex+'/dui12.ogg',
        dui13:'ddz/'+this.sex+'/dui13.ogg',
        FeiJi:'ddz/'+this.sex+'/FeiJi.ogg',
        jiabei_0:'ddz/'+this.sex+'/jiabei_0.ogg',
        jiabei_1:'ddz/'+this.sex+'/jiabei_1.ogg',
        imgj_0:'ddz/'+this.sex+'/jiaodizhu_0.ogg',
        imgj_1:'ddz/'+this.sex+'/jiaodizhu_1.ogg',
        LianDui:'ddz/'+this.sex+'/LianDui.ogg',
        pass1:'ddz/'+this.sex+'/pass1.ogg',
        pass2:'ddz/'+this.sex+'/pass2.ogg',
        pass3:'ddz/'+this.sex+'/pass3.ogg',
        pass4:'ddz/'+this.sex+'/pass4.ogg',
        imgq_0:'ddz/'+this.sex+'/qiangdizhu_0.ogg',
        imgq_2:'ddz/'+this.sex+'/qiangdizhu_1.ogg',
        qiangdizhu_2:'ddz/'+this.sex+'/qiangdizhu_2.ogg',
        qiangdizhu_3:'ddz/'+this.sex+'/qiangdizhu_3.ogg',
        score_0:'ddz/'+this.sex+'/score_0.ogg',
        score_1:'ddz/'+this.sex+'/score_1.ogg',
        score_2:'ddz/'+this.sex+'/score_2.ogg',
        score_3:'ddz/'+this.sex+'/score_3.ogg',
        ShunZi:'ddz/'+this.sex+'/ShunZi.ogg',
        tuple1:'ddz/'+this.sex+'/tuple1.ogg',
        tuple2:'ddz/'+this.sex+'/tuple2.ogg',
        tuple3:'ddz/'+this.sex+'/tuple3.ogg',
        tuple4:'ddz/'+this.sex+'/tuple4.ogg',
        tuple5:'ddz/'+this.sex+'/tuple5.ogg',
        tuple6:'ddz/'+this.sex+'/tuple6.ogg',
        tuple7:'ddz/'+this.sex+'/tuple7.ogg',
        tuple8:'ddz/'+this.sex+'/tuple8.ogg',
        tuple9:'ddz/'+this.sex+'/tuple9.ogg',
        tuple10:'ddz/'+this.sex+'/tuple10.ogg',
        tuple11:'ddz/'+this.sex+'/tuple11.ogg',
        tuple12:'ddz/'+this.sex+'/tuple12.ogg',
        tuple13:'ddz/'+this.sex+'/tuple13.ogg',
        wangzha:'ddz/'+this.sex+'/wangzha.ogg',
        zhadan:'ddz/'+this.sex+'/zhadan.ogg',
    }
}

config.prototype.playSound = function(sex,sound){
    if(!sound)return
    this.sex = (sex == 0)?'girl':'boy'
    var path = this.sound[sound]
    G.audioManager.playSFX(path)
}

var ddz_sound = {}
ddz_sound.config = null
ddz_sound.getInstance = function(){
    if(ddz_sound.config == null){
        ddz_sound.config = new config()
    }
    return ddz_sound.config
}

module.exports = ddz_sound