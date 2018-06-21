(function($) {
$.extend($.fn.validatebox.defaults.rules, {
    eqPwd: {
        validator: function (value, param) {
            return value == $(param[0]).val();
        },
        message: '密码不一致！'
    },
    checkEndDate: {//截止日期必须大于等于开始日期
        validator: function (value, param) {
            return value >= $(param[0]).val();
        },
        message: '截止日期必须大于等于开始日期！'
    },
    idcard: {// 验证身份证
        validator: function (value) {
            return /^\d{15}(\d{2}[A-Za-z0-9])?$/i.test(value);
        },
        message: '身份证号码格式不正确'
    },
    minLength: {
        validator: function (value, param) {
            return value.length >= param[0];
        },
        message: '请输入至少（2）个字符.'
    },
    length: {
        validator: function (value, param) {
            var len = $.trim(value).length;
            return len >= param[0] && len <= param[1];
        },
        message: "输入内容长度必须介于{0}和{1}之间."
    },
    phone: {// 验证电话号码
        validator: function (value) {
            return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
        },
        message: '格式不正确,请使用下面格式:010-88888888'
    },
    mobile: {// 验证手机号码
        validator: function (value) {
            return /^(13|15|17|18)\d{9}$/i.test(value);
        },
        message: '手机号码格式不正确'
    },
    mobileAndPhone: {// 验证固话或手机号码
        validator: function (value) {
            return /^((0\d{2,3}-\d{7,8})|(0\d{2,3}-\d{7,8}-\d{2,4})|(1[3578]\d{9}))$/i.test(value);
        },
        message: '格式:010-12345678 或 13512345678 或010-12345678-123'
    },
    intOrFloat: {// 验证正整数或小数
        validator: function (value) {
            return /^\d+(\.\d+)?$/i.test(value);
        },
        message: '请输入数字，并确保格式正确'
    },
    notZeroPositiveInteger: {// 验证非0的正整数
        validator: function (value) {
            return /^\+?[1-9][0-9]*$/i.test(value);
        },
        message: '请输入非0的正整数，并确保格式正确'
    },
    realNumberFour: {// 验证正实数,可以为0,4位小数
        validator: function (value) {
            return /^(([1-9]\d*)|(0))(\.[0-9]{1,4})?$/i.test(value);
        },
        message: '请输入正实数，精度4位小数'
    },
    integer: {// 验证整数
        validator: function (value) {
            return /^[+]?[1-9]+\d*$/i.test(value);
        },
        message: '请输入整数'
    },
    currency: {// 验证货币
        validator: function (value) {
            return /^\d+(\.\d+)?$/i.test(value);
        },
        message: '金额格式不正确'
    },
    qq: {// 验证QQ,从10000开始
        validator: function (value) {
            return /^[1-9]\d{4,9}$/i.test(value);
        },
        message: 'QQ号码格式不正确'
    },
    age: {// 验证年龄
        validator: function (value) {
            return /^(?:[1-9][0-9]?|1[01][0-9]|150)$/i.test(value);
        },
        message: '年龄必须是0到150之间的整数'
    },
    chinese: {// 验证中文
        validator: function (value) {
            return /^[\Α-\￥]+$/i.test(value);
        },
        message: '请输入中文'
    },
    english: {// 验证英语
        validator: function (value) {
            return /^[A-Za-z]+$/i.test(value);
        },
        message: '请输入英文'
    },
    unnormal: {// 验证是否包含空格和非法字符
        validator: function (value) {
            return /.+/i.test(value);
        },
        message: '输入值不能为空和包含其他非法字符'
    },
    username: {// 验证用户名
        validator: function (value) {
            return /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/i.test(value);
        },
        message: '用户名不合法（字母开头，允许6-16字节，允许字母数字下划线）'
    },
    faxno: {// 验证传真
        validator: function (value) {
            return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
        },
        message: '传真号码不正确'
    },
    zip: {// 验证邮政编码
        validator: function (value) {
            return /^[0-9]\d{5}$/i.test(value);
        },
        message: '邮政编码格式不正确'
    },
    englishAndNumber: {// 验证英文和数字
        validator: function (value) {
            return /^[A-Za-z0-9]+$/i.test(value);
        },
        message: '请输入英文和数字'
    },
    YesOrNotCn: {// 只能输入"是"或"否"
        validator: function (value) {
            return /^[是否]$/i.test(value);
        },
        message: '请输入:是 否'
    },
    enCnAndNumber: {// 中英文数字,不包括下划线等符合
        validator: function (value) {
            return /^[\u4E00-\u9FA5A-Za-z0-9]+$/i.test(value);
        },
        message: '中文、英文、数字但不包括下划线等符号'
    },
    loginUser: {// 帐号规则(字母开头，允许5-16字节，允许字母数字下划线)
        validator: function (value) {
            return /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/i.test(value);
        },
        message: '字母开头，允许5-16字节，允许字母数字下划线'
    },
    ip: {// 验证IP地址
        validator: function (value) {
            return /d+.d+.d+.d+/i.test(value);
        },
        message: 'IP地址格式不正确'
    },
    name: {// 验证姓名，可以是中文或英文
        validator: function (value) {
            return /^[\Α-\￥]+$/i.test(value) | /^\w+[\w\s]+\w+$/i.test(value);
        },
        message: '请输入姓名'
    },
    msn: {
        validator: function (value) {
            return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
        },
        message: '请输入有效的msn账号(例：abc@hotnail(msn/live).com)'
    }
});
})(jQuery);