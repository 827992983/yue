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
    document.getElementById("configure").onclick = configure;

    var currUrl = window.location.toString();
    var index = currUrl.indexOf("#", 0);
    var action = currUrl.substring(index, currUrl.length);
    if (action == "#changepwd") {
        changePassword();
    } else if (action == "#contact") {
        contact();
    } else if (action == "#user") {
        userMgmt();
    } else if (action == "#configure") {
        configure();
    }else if(action == "#checkenv"){
        checkEnv();
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
                    tr.setAttribute("name", "tr_user");
                    table.appendChild(tr)

                    var td = document.createElement('td');
                    td.setAttribute("name", "td_number");
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
                    td.setAttribute("name", "td_username");
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
    document.getElementById("deleteuser").onclick = deleteUser;
    document.getElementById("edituser").onclick = editUser;
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

    $("#btn_create_user").click(function () {
            var jsondata = new Object();
            jsondata.name = document.getElementsByName("name")[0].value;
            jsondata.password = document.getElementsByName("password")[0].value;
            jsondata.identify = "user"; //maybe need to change
            jsondata.confirm = document.getElementsByName("confirm")[0].value;
            jsondata.email = document.getElementsByName("email")[0].value;
            jsondata.phone = document.getElementsByName("phone")[0].value;
            jsondata.department = document.getElementsByName("department")[0].value;
            if (jsondata.name.length < 1) {
                alert("用户名不能为空!");
                return;
            }

            if (jsondata.password.length < 6 || jsondata.confirm.length < 6) {
                alert("密码必须大于等于6位!");
                return;
            }

            if (jsondata.password != jsondata.confirm) {
                alert("密码不一致！");
                return;
            }

            if (jsondata.email.length > 0 && !emailCheck(jsondata.email)) {
                alert("邮箱格式不正确！");
                return;
            }

            if (jsondata.phone.length > 0 && !checkPhone(jsondata.phone)
                ) {
                alert("手机号码格式不正确！");
                return;
            }

            $.ajax({
                async: false,
                url: "/user/create",
                method: "POST",
                data: JSON.stringify(jsondata),
                dataType: "json",
                success: function (result) {
                    if (result.status == 0) {
                        //alert("用户创建成功！");
                        $('.theme-popover-mask').fadeOut(100);
                        $('.theme-popover').slideUp(200);
                        window.location.reload();
                    } else {
                        alert("用户创建失败");
                    }
                },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
                }
            });
        }
    );
}

function getSelectedUser() {
    var list = document.getElementsByName("tr_user");
    var i = 0;
    var ret = new Array();
    for (i = 0; i < list.length; i++) {
        if (list[i].firstChild.firstChild.checked) {
            //if user is selected, get username
            var username = list[i].childNodes[1].innerHTML;
            ret.push(username);
        }
    }

    return ret;
}

function deleteUser() {
    var ret = getSelectedUser();

    for (var i in ret) {
        if (ret[i] == "admin") {
            alert("不能删除admin账号！");
            return;
        }
    }

    $.ajax({
        async: false,
        url: "/user/delete",
        method: "POST",
        data: JSON.stringify(ret),
        dataType: "json",
        success: function (result) {
            if (result.status == 0) {
                window.location.reload();
            } else {
                alert("删除用户失败！");
            }
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
        }
    })
}

function getSelectedUserInfo() {
    var list = document.getElementsByName("tr_user");
    var i = 0;
    var data = new Object();
    for (i = 0; i < list.length; i++) {
        if (list[i].firstChild.firstChild.checked) {
            //if user is selected, get username
            var val = list[i].childNodes[1].innerHTML;
            data.name = val;
            val = list[i].childNodes[2].innerHTML;
            data.email = val;
            val = list[i].childNodes[3].innerHTML;
            data.email = val;
            val = list[i].childNodes[4].innerHTML;
            data.phone = val;
            val = list[i].childNodes[5].innerHTML;
            data.department = val;
        }
    }

    return data;
}

function editUser() {
    var ret = getSelectedUser();
    if (ret.length == 0) {
        alert("请选择一个用户进行编辑！");
        return;
    }
    if (ret.length != 1) {
        alert("仅仅能选择一个用户进行编辑！");
        return;
    }

    var jsondata = getSelectedUserInfo();

    $.ajax({
        async: false,
        url: "static/html/edituser.html",
        dataType: "text",
        success: function (result) {
            var node = document.getElementById("mainsession");
            var div = document.createElement("div");
            div.innerHTML = result;
            node.appendChild(div);
            $('.theme-popover-mask').fadeIn(100);
            $('.theme-popover').slideDown(200);
            document.getElementsByName("email")[0].value = jsondata.email;
            document.getElementsByName("phone")[0].value = jsondata.phone;
            document.getElementsByName("department")[0].value = jsondata.department;
            $('.theme-poptit .close').click(function () {
                $('.theme-popover-mask').fadeOut(100);
                $('.theme-popover').slideUp(200);
            })
        }
    });

    $("#btn_edit_user").click(function () {
        jsondata.email = document.getElementsByName("email")[0].value;
        jsondata.phone = document.getElementsByName("phone")[0].value;
        jsondata.department = document.getElementsByName("department")[0].value;
        if (jsondata.email.length > 0 && !emailCheck(jsondata.email)) {
            alert("邮箱格式不正确！");
            return;
        }

        if (jsondata.phone.length > 0 && !checkPhone(jsondata.phone)
            ) {
            alert("手机号码格式不正确！");
            return;
        }
        $.ajax({
            async: false,
            url: "/user/edit",
            method: "POST",
            data: JSON.stringify(jsondata),
            dataType: "json",
            success: function (result) {
                if (result.status == 0) {
                    window.location.reload();
                } else {
                    alert("修改用户信息失败！");
                }
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
            }
        });
    })
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

function configure() {
    $.ajax({
        async: false,
        url: "static/html/configure.html",
        dataType: "text",
        success: function (result) {
            document.getElementById("mainsession").innerHTML = result;
        }
    });

    $.get({
        url: "configure",
        dataType: "json",
        success: function (result) {
            //var data = eval("(" + request.data + ")");
            if (result.status == 0) {
                var selected = document.getElementById("config_engine");
                if (result.data.engine == "qemu-kvm") {
                    selected.add(new Option(result.data.engine))
                    selected.add(new Option("qemu-system-x86_64"))
                } else if (result.data.engine == "qemu-system-x86_64") {
                    selected.add(new Option(result.data.engine))
                    selected.add(new Option("qemu-kvm"))
                }
                selected = document.getElementById("config_display");
                if (result.data.display == "spice") {
                    selected.add(new Option(result.data.display))
                    selected.add(new Option("RDP"))
                } else if (result.data.display == "RDP") {
                    selected.add(new Option(result.data.display))
                    selected.add(new Option("spice"))
                }
            } else {
                alert("设置失败！");
            }
        }
    });

    $("#btn_configure").click(function () {
            var jsondata = new Object();
            var selected = document.getElementById("config_engine");
            var index = selected.selectedIndex;
            var value = selected.options[index].value;
            jsondata.engine = value;
            selected = document.getElementById("config_display");
            index = selected.selectedIndex;
            value = selected.options[index].value;
            jsondata.display = value;
            $.ajax({
                url: "configure",
                method:"POST",
                data: JSON.stringify(jsondata),
                dataType: "json",
                beforeSend: function (request) {
                    request.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
                },
                success: function (result) {
                    if(result.status == 0){
                        alert("配置成功！")
                    }else{
                        alert("配置失败！")
                    }
                }
            });
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
