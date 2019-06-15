cc.Class({
    extends: cc.Component,

    properties: {
        describle:cc.Label,
        additional:cc.Label
    },

    onLoad () {
        var self = this
        self.setDescrible({
            a:'三带一',
            b:'没有王炸'
        })
        self.setAdditional(4,3)
    },

    setDescrible(rules){
        rules = rules || {}
        var self = this
        var describle = self.describle.getComponent(cc.Label)
        if(describle){
            var str = ''
            for(var key in rules){
                str = str + rules[key] + ','
            }
            describle.string = str
            describle.customData = rules
        }
    },

    getDescrible(){
        var self = this
        var describle = self.describle.getComponent(cc.Label)
        var data = {}
        if(describle){
            data = describle.customData?describle.customData:data
        }
        return data
    },

    setAdditional(num,score){
        var self = this
        var additional = self.additional.getComponent(cc.Label)
        if(additional){
            if(!num){
                num = additional.customData?(additional.customData.playerNum?additional.customData.playerNum:3):3
            }
            if(!score){
                score = additional.customData?(additional.customData.bottomScore?additional.customData.bottomScore:1):1
            }
            additional.string = '人数：' + num + '          底分：' + score
            additional.customData = {
                playerNum:num,
                bottomScore:score,
            }
        }
    },

    getAdditional(){
        var self = this
        var additional = self.additional.getComponent(cc.Label)
        var num = 3
        var score = 1
        if(additional){
            num = additional.customData?(additional.customData.playerNum?additional.customData.playerNum:num):num
            score = additional.customData?(additional.customData.bottomScore?additional.customData.bottomScore:score):score
        }
        return {playerNum:num,bottomScore:score}
    },
})