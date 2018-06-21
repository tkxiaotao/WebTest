/*
本JS为移动版网页前端基础框架，部分内容需在jQuery框架内实现！
作者：www.vison.me
联系：mail@vison.me
*/

//公共模板////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
//判断图片出错显示默认图片---------------------------------------------------
$(document).ready(function(e) {
	$("img").error(function(){
		$(this).attr("src","/base/images/common_imgerror.jpg");
	})
});
*/

$(document).ready(function (e) {

    /*
	//右上角下拉菜单///////////
	$("header .tonav").on("click",function(){
		$("nav").slideToggle("fast");
	})
	*/

    /*
	//页面跳转时的加载效果
	$("a[href]").click(function(){ 
		$("body").append("<div id='PageLoading'><span><i>数据加载中<i></span></div>");
		$("#PageLoading").addClass("Show");
	}); 
	*/

    //右上角下拉菜单（CSS3）/////////////////////////////
    $("header .tonav").on("click", function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
            $("nav a").removeClass("Show");
            $("nav a").addClass("Hide");
        }
        else {
            $(this).addClass("active");
            $("nav a").removeClass("Hide");
            $("nav a").addClass("Show");
        }
    })


    /*
	//加载等待效果///////////////////////////////////
	$("body").append("<div id='Loading'></div>");//页面时开始显示
	$("img").on("load",function(){
		$("#Loading").remove();//页面加载完释放
	})
	*/

    //编辑表单内容时自动下拉到相应位置///////////
    //$(".Textbox:hidden,.Textarea:hidden").on("focus",function(){
    $("body").on("focus", ".Textbox,.Textarea", function () {
        if (!$(this).hasClass("hidden")) {
            //只针对主体操作，防止主副本同时操作两次
            var Top = $(this).offset().top;
            Top = Top * 1 - 200;
            $("html,body").stop();
            $("html,body").animate({ "scrollTop": Top });
            //alert("F")
        }
    })
});


//表单输入提示/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function (e) {

    //带.disable样式的按钮设定为无效-----------------------------------------------
    $(".disabled").attr("disabled", true);

    //页面加载时初始化提示--------------------------------------------------------
    var TheTips = $("[data-tips]");
    for (var i = 0; i < TheTips.length; i++) {
        var This = TheTips.eq(i);
        var Type = FormType(This);
        var Tips = This.attr("data-tips");
        var Val = This.val();

        var ID = This.attr("id");
        var Tips = This.attr("data-tips");
        var TipsBox = This.clone().removeAttr("data-tips data-validator name").attr("data-id", ID).attr("readonly", "readonly").val(Tips).addClass("Tips"); //克隆原标签，并添加相关属性
        if (Type == "password") TipsBox.attr("type", "text").attr("readonly", "readonly");//如果是密码框还要把密码框变成文本框
        This.after(TipsBox); //在控键后创建提示框

        //如果输入框内容为空则隐藏原输入框，否则隐藏提示框
        if (Val == "" | Val == null | Val == Tips) {
            This.hide();
        }
        else {
            TipsBox.hide();
        }
    }

    //当提示框获得焦点时--------------------------------------------------------
    $("body").on("focus click", "input.Tips,textarea.Tips", function () {
        var ID = $(this).attr("data-id");
        $(this).hide();
        $("#" + ID).show();
        $("#" + ID).focus();
    })

    //当输入框失去焦点时--------------------------------------------------------
    $("body").on("blur", "input[data-tips],textarea[data-tips]", function () {
        var This = $(this);
        var Val = This.val();//表单值
        var Tips = This.attr("data-tips");//提示内容
        var TipsBox = This.next("[data-id='" + This.attr("id") + "']");//提示框

        //如果内容为空或跟提示一样时,否则显示主体
        if (Val == "" | Val == null | Val == Tips) {
            This.hide().val("");//主体隐藏及清空
            TipsBox.show();//提示框显示
        }
        else {
            This.show();//主体显示
            TipsBox.hide();//提示框隐藏
        }
    })

    //基础：判断表单类型--------------------------------------------------------
    function FormType(This) {
        var Type = This.prop("type");
        if (Type == "select-one" | Type == "select-multiple") Type = "select";//选择框
        if (Type == "text" | Type == "textarea" | Type == "tel" | Type == "mail" | Type == "number" | Type == "search" | Type == "url") Type = "text";//单行文本框
        if (Type == "password") Type = "password";//密码框
        if (Type == "month" | Type == "datetime" | Type == "datetime-local" | Type == "date" | Type == "week" | Type == "time") Type = "datetime";
        if (Type == "button" | Type == "reset") Type = "button";
        return (Type);
    }
});


//自动验证表单格式//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function (e) {

    //验证=============================================================================================
    function Validators(This) {
        var Mode = This.attr("data-validator").replace(" ", "").split(";");
        var Val = This.val();
        var Tips = This.attr("data-tips");
        var ID = This.attr("id");
        var TipsBox = $("[data-id='" + ID + "']")
        var IsError = false;
        //循环判断每个小段的判断
        for (var i = 0; i < Mode.length; i++) {
            //必填项：required()---------------------------------------------------------------
            if (Mode[i].indexOf("required") >= 0) {
                if (Val == "" | Val == null | Val == Tips) {
                    IsError = true;//如果为空则错
                }
            }

            //判断必填项：length(最小字符数,最大字符数)-----------------------------------------
            if (Mode[i].indexOf("length") >= 0 & Val != "") {
                var Parameter = Mode[i].replace("length", "").replace("(", "").replace(")", "").split(",");
                var Min = (Parameter[0] == "" | Parameter[0] == null) ? "0" : Parameter[0];//如果第一个参数为空的话设为零
                var Max = (Parameter[1] == "" | Parameter[1] == null | Parameter[1] == 0) ? "999999999" : Parameter[1];//如果第二个参数等于0或等于空的话就相当于不设上限
                var Length = Val.length;
                if (Length < Min | Length > Max) {
                    IsError = true;//如果字数不对则错
                }
            }

            //判断Email：email()-----------------------------------------
            if (Mode[i].indexOf("email") >= 0 & Val != "") {
                var patrn = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
                if (!patrn.test(Val)) {
                    IsError = true;//如果不匹配正则表达式则错
                }
            }

            //判断是否为数字：digit()-----------------------------------------
            if (Mode[i].indexOf("digit") >= 0 & Val != "") {
                var patrn = /^[\-]?[0-9]+([\.]?[0-9]+)?$/;
                if (!patrn.test(Val)) {
                    IsError = true;//如果不匹配正则表达式则错
                }
            }

            //判断是否为正整数：intp()-----------------------------------------
            if (Mode[i].indexOf("pint") >= 0 & Val != "") {
                var patrn = /^\d+$/;
                if (!patrn.test(Val)) {
                    IsError = true;//如果不匹配正则表达式则错
                }
            }

            //对比两个输入框的值是否相等，一般用于验证密码确认：compare(目标框的ID)-----------------------------------------
            if (Mode[i].indexOf("compare") >= 0) {
                var Parameter = Mode[i].replace("compare", "").replace("(", "").replace(")", "").split(",");
                var TargetVal = $("#" + Parameter[0]).val();
                var patrn = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
                if (Val != TargetVal) {
                    IsError = true;//如果不匹配正则表达式则错
                }
            }
        }

        //验证完成后根据结果执行相应操作=============================================================================================
        if (IsError) {
            //alert("出错"+This.prop("type"));
            This.addClass("Error");
            $("[data-id='" + ID + "']").addClass("Error")
        }
        else {
            This.removeClass("Error");
            $("[data-id='" + ID + "']").removeClass("Error")
        }
    }


    //激活验证==========================================================================================================
    //当表单失去焦点时激活验证--------------------------------------------------
    $("body").on("blur", "*[data-validator]", function () {
        Validators($(this))
    })


    //在表单提交时判断是否通过--------------------------------------------------
    $("body").on("submit", "form", function () {
        //全部表单激活验证
        var Objs = $("[data-validator]");
        for (var i = 0; i < Objs.length; i++) {
            Validators(Objs.eq(i));
        }

        //判断所有带验证的表单，是否包含Error的样式，包含则不提交
        var ErrorObj = $("*[data-validator].Error");
        if (ErrorObj.length != 0) {
            return false;
        }
    })
});





//模拟单选框功能/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function (e) {
    $("input.Select").attr("readonly", "readonly");//初始化，将模拟选择控件设置成只读，手机浏览器点击时才不会弹出输入法

    //点击Select选择框--------------------------------------------------------------------------------------------
    $("body").on("focus", ".Select", function () {
        $(this).blur();
        var ID = $(this).attr("ID");
        var Items = $(this).attr("data-option").split(",");
        var Text = $(this).val();

        //选项列表//////////////
        var ItemList = "";
        var BoxHeight = 0;
        for (i = 0; i < Items.length; i++) {
            if (Items[i] == Text) {
                ItemList += "<li class='active'>" + Items[i] + "</li>";
            }
            else {
                ItemList += "<li>" + Items[i] + "</li>";
            }

            if (i < 7) BoxHeight = (i + 1) * 130;
        }

        //输出列表//////////////
        $("body").append("<div id='SelectPop'><div style='height:" + BoxHeight + "px;' data-id='" + ID + "'><ul>" + ItemList + "</ul></div></div>"); //创建POP对话框
        $("#SelectPop div").css("margin-top", ($(window).height() - BoxHeight) / 2.5); //调整对话框高度

        //IE6的特殊礼遇
        if (navigator.userAgent.match("MSIE 6.0") != null) {
            $("#SelectPop").css("height", $(document).height()); //背景框高度

            var Y = $(document).scrollTop() + ($(window).height() - BoxHeight) / 2.5;
            $("#SelectPop div").css("margin-top", Y);
        }

        //动画初始化
        $("#SelectPop").css("opacity", 0);//设置背景透明
        $("#SelectPop div").css("opacity", 0);//设置内容框透明

        //动画开始
        $("#SelectPop").animate({ opacity: 1 }, 0);
        var Top = $("#SelectPop div").css("margin-top").replace("px", "") - 7;//获取顶距
        $("#SelectPop div").animate({ opacity: 1, marginTop: Top }, "fast");
        //$("#Pop div").animate({margin-top:$("#Pop div").css("margin-top")-100},"slow");

        $("html,body").css("overflow", "hidden");//从CSS禁用滚动

        //把已经选项调整到选项的中央位置
        var LiTop = $("#SelectPop div ul li.active").offset().top - $("#SelectPop div").offset().top - 395;
        $("#SelectPop div").scrollTop(LiTop);

        //点击背景框也可以关闭对话框
        $("#SelectPop").on("click", function (event) {
            if (event.target.id == "SelectPop") {
                SelectPop_Close();
            }
        });
    })

    function SelectPop_Close() {
        var Pop = $("#SelectPop");
        var PopDiv = $("#SelectPop div");
        Pop.animate({ opacity: 0 }, "fast");
        var Top = PopDiv.css("margin-top").replace("px", "") - (-7);//获取顶距
        PopDiv.animate({ opacity: 0, marginTop: Top }, "fast", function () { Pop.remove() });

        $("html,body").css("overflow", "");//从CSS禁用滚动(第2个参数必须为空，不然导致选择框定位无效)
    }

    //点击选项--------------------------------------------------------------------------------------------
    $("body").on("click", "#SelectPop li", function () {
        var ID = $(this).parent().parent().attr("data-id");
        var ThisInput = $("#" + ID);
        var Text = $(this).text();
        ThisInput.val(Text);//选中赋值
        ThisInput.blur();//模拟输入完成

        SelectPop_Close();
    })
});


//模拟复选框功能/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function (e) {
    $("input.Checkbox").attr("readonly", "readonly");//初始化，将模拟选择控件设置成只读，手机浏览器点击时才不会弹出输入法

    //点击Checkbox选择框---------------------------------------------------------------------------------
    $("body").on("focus", ".Checkbox", function () {
        $(this).blur();
        var ID = $(this).attr("ID");
        var Items = $(this).attr("data-option").split(",");

        //选项列表//////////////
        var Text = $(this).val();
        var ItemList = "";
        var BoxHeight = 0;
        for (i = 0; i < Items.length; i++) {
            if (Text.indexOf(Items[i]) >= 0) {
                ItemList += "<li class='active'>" + Items[i] + "</li>";
            }
            else {
                ItemList += "<li>" + Items[i] + "</li>";
            }

            if (i < 6) BoxHeight = (i + 2) * 129;
        }
        var ButtonTop = ($(window).height() - BoxHeight) / 2.5 + BoxHeight - 130;

        //输出列表//////////////
        $("body").append("<div id='CheckboxPop'><div style='height:" + BoxHeight + "px;' data-id='" + ID + "'><ul>" + ItemList + "</ul><button style='top:" + ButtonTop + "px;'>确认</button></div></div>"); //创建POP对话框
        $("#CheckboxPop div").css("margin-top", ($(window).height() - BoxHeight) / 2.5); //调整对话框高度

        //IE6的特殊礼遇
        if (navigator.userAgent.match("MSIE 6.0") != null) {
            $("#CheckboxPop").css("height", $(document).height()); //背景框高度

            var Y = $(document).scrollTop() + ($(window).height() - BoxHeight) / 2.5;
            $("#CheckboxPop div").css("margin-top", Y);
        }

        //动画初始化
        $("#CheckboxPop").css("opacity", 0);//设置背景透明
        $("#CheckboxPop div").css("opacity", 0);//设置内容框透明

        //动画开始
        $("#CheckboxPop").animate({ opacity: 1 }, 0);
        var Top = $("#CheckboxPop div").css("margin-top").replace("px", "") - 7;//获取顶距
        $("#CheckboxPop div").animate({ opacity: 1, marginTop: Top }, "fast");
        //$("#Pop div").animate({margin-top:$("#Pop div").css("margin-top")-100},"slow");

        $("html,body").css("overflow", "hidden");//从CSS禁用滚动

        //把已经选项调整到选项的中央位置
        var LiTop = $("#CheckboxPop div ul li.active").offset().top - $("#CheckboxPop div").offset().top - 395;
        $("#CheckboxPop div").scrollTop(LiTop);
    })

    //点击选项--------------------------------------------------------------------------------------------
    $("body").on("click", "#CheckboxPop li", function () {
        if ($(this).text() == "不限") {
            //如果选择了“不限”则清空其它选项
            $(this).siblings().removeClass("active");
            $(this).addClass("active");
        }
        else {
            $(this).toggleClass("active");
            $("#CheckboxPop li:contains(不限)").removeClass("active");
        }
    })

    //点击确认按钮-----------------------------------------------------------------------------------------
    $("body").on("click", "#CheckboxPop button", function () {
        var Itmes = $("#CheckboxPop li.active");
        var Text = ",";
        for (i = 0; i < Itmes.length; i++) {
            Text += "," + Itmes.eq(i).text();
        }
        Text = Text.replace(",,", "");//去掉第一个字符
        if (Text == ",") Text = "不限";

        var ID = $(this).parent().attr("data-id");
        var ThisInput = $("#" + ID);
        ThisInput.val(Text);//选中赋值
        ThisInput.blur();//模拟输入完成

        CheckboxPop_Close();
    })

    function CheckboxPop_Close() {
        var Pop = $("#CheckboxPop");
        var PopDiv = $("#CheckboxPop div");
        Pop.animate({ opacity: 0 }, "fast");
        var Top = PopDiv.css("margin-top").replace("px", "") - (-7);//获取顶距
        PopDiv.animate({ opacity: 0, marginTop: Top }, "fast", function () { Pop.remove() });

        $("html,body").css("overflow", "");//从CSS禁用滚动(第2个参数必须为空，不然导致选择框定位无效)
    }

    //点击背景框也可以关闭对话框
    $("body").on("click", "#CheckboxPop", function (event) {
        if (event.target.id == "CheckboxPop") {
            var ID = $(this).find("div").attr("data-id");
            $("#" + ID).blur();//模拟输入完成
            CheckboxPop_Close();
        }
    });
});



//模拟区间选框功能/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function (e) {
    $("input.Range").attr("readonly", "readonly");//初始化，将模拟选择控件设置成只读，手机浏览器点击时才不会弹出输入法

    //点击Range选择框---------------------------------------------------------------------------------
    $("body").on("focus", ".Range", function () {
        $(this).blur();
        var ID = $(this).attr("ID");
        var Items = $(this).attr("data-option").split(",");

        //选项列表//////////////
        var Value = $(this).val();
        var Tips = Value == "" ? "提示：左边为开始值，右边为结束值" : Value;
        if (Value.indexOf("以下") >= 0) {
            Value.replace("以下", "");
            Value = "不限～" + Value;
        }
        if (Value.indexOf("以上") >= 0) {
            Value.replace("以上", "");
            Value = Value + "～不限";
        }
        if (Value == "不限") {
            Value += "不限～不限";
        }
        if (Value.indexOf("～") < 0) {
            Value += Value + "～" + Value;
        }

        var Text = Value.split("～");
        var ItemList1 = "";
        var ItemList2 = "";
        var BoxHeight = 0;
        for (i = 0; i < Items.length; i++) {
            if (Text[0].indexOf(Items[i]) >= 0) {
                ItemList1 += "<li class='active'>" + Items[i] + "</li>";
            }
            else {
                ItemList1 += "<li>" + Items[i] + "</li>";
            }

            if (i < 5) BoxHeight = (i + 1) * 130 + 220;
        }
        for (i = 0; i < Items.length; i++) {
            if (Text[1].indexOf(Items[i]) >= 0) {
                ItemList2 += "<li class='active'>" + Items[i] + "</li>";
            }
            else {
                ItemList2 += "<li>" + Items[i] + "</li>";
            }

            if (i < 5) BoxHeight = (i + 1) * 130 + 220;
        }
        var ButtonTop = ($(window).height() - BoxHeight) / 2.5 + BoxHeight - 130;

        //输出列表//////////////
        $("body").append("<div id='RangePop'><div style='height:" + BoxHeight + "px;' data-id='" + ID + "'><span>" + Tips + "</span><ul>" + ItemList1 + "</ul><ul>" + ItemList2 + "</ul><button style='top:" + ButtonTop + "px;'>确认</button></div></div>"); //创建POP对话框
        $("#RangePop div").css("margin-top", ($(window).height() - BoxHeight) / 2.5); //调整对话框高度

        //IE6的特殊礼遇
        if (navigator.userAgent.match("MSIE 6.0") != null) {
            $("#RangePop").css("height", $(document).height()); //背景框高度

            var Y = $(document).scrollTop() + ($(window).height() - BoxHeight) / 2.5;
            $("#RangePop div").css("margin-top", Y);
        }

        //动画初始化
        $("#RangePop").css("opacity", 0);//设置背景透明
        $("#RangePop div").css("opacity", 0);//设置内容框透明

        //动画开始
        $("#RangePop").animate({ opacity: 1 }, 0);
        var Top = $("#RangePop div").css("margin-top").replace("px", "") - 7;//获取顶距
        $("#RangePop div").animate({ opacity: 1, marginTop: Top }, "fast");
        //$("#Pop div").animate({margin-top:$("#Pop div").css("margin-top")-100},"slow");

        $("html,body").css("overflow", "hidden");//从CSS禁用滚动

        //把已经选项调整到选项的中央位置
        var LiTop1 = $("#RangePop div ul li.active").eq(0).offset().top - $("#RangePop div ul").offset().top - 262;
        $("#RangePop div ul").eq(0).scrollTop(LiTop1);

        var LiTop2 = $("#RangePop div ul li.active").eq(1).offset().top - $("#RangePop div ul").offset().top - 262;
        $("#RangePop div ul").eq(1).scrollTop(LiTop2);
    })

    //点击选项--------------------------------------------------------------------------------------------
    $("body").on("click", "#RangePop li", function () {
        $(this).siblings().removeClass("active");
        $(this).addClass("active");

        //判断选项输出值
        var Itmes = $("#RangePop li.active");
        var Val1 = Itmes.eq(0).text();
        var Val2 = Itmes.eq(1).text();
        if (Itmes.eq(0).index() > Itmes.eq(1).index() & Itmes.eq(1).index() > 0) {
            Val1 = Itmes.eq(1).text();
            Val2 = Itmes.eq(0).text();
        }
        var Index1 = Itmes.eq(0).index();
        var Index2 = Itmes.eq(1).index();
        var Text = Val1 + "～" + Val2;//正常状态
        if (Val1 == "不限") Text = Val2 + "以下";
        if (Val2 == "不限") Text = Val1 + "以上";
        if (Val2 == "") Text = Val1;//只有一个选值
        if (Val1 == Val2) Text = Val1
        if (Val1 == "") Text = "不限";
        $(this).parent().siblings("span").text(Text);//输出值

        /*
		$(this)
		if($(this).text()=="不限")
		{
			//如果选择了“不限”则清空其它选项
			$("#RangePop li").removeClass("active");
			$(this).addClass("active");
		}
		else
		{
			$(this).toggleClass("active");
			$("#RangePop li:contains(不限)").removeClass("active");
		}
		*/
    })

    //点击确认按钮-----------------------------------------------------------------------------------------
    $("body").on("click", "#RangePop button", function () {
        var Text = $(this).siblings("span").text()//获取选值
        if (Text == "提示：左边为开始值，右边为结束值") Text = "不限";
        var ID = $(this).parent().attr("data-id");
        var ThisInput = $("#" + ID);
        ThisInput.val(Text);//选中赋值
        ThisInput.blur();//模拟输入完成

        RangePop_Close();
    })

    function RangePop_Close() {
        var Pop = $("#RangePop");
        var PopDiv = $("#RangePop div");
        Pop.animate({ opacity: 0 }, "fast");
        var Top = PopDiv.css("margin-top").replace("px", "") - (-7);//获取顶距
        PopDiv.animate({ opacity: 0, marginTop: Top }, "fast", function () { Pop.remove() });

        $("html,body").css("overflow", "");//从CSS禁用滚动(第2个参数必须为空，不然导致选择框定位无效)
    }

    //点击背景框也可以关闭对话框
    $("body").on("click", "#RangePop", function (event) {
        if (event.target.id == "RangePop") {
            var ID = $(this).find("div").attr("data-id");
            $("#" + ID).blur();//模拟输入完成
            RangePop_Close();
        }
    });
});



//禁用滚动条（参数：true/false）/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Scroll(Switch) {
    //禁用
    window.addEventListener('mousewheel', scrollFunc, false);
    window.addEventListener('DOMMouseScroll', scrollFunc, false);//兼容firefox
    window.addEventListener('touchmove', scrollFunc, false);//手机
    $("html,body").css("overflow", "hidden");//从CSS禁用滚动

    //启用
    if (Switch) {
        window.removeEventListener('mousewheel', scrollFunc, false);
        window.removeEventListener('DOMMouseScroll', scrollFunc, false);//兼容firefox
        window.removeEventListener('touchmove', scrollFunc, false);//手机
        $("html,body").css("overflow", "auto");//从CSS禁用滚动
    }
}
var scrollFunc = function (e) {
    e = e || window.event;
    if (e && e.preventDefault) {
        e.preventDefault();
        e.stopPropagation();
    }
    else {
        e.returnvalue = false;
        return false;
    }
}

//页面中弹窗对话窗口/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//弹出打开===========================================================================================================================
function Pop_Open(Width, Height, Url) {
    //格式化宽度和高度（仅数值）
    var X = top.innerWidth;//浏览器宽度(数值)
    var Y = top.innerHeight;//浏览器高度(数值)
    //var X=$(window).width();//浏览器宽度(数值)
    //var Y=$(window).height();//浏览器高度(数值)
    Width += "";//将数值转换成字符串（否则不能用数值）
    Height += "";
    var Width = Width.replace("px", "");//去除px字符
    var Height = Height.replace("px", "");
    if (Width.indexOf("%") >= 0) Width = X * Width.replace("%", "") / 100;///如果包含%，则计算出具体数值
    if (Height.indexOf("%") >= 0) Height = Y * Height.replace("%", "") / 100;

    var iFrameStr = "<iframe src='" + Url + "' width='100%' height='100%' frameborder='0' allowtransparency='true'></iframe>"; //创建iframe代码
    top.$("body").append("<div id='Pop'><div style='width:" + Width + "px; height:" + Height + "px;'><a onClick='javascript:Pop_Close();' id='PopClose'></a>" + iFrameStr + "</div></div>"); //创建POP对话框
    top.$("#Pop div").css("margin-top", (Y - Height) / 2); //调整对话框高度

    //动画初始化
    top.$("#Pop").css("opacity", 0);//设置背景透明
    top.$("#Pop div").css("opacity", 0);//设置内容框透明

    //动画开始
    top.$("#Pop").animate({ opacity: 1 }, 0);
    var Top = top.$("#Pop div").css("margin-top").replace("px", "") - 20;//获取顶距
    top.$("#Pop div").animate({ opacity: 1, marginTop: Top }, "slow");
    //$("#Pop div").animate({margin-top:$("#Pop div").css("margin-top")-100},"slow");


    //点击背景框也可以关闭对话框
    top.$("#Pop").on("click", function (event) {
        if (event.target.id == "Pop") {
            Pop_Close();
        }
    });

    //禁止主页面滚动
    //Scroll(false);
    top.$("html,body").css("overflow", "hidden");//从CSS禁用滚动
}

//关闭对话框==========================================================================================================================
function Pop_Close() {
    var Pop = top.$("#Pop");
    var PopDiv = top.$("#Pop div");
    Pop.animate({ opacity: 0 }, "fast");
    var Top = PopDiv.css("margin-top").replace("px", "") - (-20);//获取顶距
    PopDiv.animate({ opacity: 0, marginTop: Top }, "fast", function () { Pop.remove() });

    //开启主页面滚动
    //Scroll(true);
    $("html,body").css("overflow", "");//解除从CSS禁用滚动(第2个参数必须为空，不然导致选择框定位无效)
}

//关闭对话框&并重新加载主页面==========================================================================================================
function Pop_CloseLoad() {
    var Pop = top.$("#Pop");
    var PopDiv = top.$("#Pop div");
    Pop.animate({ opacity: 0 }, "fast");
    var Top = PopDiv.css("margin-top").replace("px", "") - (-20);//获取顶距
    //PopDiv.animate({opacity:0,marginTop:Top},"fast",function(){parent.location.reload();});//这样写刷新的是postback，比如上传以后刷新的话就不停提交
    var url = parent.window.location.href;
    PopDiv.animate({ opacity: 0, marginTop: Top }, "fast", function () { parent.window.location.href = url; });//这样刷新的是重新打开网页，不会重新Post
}

//切换页面===========================================================================================================================
function Pop_Reset(Width, Height, Url) {
    var PopDiv = top.$("#Pop div");
    var PopDivIframe = top.$("#Pop div iframe");
    PopDivIframe.attr("src", Url);

    var Y = (PopDiv.height() - Height) / 2;//新的高度差
    var Top = PopDiv.css("margin-top").replace("px", "");//当前的顶部距离
    var NewTop = Top - (-Y);//新的顶部距离
    PopDiv.animate({ width: Width, height: Height, marginTop: NewTop }, "fast");
}



//页面滑窗对话框/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//弹出滑窗===========================================================================================================================
function SlidWin_Open(Size, Url) {
    //格式化宽度和高度（仅数值）
    var Y = top.innerHeight;//浏览器高度(数值)
    Size += "";//将数值转换成字符串（否则不能用数值）
    var Size = Size.replace("px", "");//去除px字符
    if (Size.indexOf("%") >= 0) Size = Y * Size.replace("%", "") / 100;///如果包含%，则计算出具体数值

    //创建滑窗元素
    var iFrameStr = "<iframe src='" + Url + "' width='100%' height='100%' frameborder='0' allowtransparency='true'></iframe>"; //创建iframe代码
    top.$("body").append("<div id='SlidWin'><div style='height:" + Size + "px;'><img src='base/img/pop_close.png' class='Close' onClick='javascript:SlidWin_Close();'>" + iFrameStr + "</div></div>"); //创建POP对话框

    //显示动画
    top.$("#SlidWin").addClass("Show");



    //点击背景框也可以关闭对话框
    top.$("#SlidWin").on("click", function (event) {
        if (event.target.id == "SlidWin") {
            SlidWin_Close();
        }
    });

    //禁止主页面滚动
    //Scroll(false);
    top.$("html,body").css("overflow", "hidden");//从CSS禁用滚动
}

//关闭滑窗==========================================================================================================================
function SlidWin_Close() {
    var SlidWin = parent.$("#SlidWin");
    SlidWin.removeClass("Show");
    SlidWin.addClass("Hide");
    setTimeout(function () {
        SlidWin.remove();
    }, 500)

    //开启主页面滚动
    //Scroll(true);
    top.$("html,body").css("overflow", "");//解除从CSS禁用滚动(第2个参数必须为空，不然导致选择框定位无效)
}

//关闭滑窗&并重新加载主页面==========================================================================================================
function SlidWin_CloseLoad() {
    SlidWin_Close();
    parent.window.location.href = parent.window.location.href;//这样刷新的是重新打开网页，不会重新Post
}

//切换页面===========================================================================================================================
function SlidWin_Reset(Size, Url) {
    //格式化宽度和高度（仅数值）
    var Y = top.innerHeight;//浏览器高度(数值)
    Size += "";//将数值转换成字符串（否则不能用数值）
    var Size = Size.replace("px", "");//去除px字符
    if (Size.indexOf("%") >= 0) Size = Y * Size.replace("%", "") / 100;///如果包含%，则计算出具体数值
    top.$("#SlidWin div iframe").attr("src", Url);//改变URL
    top.$("#SlidWin div").animate({ height: Size }, "fast");//改变大小
}



//弹出小消息提示////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Message(Msg) {
    parent.$("body").append("<div class='Message'><span>" + Msg + "</span></div>");
    var MsgBox = parent.$(".Message span");
    var MsgLayout = parent.$(".Message");
    MsgBox.css("opacity", "0");
    MsgBox.animate({ top: '-10', opacity: '1' }, "slow");
    MsgBox.animate({ opacity: '1' }, 1000);//显示延迟时间
    MsgBox.animate({ top: '-20', opacity: '0' }, "slow", function () {
        MsgLayout.remove();
    });
}



/*
//AJAX删除数据库/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function (e) {

    //删除（3级）==========================================================================================================
    $(".Del").on("click", function () {
        var This = $(this);
        var ThisTable = This.attr("data-tb");
        var ThisID = This.attr("data-id");
        if (confirm("确认删除？")) {
            $.get("delete.aspx", { tab: ThisTable, id: ThisID }, function (result) {
                alert(result);//输出执行结果
                if (result == "已经删除！") This.parent().parent().remove();//如果删除成功则删除
            });
        }
    });

    //删除（2级）==========================================================================================================
    $(".Del2").on("click", function () {
        var This = $(this);
        var ThisTable = This.attr("data-tb");
        var ThisID = This.attr("data-id");
        if (confirm("确认删除？")) {
            $.get("delete.aspx", { tab: ThisTable, id: ThisID }, function (result) {
                alert(result);//输出执行结果
                if (result == "已经删除！") This.parent().remove();//如果删除成功则删除
            });
        }
    });
});
*/