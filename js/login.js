var url = 'http://192.168.155.1:8080/Match/babyBuddy/public/api/';

function reg() {
	var data = {};
	data.email = $('#regForm #email').val();
	data.password = $('#regForm #password').val();
	logBase(data, url + 'auth/signup');
}

function login() {
	var data = {};
	data.email = $('#loginForm #email').val();
	data.password = $('#loginForm #password').val();
	logBase(data, url + 'auth/login');
}
//test(123);

//function user(token) {
//	//	token={'token':token}
//	$.ajax({
//		url: url + 'user',
//		type: 'GET',
//		headers: {
//			'Authorization': ' Bearer ' + token
//		},
//		success: function(d) {
//			appcan.locStorage.setVal('uid', d.data.id);
////			alert(d.data.id);
//			//			appcan.locStorage.setVal(d.data);
//		},
//		error: function(e) {
//			alert(e);
//			console.log(e);
//		}
//	});
//}

function logBase(data, url) {

	console.log(data);
	$.ajax({
		data: data,
		dataType: 'json',
		type: "POST",
		url: url,
		success: function(d) {

			appcan.locStorage.setVal('token', d.token);
			alert('登陆成功');
			jumpBack();
		},
		error: function(e) {
			alert('参数错误！');
			console.log(e);
		}
	});
}

function jumpBack() {
	appcan.window.open({
		name: 'main',
		dataType: 0,
		data: 'index.html'
	});
}
