window.onload = adminOnload

function adminOnload() {
    document.getElementById('logout').onclick = function () {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                try {
                    var ret = xhr.responseText;
                    alert(xhr.responseText);
                    var data = eval("(" + ret + ")");
                    if (data.status == 0) {
                        window.location = '/';
                    } else {
                        alert('未知异常，请重新登陆！')
                        window.location = '/';
                    }
                } catch (e) {
                    alert("登陆错误，未知异常！");
                }
            }
        }
        xhr.open('GET', '/logout');
        xhr.send();
    }

    document.getElementById('chagepassword').onclick = function(){
    }
}