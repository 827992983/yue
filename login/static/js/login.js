/**
 * Created by lijian on 16/3/24.
 */

window.onload = login_onload;

function login_onload() {
    document.getElementById('btn_login').onclick = login;
}

function login() {
    var data = new Object();
    data.username = document.getElementById('username').value;
    data.password = document.getElementById('password').value;
    if (document.getElementById('identify').checked) {
        data.identify = 'admin';
    } else {
        data.identify = 'user';
    }

    document.getElementById('logininfo').textContent = "";

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            try {
                var ret = xhr.responseText;
                var data = eval("(" + ret + ")");
                if (data.status == 0) {
                    if (data.data.to == 'admin') {
                         window.location = 'admin';
                    } else if (data.data.to == 'guest') {
                          window.location = 'guest';
                    } else {
                        alert('登陆异常！');vm
                    }
                } else if (data.status == 1001) {
                    //用户名或密码错误提示
                    document.getElementById('logininfo').textContent = '用户或密码错误';
                } else {
                    //未知错误
                    alert("未知错误！");
                }
            } catch (e) {
                alert("登陆错误，未知异常！");
            }
        }
    }
    xhr.open('POST', '/login');
    xhr.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
    xhr.send(JSON.stringify(data));
}

//function getCookie(name) {
//    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
//    if (arr = document.cookie.match(reg))
//        return unescape(arr[2]);
//    else
//        return null;
//}

function setCookie(c_name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) +
        ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}