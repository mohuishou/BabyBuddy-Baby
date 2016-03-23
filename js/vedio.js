    /**
     * 视频功能实现
     * 使用天翼rtc插件实现
     */

    /**
     * 初始化
     * 定义天翼rtc回调函数
     * 同一个页面中  appcan.ready可以存在多个，不会冲突;而uexOnload不行...
     */
    function rtcInit() {
    	uexESurfingRtc.onGlobalStatus = upgateGlobalStatus; //全局监控
    	uexESurfingRtc.cbLogStatus = upgateLogStatus; //登陆回调
    	uexESurfingRtc.cbCallStatus = updateCallStatus; //呼叫回调
    	//uexESurfingRtc.cbRemotePicPath = showRemotePicPath;//截屏回调

    	/*----------配置天翼rtc插件的appkey & appid---------*/
    	appId = '70392';
    	appKey = '595acd54-d25a-40ea-8f2c-88849896cfcc';
    	uexESurfingRtc.setAppKeyAndAppId(appKey, appId);
    	login();
    };

    /**
     * 登陆回调，返回是否登陆成功
     */
    function upgateLogStatus(opCode, dataType, data) {

    	alert(data);
    	if ("OK" == data.substring(0, 2)) {
    		var status = data.split("OK:")[1];
    		var showStr = "";
    		if ("LOGIN" == status) {
    			showStr = "登陆成功，点击退出";
    			$("#login").attr('name', 'logout');
    		} else if ("LOGOUT" == status) {
    			showStr = "登陆";
    			$("#login").attr('name', 'login');
    		}
    		$("#login").text(showStr);
    	} else {
    		alert(data);
    	}
    }

    function updateCallStatus(opCode, dataType, data) {
    	alert(data);
    	if ("OK" == data.substring(0, 2)) {
    		var status = data.split("OK:")[1];
    		var showStr = "";
    		var str = '';
    		if ("NORMAL" == status) {
    			$('#footer').removeClass('uhide');
    		} else if ("INCOMING" == status) {
    			appcan.window.alert({
    				title: '提示',
    				content: '监护人通话请求',
    				buttons: ['接听', '挂断'],
    				callback: function(err, data, dataType, optId) {
    					if (data == 0) {
    						accept();

    					} else {
    						hangUp();
    					}
    				}
    			});
    		}

    	} else {
    		alert(data);
    	}
    }

    /**
     *监控中心回调 
     */
    function upgateGlobalStatus(opCode, dataType, data) {
    	console.log(data);
    	// alert(data);
    }

    /**
     * 登陆方法的实现
     * 问题，安卓5.1和4.0的分辨模式好像不一样，可能需要做两套设置
     */
    function login() {
    	//屏幕的缩放比例
    	var bs = screen.availWidth / $('body').width();
    	var header = $('header').height();
    	var main = $('body').height() - $('#footer').height();
    	//  	var footer=$('#footer').height()*bs;
    	//  	alert(screen.availHeight);
    	var empty = Math.floor(main * bs);

    	var width = screen.availWidth;
    	jsonViewConfig = {
    			"localView": {
    				"x": "0",
    				"y": '0',
    				"w": Math.floor((1 / 3) * width).toString(),
    				"h": Math.floor((4 / 9) * width).toString()
    			},
    			"remoteView": {
    				"x": "0",
    				"y": '0',
    				"w": width.toString(),
    				"h": empty.toString()
    			}
    		}
    		/*---这里默认设置一个用户名用于调试，后期用户登录之后直接自动生成---*/
    	userName = "1234";
    	/*--uexESurfingRtc.login函数需要传入的参数是一个json字符串，所以需要调用JSON.stringify方法将json对象转换为字符串--*/
    	jsonDtr = JSON.stringify(jsonViewConfig);
    	console.log(jsonDtr);
    	uexESurfingRtc.login(jsonDtr, userName);
    }

    /**
     * 退出登录
     * @return {[type]} [description]
     */
    function logout() {
    	uexESurfingRtc.logout();
    }

    function call() {
    	uexESurfingRtc.call(2, "4892");
    }

    function accept() {
    	uexESurfingRtc.acceptCall(2);
    	var str = '<div id="vedio" class="ub  c-gra uba b-bla umh4"><div class="btn ub ub-f1 ub-ac bc-text-head ub-pc bc-btn" onclick="hangUp();">挂断 </div></div>';
    	$('#content').html(str);
    	$('#footer').addClass('uhide');
    }

    //挂断接口
    function hangUp() {
    	uexESurfingRtc.hangUp();
    	$('#footer').removeClass('uhide');
    }
    
//	function mute(value){
//		uexESurfingRtc.mute(value)
//	}
