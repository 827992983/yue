window.onload = adminOnload

function adminOnload() {
    layout()
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
    document.getElementById("contact").onclick = contact;
    document.getElementById("usermgmt").onclick = userMgmt;

    var currUrl = window.location.toString();
    var index = currUrl.indexOf("#", 0);
    var action = currUrl.substring(index, currUrl.length);
    if (action == "#changepwd") {
        changePassword();
    } else if (action == "#contact") {
        contact();
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

    $.ajax({
        async: false,
        url: "/users",
        dataType: "json",
        success: function (result) {
            document.getElementById("table_user");
            if (result.status == 0) {
                var table = document.getElementById("table_user");
                var i = 0;
                var data = result.data;
                for (i = 0; i < data.length; i++) {
                    var tr = document.createElement("tr");
                    table.appendChild(tr)
                    var td = document.createElement('td');
                    td.setAttribute("class", "td_user_title");
                    tr.appendChild(td);
                    var chkbox = document.createElement("input");
                    chkbox.setAttribute("type", "checkbox");
                    chkbox.setAttribute("name", "select_user");
                    td.appendChild(chkbox);
                    var span = document.createElement("span");
                    span.innerHTML = "&nbsp;&nbsp;&nbsp;" + i.toString()
                    td.appendChild(span)

                    var td = document.createElement('td');
                    td.setAttribute("class", "td_user_title");
                    td.innerHTML = data[i].name;
                    tr.appendChild(td);

                    var td = document.createElement('td');
                    td.setAttribute("class", "td_user_title");
                    td.innerHTML = data[i].identify;
                    tr.appendChild(td);

                    var td = document.createElement('td');
                    td.setAttribute("class", "td_user_title");
                    td.innerHTML = data[i].email;
                    tr.appendChild(td);

                    var td = document.createElement('td');
                    td.setAttribute("class", "td_user_title");
                    td.innerHTML = data[i].phone;
                    tr.appendChild(td);

                    var td = document.createElement('td');
                    td.setAttribute("class", "td_user_title");
                    td.innerHTML = data[i].department;
                    tr.appendChild(td);
                }
            } else {
                alert("获取用户信息失败！")
            }
        }
    });
    document.getElementById("createuser").onclick = createUser;
}


function createUser() {
    $.ajax({
        async: false,
        url: "static/html/createuser.html",
        dataType: "text",
        success: function (result) {
            var node = document.getElementById("mainsession");
            var div = document.createElement("div");
            div.innerHTML = result;
            node.appendChild(div);
            $('.theme-popover-mask').fadeIn(100);
            $('.theme-popover').slideDown(200);
            $('.theme-poptit .close').click(function () {
                $('.theme-popover-mask').fadeOut(100);
                $('.theme-popover').slideUp(200);
            })
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

function contact() {
    $.ajax({
        async: false,
        url: "static/html/contact.html",
        dataType: "text",
        success: function (result) {
            document.getElementById("mainsession").innerHTML = result;
        }
    });
}

function layout() {

}
