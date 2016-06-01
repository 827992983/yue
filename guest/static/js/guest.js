/**
 * Created by lijian on 16/6/1.
 */

window.onload = guestOnload

function guestOnload() {
    var username = getCookie("username");
    document.getElementById("username").innerHTML = username;

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

    document.getElementById("startvm").onclick = startVm;
    document.getElementById("connectvm").onclick = connectVm;
    document.getElementById("stopvm").onclick = stopVm;

    getAllVms();
}

function getAllVms() {
    $.ajax({
        url: "/vms?vmname=all",
        method: "GET",
        async: false,
        dataType: "json",
        beforeSend: function (request) {
            request.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
        },
        success: function (result) {
            var table = document.getElementById("table_vm");
            var data = result.data;
            var i = 0;
            for (i = 0; i < data.length; i++) {
                var tr = document.createElement("tr");
                tr.setAttribute("name", "tr_vm");
                tr.setAttribute("class", "tr_vm");
                table.appendChild(tr);

                var td = document.createElement('td');
                td.setAttribute("name", "td_number");
                td.setAttribute("class", "td_vm_title");
                tr.appendChild(td);
                var chkbox = document.createElement("input");
                chkbox.setAttribute("type", "checkbox");
                chkbox.setAttribute("class", "checkbox_vm");
                chkbox.setAttribute("name", "select_vm");
                td.appendChild(chkbox);
                var span = document.createElement("span");
                span.innerHTML = "&nbsp;&nbsp;&nbsp;" + i.toString()
                td.appendChild(span);

                var td = document.createElement('td');
                td.setAttribute("name", "td_vmname");
                td.setAttribute("class", "td_vm_title");
                td.innerHTML = data[i].name;
                tr.appendChild(td);

                var td = document.createElement('td');
                td.setAttribute("name", "td_vmname");
                td.setAttribute("class", "td_vm_title");
                if (data[i].system == 0) {
                    td.innerHTML = "Windows 7_x64"
                } else if (data[i].system == 1) {
                    td.innerHTML = "Windows 7"
                } else if (data[i].system == 2) {
                    td.innerHTML = "Windows XP"
                } else if (data[i].system == 3) {
                    td.innerHTML = "Linux x86_64";
                } else if (data[i].system == 4) {
                    td.innerHTML = "Linux i386";
                } else {
                    td.innerHTML = "unknown";
                }
                tr.appendChild(td);

                var stat = new Object();
                $.ajax({
                    url: "/vm/status?vmname=" + data[i].name,
                    method: "GET",
                    async: false,
                    dataType: "json",
                    beforeSend: function (request) {
                        request.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
                    },
                    success: function (result) {
                        if (result.status == 0) {
                            stat = result.data;
                        } else {
                            alert("获取虚拟机状态失败");
                        }
                    }
                });

                var td = document.createElement('td');
                td.setAttribute("name", "td_vmstatus");
                td.setAttribute("class", "td_vm_title");
                td.innerHTML = stat.status;
                tr.appendChild(td);

                var td = document.createElement('td');
                td.setAttribute("name", "td_vmcpu");
                td.setAttribute("class", "td_vm_title");
                td.innerHTML = stat.cpu + " %";
                tr.appendChild(td);

                var td = document.createElement('td');
                td.setAttribute("name", "td_vmmemory");
                td.setAttribute("class", "td_vm_title");
                td.innerHTML = stat.memory + " %";
                tr.appendChild(td);
            }
        }
    });

    $("table tr:gt(0)").hover(function () { //tr:gt(0)表示不选第一行，因为第一行往往是标题
        var vmname = $(this).find("td:eq(1)").text();
        var vminfo = getVmInfo(vmname);
        //alert(JSON.stringify(vminfo));
        document.getElementById("vm_desc_user").innerHTML = vminfo.user;
        document.getElementById("vm_desc_template").innerHTML = vminfo.templatename;
        document.getElementById("vm_desc_istemplate").innerHTML = vminfo.istemplate;
        document.getElementById("vm_desc_cpu").innerHTML = vminfo.cpu;
        document.getElementById("vm_desc_memory").innerHTML = vminfo.memory;
        var nic = ""
        if (vminfo.nic1 != "") {
            nic = vminfo.nic1;
        }
        if (vminfo.nic2 != "") {
            nic = nic + ","
            nic = nic + vminfo.nic2
        }
        document.getElementById("vm_desc_nic").innerHTML = nic;
        document.getElementById("vm_desc_disk1").innerHTML = vminfo.disk1;
        document.getElementById("vm_desc_disk2").innerHTML = vminfo.disk2;
        document.getElementById("vm_desc_snapshort").innerHTML = vminfo.snapshotname;
    }, function () {

    });
}

function getVmInfo(vmname) {
    var ret = {};
    $.ajax({
        url: "/vms?vmname=" + vmname,
        method: "GET",
        async: false,
        dataType: "json",
        beforeSend: function (request) {
            request.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
        },
        success: function (result) {
            if (result.data.length == 1) {
                ret = result.data[0];
            }
        }
    });

    return ret;
}

function startVm() {
    var ret = getSelectedVm();
    if (ret.length == 0) {
        alert("请选择要启动的VM！");
        return;
    }

    $.ajax({
        async: false,
        url: "/vm/start",
        method: "POST",
        data: JSON.stringify(ret),
        dataType: "json",
        success: function (result) {
            if (result.status == 0) {
                window.location.reload();
            } else if(result.status == 4403) {
                alert("这是模板,不能启动!");
            } else if(result.status == 4404) {
                alert("虚拟机已经启动!");
            } else {
                alert("启动虚拟机失败！");
            }
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
        }
    })
}

function getVmConnInfo(vmname){
    var ret = new Object();
    $.ajax({
        url: "/vm/conninfo?vmname=" + vmname,
        method: "GET",
        async: false,
        dataType: "json",
        beforeSend: function (request) {
            request.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
        },
        success: function (result) {
            if (result.status == 0) {
                //alert(JSON.stringify(result))
                ret = result.data
            }else{
                alert("获取虚拟机连接信息失败!")
            }
        }
    });
    return ret;
}

function connectVm() {
    var ret = getSelectedVm();
    if (ret.length == 0) {
        alert("请选择要连接的VM！");
        return;
    }
    if (ret.length != 1) {
        alert("只能选择1个VM！");
        return;
    }

    var vmname = getSelectedVmName().name;
    var vmConnInfo = getVmConnInfo(vmname);
    //alert(JSON.stringify(vmConnInfo))
    var hostname = document.location.hostname;
    var port = vmConnInfo.mapport;

    var para = "?host=" + hostname + "&port=" + port;
    window.open("static/spice-html5/spice.html" + para);
}

function stopVm() {
    var ret = getSelectedVm();
    if (ret.length == 0) {
        alert("请选择要关机的VM！");
        return;
    }

    $.ajax({
        async: false,
        url: "/vm/stop",
        method: "POST",
        data: JSON.stringify(ret),
        dataType: "json",
        success: function (result) {
            if (result.status == 0) {
                window.location.reload();
            } else {
                alert("虚拟机关闭失败！");
            }
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
        }
    })
}


