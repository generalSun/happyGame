var TAG = 'ruleInfo.js'
cc.Class({
    extends: cc.Component,

    properties: {
        describle:cc.Label,
        additional:cc.Label
    },

    onLoad () {
        var self = this
        
    },

    analysisRule(infos){
        console.log(TAG,'analysisRule',infos)
        if(!infos)return
        var self = this
        var rules = {}
        for(var key in infos){
            if(key != 'playway' && key != 'gamemodel' && key != 'gametype'){
                var info = infos[key]
                var str = ''
                if(key == 'dizhu'){
                    if(info == 'qiang'){
                        str = '抢地主'
                    }else{
                        str = '叫分'
                    }
                }else if(key == 'game'){
                    if(info == 'dizhu'){
                        str = '经典玩法'
                    }else{
                        str = '癞子玩法'
                    }
                }else if(key == 'games'){
                    if(info == '8'){
                        str = '8局（房卡x1）'
                    }else if(info == '16'){
                        str = '16局（房卡x2）'
                    }else if(info == '25'){
                        str = '25局（房卡x3）'
                    }
                }else if(key == 'limit'){
                    if(info == '64'){
                        str = '64分封顶'
                    }else if(info == '128'){
                        str = '128分封顶'
                    }else if(info == '256'){
                        str = '256分封顶'
                    }
                }
                rules[key] = str
            }
        }
        self.setDescrible(rules)
    },

    setDescrible(rules){
        rules = rules || {}
        var self = this
        var describle = self.describle.getComponent(cc.Label)
        if(describle){
            var str = ''
            for(var key in rules){
                str = str + rules[key] + ' '
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