function fileOpen() {
	uexFileMgr.multiExplorer("/sdcard");
}

function musicUpdate(data) {
	var url = 'http://192.168.155.1:8080/Match/babyBuddy/public/api/music';
	var token = appcan.locStorage.getVal('token');
	$.ajax({
		url: url,
		type: 'POST',
		data: data,
		headers: {
			'Authorization': 'Bearer ' + token
		},
		success: function(d) {
			alert(d.message);
		},
		error: function(e) {
			alert("上传错误");
			console.log(e);
		}
	});
}


function musicDelete(b) {
	var id = $(b).attr('name');
	var url = 'http://192.168.155.1:8080/Match/babyBuddy/public/api/music/delete/' + id;
	var token = appcan.locStorage.getVal('token');
	$.ajax({
		url: url + 'user',
		type: 'POST',
		headers: {
			'Authorization': 'Bearer ' + token
		},
		success: function(d) {
			alert(d.message);
			musicList();
		},
		error: function(e) {
			alert(e);
			console.log(e);
		}
	});
}

function musicList() {
	$('#musicList').text('');
	var url = 'http://192.168.155.1:8080/Match/babyBuddy/public/api/music';
	var token = appcan.locStorage.getVal('token');
	$.ajax({
		url: url,
		type: 'get',
		headers: {
			'Authorization': ' Bearer ' + token
		},
		success: function(d) {
			for (var key in d.data) {
				$str = '<div class="tile"><div class="tile-action tile-action-show"><ul class="margin-no nav nav-list pull-right"><li><a class="text-black-sec waves-attach waves-effect"><img name="' + d.data[key].id + '"path="' + d.data[key].path + '"onclick="musicPlay(1,this);"class="icon"src="img/iconfont-bofang.png "></a></li><li><a class="text-black-sec waves-attach waves-effect"><img name="' + d.data[key].id + '"path="' + d.data[key].path + '"onclick="musicDelete(this);"class="icon"src="img/iconfont-iconfontshanchu.png"></a></li></ul></div><div class="tile-inner"><span class="text-overflow">' + d.data[key].fileName + '</span></div></div>';
				$('#musicList').append($str);
			}
		},
		error: function(e) {
			alert("错误！");
			console.log(e);
		}
	});
}
/**
 * 
 * @param {Object} a 1：播放，2暂停，3停止
 */
function musicPlay(a, b) {
	var src = $(b).attr('path');
	uexAudio.open(src);
	uexAudio.play(0);
}

function fileCb(opId, dataType, data) {
	var error = 0;
	var success = 0;
	var fileData = {};
	var jsonList = eval("(" + data + ")");
	if (jsonList.length == 0) {
		alert("无数据");
	}
	for (var key in jsonList) {
		var str = jsonList[key];

		var a = str.split('/');
		alert(123);
		var fileName = a[a.length - 1];
		alert(fileName);
		var patt = new RegExp(".mp3", "i");
		var result;
		if (!patt.exec(fileName)) {
			error += 1;
			continue;
		}
		fileData.path = str;
		fileData.fileName = fileName;
		fileData.type = 1;

		musicUpdate(fileData);
		success += 1;
	}
	var text = '您成功导入：' + success + '首音乐,失败' + error + '首。十分抱歉我们当前仅支持mp3格式，感谢您的支持！';
	alert(text);
}