window.onload = adminOnload

function adminOnload() {
    document.getElementById('logout').onclick = function () {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                try {
                    var ret = xhr.responseText;
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

    document.getElementById('chagepassword').onclick = changePassword;
    document.getElementById("help").onclick = adminHelp;
    document.getElementById("usermgmt").onclick = userMgmt;

    var currUrl = window.location.toString();
    var index = currUrl.indexOf("#", 0);
    var action = currUrl.substring(index, currUrl.length);
    if (action == "#changepwd") {
        changePassword();
    } else if (action == "#help") {
        adminHelp();
    } else if (action == "#user") {
        userMgmt();
    } else {

    }
}

function userMgmt() {
    $.ajax({
        async: false,
        url: "static/html/usermgmt.html",
        dataType: "text",
        success: function (result) {
            document.getElementById("mainsession").innerHTML = result;
        }
    });
}

function changePassword() {
    $.ajax({
            async: false,
            url: "static/html/changepwd.html",
            dataType: "text",
            success: function (result) {
                document.getElementById("mainsession").innerHTML = result;

                $("#submit_chang_pwd").click(function () {
                        var old_pwd = document.getElementsByClassName("input_change_pwd")[0].value;
                        var new_pwd = document.getElementsByClassName("input_change_pwd")[1].value;
                        var confirm_pwd = document.getElementsByClassName("input_change_pwd")[2].value;
                        if (old_pwd.length > 0 && new_pwd.length > 0 && confirm_pwd.length > 0) {
                            if (new_pwd != confirm_pwd) {
                                alert("新密码不一致，请重新输入！");
                            } else {

                                var reg = /^[0-9a-zA-Z]+$/;
                                if (new_pwd.length < 6 || confirm_pwd.length < 6 || !reg.test(new_pwd) || !reg.test(confirm_pwd)) {
                                    alert("密码不少于6位,由字母、数字组成！");
                                } else {
                                    jsondata = new Object();
                                    jsondata.new = new_pwd;
                                    jsondata.confirm = confirm_pwd;
                                    jsondata.old = old_pwd;
                                    $.ajax({
                                        url: "/changepwd",
                                        type: "POST",
//                                            data: $('#form_change_pwd').serialize(),
                                        data: JSON.stringify(jsondata),
                                        dataType: "json",
                                        beforeSend: function (request) {
                                            request.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
                                        },
                                        success: function (result) {
                                            if (result.status == 0) {
                                                alert("密码修改成功！")
                                            } else {
                                                alert("密码修改失败！")
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    }
                )
            }
        }
    );
}

function adminHelp() {
    $.ajax({
        async: false,
        url: "static/html/adminhelp.html",
        dataType: "text",
        success: function (result) {
            document.getElementById("mainsession").innerHTML = result;
        }
    });
}
