window.onload = adminOnload

var gRefreshEnv = true;

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
    document.getElementById("checkenv").onclick = checkEnv;
    document.getElementById("storage").onclick = storageMgmt;
    document.getElementById("network").onclick = networkMgmt;
    document.getElementById("manual").onclick = manual;
    document.getElementById("reference").onclick = reference;
    document.getElementById("download").onclick = download;
    document.getElementById("vm").onclick = vm;

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
    } else if (action == "#checkenv") {
        checkEnv();
    } else if (action == "#storage") {
        storageMgmt();
    } else if (action == "#network") {
        networkMgmt();
    } else if (action == "#manual") {
        manual();
    } else if (action == "#reference") {
        reference();
    } else if (action == "#download") {
        download();
    } else if (action == "#vm") {
        vm();
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
                        window.location.reload();//刷新页面的方法
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
                alert("获取配置信息失败！");
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
                method: "POST",
                data: JSON.stringify(jsondata),
                dataType: "json",
                beforeSend: function (request) {
                    request.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
                },
                success: function (result) {
                    if (result.status == 0) {
                        alert("配置成功！")
                    } else {
                        alert("配置失败！")
                    }
                }
            });
        }
    );
}

function getEnv() {
    $.ajax({
        url: "/checkenv",
        method: "GET",
        async: false,
        dataType: "json",
        beforeSend: function (request) {
            request.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
        },
        success: function (result) {
            if (result.status == 0) {
                //alert(JSON.stringify(result));
                document.getElementById("checkenv_os").innerHTML = result.data.os;
                document.getElementById("checkenv_kernel").innerHTML = result.data.kernel;
                document.getElementById("checkenv_virtenhance").innerHTML = result.data.vtx;
                document.getElementById("checkenv_kvm").innerHTML = result.data.kvm;
                document.getElementById("checkenv_spice").innerHTML = result.data.spice;
                document.getElementById("checkenv_cpu").setAttribute("value", String(result.data.cpu))
                if (result.data.cpu > 70 && result.data.cpu < 90) {
                    document.getElementById("checkenv_cpu").style.color = "#FFEC8B"
                }
                else if (result.data.cpu >= 90) {
                    document.getElementById("checkenv_cpu").style.color = "#FF3030"
                }
                document.getElementById("checkenv_memory").setAttribute('value', String(result.data.memory))
                if (result.data.memory > 70 && result.data.memory < 90) {
                    document.getElementById("checkenv_memory").style.color = "#FFEC8B"
                }
                else if (result.data.memory >= 90) {
                    document.getElementById("checkenv_memory").style.color = "#FF3030"
                }
            } else {
                alert("获取系统环境信息失败！")
            }
        }
    });
}

function checkEnv() {
    $.get({
        url: "static/html/checkenv.html",
        dataType: "text",
        success: function (result) {
            document.getElementById("mainsession").innerHTML = result;
        }
    });

    if (gRefreshEnv) {
        setInterval(getEnv, 3000);
        gRefreshEnv = false;
    }
}

function getSelectedStorage() {
    var list = document.getElementsByName("tr_user");
    var i = 0;
    var ret = new Array();
    for (i = 0; i < list.length; i++) {
        if (list[i].firstChild.firstChild.checked) {
            //if storage is selected, get path
            var path = list[i].childNodes[1].innerHTML;
            ret.push(path);
        }
    }

    return ret;
}

function addStorage() {
    var data = new Object();
    data.path = document.getElementById("input_storage").getAttribute('value')
    data.type = document.getElementById("select_storage_type")
    $.ajax({
        url: "/storage",
        method: "POST",
        data: JSON.stringify(data),
        dataType: "json",
        beforeSend: function (request) {
            request.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
        },
        success: function (result) {
            if (result.status == 0) {
                alert("添加存储成功！");
                window.location.reload();
            } else {
                alert("添加存储失败！");
            }
        }
    });
}

function deleteStorage() {
    var ret = getSelectedStorage();

    $.ajax({
        async: false,
        url: "/storage",
        method: "DELETE",
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

function storageMgmt() {
    $.get({
        url: "static/html/storage.html",
        dataType: "text",
        success: function (result) {
            document.getElementById("mainsession").innerHTML = result;
        }
    });

    $.ajax({
        url: "/storage",
        method: "GET",
        async: false,
        dataType: "json",
        beforeSend: function (request) {
            request.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
        },
        success: function (result) {
            if (result.status == 0) {
                alert(JSON.stringify(result));
                data = result.data;
                var i = 0;
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

                    td = document.createElement('td');
                    td.setAttribute("name", "td_path");
                    td.setAttribute("class", "td_user_title");
                    td.innerHTML = data[i].path;
                    tr.appendChild(td);

                    td = document.createElement('td');
                    td.setAttribute("name", "td_type");
                    td.setAttribute("class", "td_user_title");
                    td.innerHTML = data[i].type;
                    tr.appendChild(td);

                    td = document.createElement('td');
                    td.setAttribute("name", "td_disk");
                    td.setAttribute("class", "td_user_title");
                    td.innerHTML = data[i].disk;
                    tr.appendChild(td);

                    td = document.createElement('td');
                    td.setAttribute("name", "td_mount");
                    td.setAttribute("class", "td_user_title");
                    td.innerHTML = data[i].mount;
                    tr.appendChild(td);

                    td = document.createElement('td');
                    td.setAttribute("name", "td_all_space");
                    td.setAttribute("class", "td_user_title");
                    td.innerHTML = data[i].allspace;
                    tr.appendChild(td);

                    td = document.createElement('td');
                    td.setAttribute("name", "td_freespace");
                    td.setAttribute("class", "td_user_title");
                    td.innerHTML = data[i].freespace;
                    tr.appendChild(td);
                }
            }
        }
    });
}

function networkMgmt() {
    $.get({
        url: "static/html/network.html",
        dataType: "text",
        success: function (result) {
            document.getElementById("mainsession").innerHTML = result;
        }
    });

    $.ajax({
        url: "/network",
        method: "GET",
        async: false,
        dataType: "json",
        beforeSend: function (request) {
            request.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
        },
        success: function (result) {
            if(result.status == 0){
                alert(JSON.stringify(result));

            }
        }
    });
}

function vm() {
    $.get({
        url: "static/html/vm.html",
        dataType: "text",
        success: function (result) {
            document.getElementById("mainsession").innerHTML = result;
        }
    });
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

function manual() {
    $.get({
        url: "static/html/manual.html",
        dataType: "text",
        success: function (result) {
            document.getElementById("mainsession").innerHTML = result;
        }
    });
}

function reference() {
    $.get({
        url: "static/html/reference.html",
        dataType: "text",
        success: function (result) {
            document.getElementById("mainsession").innerHTML = result;
        }
    });
}

function download() {
    $.get({
        url: "static/html/download.html",
        dataType: "text",
        success: function (result) {
            document.getElementById("mainsession").innerHTML = result;
        }
    });
}

function layout() {

}
