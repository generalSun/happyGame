var Tools = module.exports = {};

var print_r = function (obj, indent) {
    if (typeof(obj) === "function") {
        return "Function";
    }
    if (typeof(obj) !== "object") {
        return obj;
    }
    var result_str = "";
    indent = indent || 0;
    for (var key in obj) {
        var val = obj[key];
        if (typeof(key) === "string") {
            key = "\"" + key + "\"";
        }
        var szSuffix = "";
        if (typeof(val) == "object") {
            szSuffix = "{";
        }
        var szPrefix = new Array(indent + 1).join("    ");
        var formatting = szPrefix + "[" + key + "]" + " = " + szSuffix;
        if (typeof(val) == "object") {
            result_str = result_str + formatting + "\n" + print_r(val, indent + 1) + szPrefix + "},\n"
        } else {
            var szValue = print_r(val)
            result_str = result_str + formatting + szValue + ",\n"
        }
    }
    return result_str;
};

Tools._debug = function (obj) {
    console.log(print_r(obj));
};

Tools.clone = function(origin) {
    var result = Array.isArray(origin) ? [] : {};
    for (var key in origin) {
        if (origin.hasOwnProperty(key)) {
            if (typeof origin[key] === 'object') {
                result[key] = Tools.clone(origin[key]);
            } else {
                result[key] = origin[key];
            }
        }
    }
    return result;
};

Tools.getUdid = function () {
    var str = String(Date.now());
	return str.substr(str.length-10);
};

//判断是否是自己
Tools.isSelf = function (mid) {
    if (!mid) {
        return false;
    }
    var selfMid = G.selfUserData.mid?G.selfUserData.mid:-1
    return selfMid == mid;
}

//检测mid是否合法
Tools.midCheck = function (mid) {
    mid = Number(mid);
    return mid && mid > 0;
};

//检测座位号是否合法
Tools.seatCheck = function (seatID) {
    seatID = Number(seatID);
    return seatID && seatID > 0;
};

Tools.createClickEventHandler = function (target, component, handler, customEventData) {
    var clickEventHandler = new cc.Component.EventHandler();
    clickEventHandler.target = target;
    clickEventHandler.component = component;
    clickEventHandler.handler = handler;
    clickEventHandler.customEventData = customEventData;

    return clickEventHandler;
};

//==============================--
//desc: 获取格式化的钱币
//@tnum: 需要转化的数字
//@isImage: 是否显示的是艺术字
//@return 格式化后的字符串
//example:
//    输入                  输出
//    123456, false         12.34万
//    123456789, false      1.23亿
//    123456, true          12.34w
//    123456789, true       1.23y
//==============================--
Tools.getFormatMoney = function (tnum, isImage) {
    var num = parseInt(tnum) || 0

    var y = "亿";
    var w = "万";
    if (isImage) {
        y = "y";
        w = "w";
    }

    if (num >= 100000000) {
        num = (num - num % 10000) / 100000000 + y
    } else if (num >= 10000) {
        num = (num - num % 100) / 10000 + w
    } else if (num <= -100000000) {
        num = (num - num % -10000) / 100000000 + y
    } else if (num <= -10000) {
        num = (num - num % -100) / 10000 + w
    }

    return num.toString();
};

//==============================--
/*
desc: 格式化数字
@minLen: 数字最小位数
example:
    输入        minLen          输出
    12          2               12
    12          4               0012
    12          1               12
    1           2               01
*/
//==============================--
Tools.getFormatNumber = function (num, minLen) {
    var numStr = '' + num;
    var zeroNum = minLen - numStr.length;

    if (zeroNum > 0) {
        var zeroStr = new Array(zeroNum).fill('0');
        numStr = zeroStr + numStr;
    }

    return numStr;
};

//==============================--
/*
desc: 获取随机数
@min: 最小数 默认0
@max: 最大数 默认10
*/
//==============================--
Tools.random = function (minNum, maxNum) {
    if (minNum == undefined || minNum == null) {
        minNum = 0;
    }

    if (maxNum == undefined || maxNum == null) {
        maxNum = 10;
    }

    var delta = maxNum + 1 - minNum;

    return Math.floor(Math.random() * delta) + minNum;
};

// 判断是否为手机号
Tools.isPoneAvailable = function(str) {
    var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(str)) {
        return false;
    } else {
        return true;
    }
}

// 判断是否为电话号码
Tools.isTelAvailable = function(tel) {
    var myreg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
    if (!myreg.test(tel)) {
        return false;
    } else {
        return true;
    }
}

Tools.getRandName = function(){
    var familyNames = new Array("赵", "钱", "孙", "李", "周", "吴", "郑", "王", "冯", "陈", "褚", "卫", "蒋", "沈", "韩", "杨", "朱", "秦", "尤", "许", "何", "吕", "施", "张", "孔", "曹", "严", "华", "金", "魏", "陶", "姜", "戚", "谢", "邹", "喻", "柏", "水", "窦", "章", "云", "苏", "潘", "葛", "奚", "范", "彭", "郎", "鲁", "韦", "昌", "马", "苗", "凤", "花", "方", "俞", "任", "袁", "柳", "酆", "鲍", "史", "唐", "费", "廉", "岑", "薛", "雷", "贺", "倪", "汤", "滕", "殷", "罗", "毕", "郝", "邬", "安", "常", "乐", "于", "时", "傅", "皮", "卞", "齐", "康", "伍", "余", "元", "卜", "顾", "孟", "平", "黄", "和", "穆", "萧", "尹");
    var givenNames = new Array("子璇", "淼", "国栋", "夫子", "瑞堂", "甜", "敏", "尚", "国贤", "贺祥", "晨涛", "昊轩", "易轩", "益辰", "益帆", "益冉", "瑾春", "瑾昆", "春齐", "杨", "文昊", "东东", "雄霖", "浩晨", "熙涵", "溶溶", "冰枫", "欣欣", "宜豪", "欣慧", "建政", "美欣", "淑慧", "文轩", "文杰", "欣源", "忠林", "榕润", "欣汝", "慧嘉", "新建", "建林", "亦菲", "林", "冰洁", "佳欣", "涵涵", "禹辰", "淳美", "泽惠", "伟洋", "涵越", "润丽", "翔", "淑华", "晶莹", "凌晶", "苒溪", "雨涵", "嘉怡", "佳毅", "子辰", "佳琪", "紫轩", "瑞辰", "昕蕊", "萌", "明远", "欣宜", "泽远", "欣怡", "佳怡", "佳惠", "晨茜", "晨璐", "运昊", "汝鑫", "淑君", "晶滢", "润莎", "榕汕", "佳钰", "佳玉", "晓庆", "一鸣", "语晨", "添池", "添昊", "雨泽", "雅晗", "雅涵", "清妍", "诗悦", "嘉乐", "晨涵", "天赫", "玥傲", "佳昊", "天昊", "萌萌", "若萌");

    var i = parseInt(10 * Math.random()) * 10 + parseInt(10 * Math.random());
    var familyName = familyNames[i];

    var j = parseInt(10 * Math.random()) * 10 + parseInt(10 * Math.random());
    var givenName = givenNames[j];

    var name = familyName + givenName;
    return name;
}

// 获取当前时间（08：00）
Tools.getCurrentTime = function() {
    var date = new Date()
    var hour = date.getHours()//得到小时,
    var minutes = date.getMinutes()//得到分
    if(hour < 10){
        hour = '0' + hour
    }
    if(minutes < 10){
        minutes = '0' + minutes
    }
    return hour + ' : ' + minutes
}

Tools.loadResPromise = function(path, type,args) {
    return new Promise((resolve, reject) => {
        cc.loader.loadRes(path, type, (err, resource) => {
            if (err) {
                reject(err)
            } else {
                var data = {
                    resource:resource,
                    parameter:args
                }
                resolve(data)
            }
        })
    })
}

Tools.isInBothNumber = function(num, num1,num2) {
    if(typeof(num) != 'number' || typeof(num1) != 'number' || typeof(num2) != 'number'){
        return false
    }
    var max = Math.max(num1,num2)
    var min = Math.min(num1,num2)
    if(num >= min && num <= max){
        return true
    }
    return false
}
