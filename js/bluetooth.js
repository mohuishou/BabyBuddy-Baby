/**
 * 
 */
var healthData = {};

/**
 * 
 */
function init() {
	//检测蓝牙是否可用
	uexBluetoothSerial.isEnabled();
}

/**
 * 
 */
function listBlue() {
	//检测蓝牙是否可用
	uexBluetoothSerial.isEnabled();
	//			uexBluetoothSerial.listDevices();
}

/**
 * 
 * @param {Object} address
 */
function connect(address) {
	uexBluetoothSerial.connect(address);
	$("#deviceList").modal('hide');
}

/**
 * 
 * @param {Object} address
 */
function disConnect(address) {
	uexBluetoothSerial.disconnect();
}

/**
 * 
 */
function readData() {
	setInterval(function() {
		uexBluetoothSerial.readBytes(7, 2000, "false");
	}, 2000);
}

/**
 * 
 * @param {Object} a
 */
function writeData(a) {
	uexBluetoothSerial.writeString(a);
}

/**
 * 
 * @param {Object} data
 */
function dataHandle(data) {
	if (1000000 < data && data < 9999999) {
		var d = data.split('');
		//温度
		if (d[0] == 1) {
			healthData.temp = d[1] + d[2];
		} else if (d[0] == 2) {
			healthData.temp = '-' + d[1] + d[2];
		}
		//声音
		if (d[3] > 0 && d[3] < 6) {
			healthData.sound = d[3];
		} else {
			return;
		}
		//光强
		if (d[4] > 0 && d[4] < 6) {
			healthData.light = d[4];
		} else {
			return;
		}
		//睡眠
		if (d[5] > 0 && d[5] < 3) {
			healthData.sleep = d[5];
		} else {
			return;
		}
		//异物闯入
		if (d[6] > 0 && d[6] < 3) {
			healthData.danger = d[6];
		} else {
			return;
		}
		//		healthData.uid = appcan.locStorage.getVal('uid');
		//		alert(healthData);
		postData(healthData);
		console.log(healthData);
	}
}

/**
 * 
 */
function postData(data) {
	//	alert(data.temp);
	//	for (var key in data) {
	//		alert(data[key]);
	//	}
	var url = 'http://192.168.155.1:8080/Match/babyBuddy/public/api/health';
	var token = appcan.locStorage.getVal('token');
	$.ajax({
		type: "POST",
		url: url,
		data: data,
		dataType: 'json',
		headers: {
			'Authorization': ' Bearer ' + token
		},
		success: function(d) {
			statusCheck(d.data.status);
		},
		error: function(e) {
			alert(e);
		}

	});
	//	alert(123);
}
function getMusicPath() {
	var url = 'http://192.168.155.1:8080/Match/babyBuddy/public/api/music/play';
	var token = appcan.locStorage.getVal('token');
	$.ajax({
		type: "get",
		url: url,
		async:false,
		dataType: 'json',
		headers: {
			'Authorization': ' Bearer ' + token
		},
		success: function(d) {
			if (d.code == 200) {
				if (d.data.fileName != undefined) {
					alert('你的家长正在为你播放' + d.data.fileName);
					$('#mainFrame').attr('path', d.data.path);
				}
			} else {
				alert('播放列表获取错误！');
			}
		},
		error: function(e) {
			alert(e);
		}

	});
}
function statusCheck(status) {
	alert(status);

	switch (status) {
		case '1':
			break;
		case '2':
			//设置被修改
			break;
		case '3':
			getMusicPath();
			var src=$('#mainFrame').attr('path');
			alert(src);
			uexAudio.open(src);
			uexAudio.play(0);
			break;
		case '4':
			uexAudio.pause();
			break;
		case '5':
			uexAudio.stop();
			break;
	}
}


/**
 * 
 */
function callback() {
	//蓝牙是否可用回调
	uexBluetoothSerial.onIsEnabledCallback = function(opId, dataType, data) {
		if (data == 'false') {
			mAlert('蓝牙没有打开，请打开蓝牙开关');
		} else {
			uexWindow.toast(1, 5, '蓝牙已打开，开始扫描', 2000);
			uexBluetoothSerial.listDevices();
		}
	};
	//列出设备列表
	uexBluetoothSerial.onlistDevicesCallback = function(opId, dataType, data) {
		devices = JSON.parse(data);
		$.each(devices, function(k, v) {
			var str = '<ul class=" nav nav-list tile tile-brand"><li><a style="width:100%;" class="waves-attach waves-button waves-effect" onclick="connect(\'' + v.address + '\');">' + v.name + '(' + v.address + ')</a></li></ul>';
			$('#deviceList .modal-inner').html(str);
		});
		$("#deviceList").modal('show');
	};
	uexBluetoothSerial.onConnectCallback = function(opId, dataType, data) {
		//				callbacklog(opId, dataType, data, "onConnectCallback");
	};
	//读取蓝牙发送的数据
	uexBluetoothSerial.onReadCallback = function(opId, dataType, data) {
		//				callbacklog(opId, dataType, data, "onReadCallback");
		data = JSON.parse(data);
		if (data.state == "ok" && data.type == 'hex') {
			var a = '';
			$.each(data.data, function(k, v) {
				var num = String.fromCharCode(v)
				if (num > 0 && num <= 9) {
					a = a + num;
				}
			});
			if (a == 9999999) {
				writeData('f');
			} else {
				dataHandle(a);
			}
			//			$('#test').append(a + '<br>');
		}
	};
	uexBluetoothSerial.onDisConnectCallback = function(opId, dataType, data) {
		//		callbacklog(opId, dataType, data, "onDisConnectCallback");
	};
	//数据发送成功回调
	uexBluetoothSerial.onDataSendEvent = function(opId, dataType, data) {
		//				callbacklog(opId, dataType, data, "onDataSendEvent");

	};
	uexBluetoothSerial.onWriteCallback = function(opId, dataType, data) {
		//				callbacklog(opId, dataType, data, "onWriteCallback");
	};
	//连接成功回调
	uexBluetoothSerial.onConnectionSuccessEvent = function(opId, dataType, data) {

		btnSwitch('#disconnect');
		toast('连接成功');
		if (data) {
			readData();
		}
	};
	uexBluetoothSerial.onConnectionLostEvent = function(opId, dataType, data) {
		btnSwitch('#scanData');
		toast('连接已断开');
		//		btnSwitch('#scanData');
		//		callbacklog(opId, dataType, data, "onConnectionLostEvent");
	};
}

function btnSwitch(id) {
	var a = ['#disconnect', '#scanData', '#acceptCall'];
	for (var i = 0; i < a.length; i++) {
		if (id == a[i]) {
			//			alert(id);
			$(a[i]).css('display', 'block');
		} else {
			$(a[i]).css('display', 'none');
		}
	}
}
/**
 * 
 * @param {Object} info
 * @param {Object} t
 */
function toast(info, t) {
	t = arguments[1] ? arguments[1] : 4000;
	$('body').snackbar({
		content: info,
		alive: t,
	});
}

/**
 * @description 弹窗，代替原生弹窗样式 
 * @param {String} info 弹窗展示信息
 */
function mAlert(info, fun) {
	if ($('.alert'))
		$('.alert').remove();
	var str = '<div aria-hidden="true" class="modal fade alert" id="" role="dialog" tabindex="-1"><div class="modal-dialog modal-xs"><div class="modal-content"style="text-align: center;"><div style="margin:15px 0;" class="modal-heading"><h3 class="modal-title" style="font-size:18px;text-align:center;margin:0 0 5px 0;">提示</h3></div><hr style="margin:0 0 5px 0;"><div class="modal-inner">' + info + ' </div><a style="font-size:17px;text-align:center;" class="btn btn-flat btn-brand waves-attach waves-button waves-effect" onclick="' + fun + '();" data-dismiss="modal">确认</a></div></div>';
	//	alert(str);
	$('body').append(str);
	$('.alert').modal('show');
}

/**
 * @param {Object} opId
 * @param {Object} dataType
 * @param {Object} data
 * @param {Object} callfuncname
 */
function callbacklog(opId, dataType, data, callfuncname) {
	var tmp = callfuncname + "\r\n";
	tmp += "opId:" + opId + "\r\n";
	tmp += "dataType:" + dataType + "\r\n";
	tmp += "data:" + data + "\r\n";
	alert(tmp);
}