/*
 author:lijian
 date: 2016
 Copyright: free
 */

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
        if (vminfo.nic1 == "yes") {
            nic = "nic1";
        }
        if (vminfo.nic2 == "yes") {
            nic = nic + ",nic2"
        }
        document.getElementById("vm_desc_nic").innerHTML = nic;
        document.getElementById("vm_desc_disk1").innerHTML = vminfo.disk1;
        document.getElementById("vm_desc_disk2").innerHTML = vminfo.disk2;
        document.getElementById("vm_desc_snapshort").innerHTML = vminfo.snapshotpath;
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

function createVm() {
    $.ajax({
        url: "static/html/createvm.html",
        method: "GET",
        async: false,
        dataType: "text",
        beforeSend: function (request) {
            request.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
        },
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

    $.ajax({
        async: false,
        url: "/templates",
        dataType: "json",
        method: "GET",
        success: function (result) {
            if (result.status == 0) {
                var data = result.data;
                var i = 0;
                for (i = 0; i < data.length; i++) {
                    var select_owner = document.getElementById("select_template");
                    select_owner.add(new Option(data[i].templatename))
                }
            } else {
                alert("获取虚拟机模板失败！")
            }
        }
    });

    $.ajax({
        async: false,
        url: "/users",
        dataType: "json",
        success: function (result) {
            if (result.status == 0) {
                var data = result.data;
                var i = 0;
                for (i = 0; i < data.length; i++) {
                    var select_owner = document.getElementById("owner");
                    select_owner.add(new Option(data[i].name))
                }
            } else {
                alert("获取用户信息失败！")
            }
        }
    });

    //$("#btn_create_vm").click(function () {} //jquery 方式
    document.getElementById("btn_create_vm").onclick = function () { //javascript方式
        var data = new Object();
        data.name = document.getElementById("vm_name").value;

        var selected = document.getElementById("select_template")
        var index = selected.selectedIndex;
        if (index >= 0) {
            data.templatename = selected.options[index].value;
        } else {
            data.templatename = "";
        }

        selected = document.getElementById("system_type");
        data.system = selected.selectedIndex;

        selected = document.getElementById("cpu");
        index = selected.selectedIndex;
        data.cpu = parseInt(selected.options[index].value);

        data.memory = parseInt(document.getElementById("memory").value);

        selected = document.getElementById("nic1");
        index = selected.selectedIndex;
        var nic1 = selected.options[index].value;
        if (nic1 = "Yes") {
            data.nic1 = "yes";
        } else {
            data.nic1 = "no";
        }

        selected = document.getElementById("nic2");
        index = selected.selectedIndex;
        var nic2 = selected.options[index].value;
        if (nic2 = "Yes") {
            data.nic2 = "yes";
        } else {
            data.nic2 = "no";
        }

        var disk1 = document.getElementById("disk1").value;
        if (disk1 == null || disk1 == "") {
            data.disk1 = 0;
        } else {
            data.disk1 = parseInt(disk1);
        }
        data.disk1 = parseInt(document.getElementById("disk1").value);

        var disk2 = document.getElementById("disk2").value;
        if (disk2 == null || disk2 == "") {
            data.disk2 = 0;
        } else {
            data.disk2 = parseInt(disk2);
        }

        selected = document.getElementById("owner");
        index = selected.selectedIndex;
        data.user = selected.options[index].value;

        $.ajax({
            async: false,
            url: "/vms",
            method: "POST",
            data: JSON.stringify(data),
            dataType: "json",
            success: function (result) {
                if (result.status == 0) {
                    $('.theme-popover-mask').fadeOut(100);
                    $('.theme-popover').slideUp(200);
                    window.location.reload();//刷新页面的方法
                } else if (result.status == 4003) {
                    alert("虚拟机名称已经存在！");
                } else {
                    alert("创建虚拟机失败！");
                }
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
            }
        });
    }
}

function getSelectedVmName() {
    var list = document.getElementsByName("tr_vm");
    var i = 0;
    var data = new Object();
    for (i = 0; i < list.length; i++) {
        if (list[i].firstChild.firstChild.checked) {
            var val = list[i].childNodes[1].innerHTML;
            data.name = val;
        }
    }

    return data;
}

function editVm() {
    var ret = getSelectedVm();
    if (ret.length == 0) {
        alert("请选择一个VM进行编辑！");
        return;
    }
    if (ret.length != 1) {
        alert("仅仅能选择一个VM进行编辑！");
        return;
    }

    var vmname = getSelectedVmName().name;

    $.ajax({
        async: false,
        url: "static/html/editvm.html",
        dataType: "text",
        success: function (result) {
            var node = document.getElementById("mainsession");
            var div = document.createElement("div");
            div.innerHTML = result;
            node.appendChild(div);
            var vminfo = getVmInfo(vmname);
            document.getElementById("vm_name").value = vminfo.name;
            //document.getElementById("vm_name").setAttribute("disabled", "disabled");

            if (vminfo.templatename != "") {
                document.getElementById("select_template").add(new Option(vminfo.templatename));
            }
            document.getElementById("select_template").setAttribute("disabled", "disabled");

            document.getElementById("system_type").options[vminfo.system].selected = true;
            document.getElementById("system_type").setAttribute("disabled", "disabled");

            if (vminfo.disk1 > 0) {
                document.getElementById("disk1").value = vminfo.disk1;
                document.getElementById("disk1").setAttribute("disabled", "disabled");
            }

            if (vminfo.disk2 > 0) {
                document.getElementById("disk2").value = vminfo.disk2;
                document.getElementById("disk2").setAttribute("disabled", "disabled");
            }
            $.ajax({
                async: false,
                url: "/users",
                dataType: "json",
                success: function (result) {
                    if (result.status == 0) {
                        var data = result.data;
                        var i = 0;
                        for (i = 0; i < data.length; i++) {
                            var select_owner = document.getElementById("owner");
                            select_owner.add(new Option(data[i].name))
                        }
                    } else {
                        alert("获取用户信息失败！")
                    }
                }
            });

            $('.theme-popover-mask').fadeIn(100);
            $('.theme-popover').slideDown(200);

            document.getElementById("btn_edit_vm").onclick = function () {
                var data = new Object();
                data.name = document.getElementById("vm_name").value;

                var selected = document.getElementById("select_template")
                var index = selected.selectedIndex;
                if (index >= 0) {
                    data.templatename = selected.options[index].value;
                } else {
                    data.templatename = "";
                }

                selected = document.getElementById("system_type");
                data.system = selected.selectedIndex;

                selected = document.getElementById("cpu");
                index = selected.selectedIndex;
                data.cpu = parseInt(selected.options[index].value);

                data.memory = parseInt(document.getElementById("memory").value);

                selected = document.getElementById("nic1");
                index = selected.selectedIndex;
                var nic1 = selected.options[index].value;
                if (nic1 = "Yes") {
                    data.nic1 = "yes";
                } else {
                    data.nic1 = "no";
                }

                selected = document.getElementById("nic2");
                index = selected.selectedIndex;
                var nic2 = selected.options[index].value;
                if (nic2 = "Yes") {
                    data.nic2 = "yes";
                } else {
                    data.nic2 = "no";
                }

                var disk1 = document.getElementById("disk1").value;
                if (disk1 == null || disk1 == "") {
                    data.disk1 = 0;
                } else {
                    data.disk1 = parseInt(disk1);
                }
                data.disk1 = parseInt(document.getElementById("disk1").value);

                var disk2 = document.getElementById("disk2").value;
                if (disk2 == null || disk2 == "") {
                    data.disk2 = 0;
                } else {
                    data.disk2 = parseInt(disk2);
                }

                selected = document.getElementById("owner");
                index = selected.selectedIndex;
                data.user = selected.options[index].value;

                $.ajax({
                    async: false,
                    url: "/vm/edit",
                    method: "POST",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function (result) {
                        if (result.status == 0) {
                            $('.theme-popover-mask').fadeOut(100);
                            $('.theme-popover').slideUp(200);
                            window.location.reload();//刷新页面的方法
                        } else {
                            alert("编辑虚拟机失败！");
                        }
                    },
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
                    }
                });
            }

            $('.theme-poptit .close').click(function () {
                $('.theme-popover-mask').fadeOut(100);
                $('.theme-popover').slideUp(200);
                window.location.reload();
            })
        }
    });
}

function getSelectedVm() {
    var list = document.getElementsByName("tr_vm");
    var i = 0;
    var ret = new Array();
    for (i = 0; i < list.length; i++) {
        if (list[i].firstChild.firstChild.checked) {
            var vmname = list[i].childNodes[1].innerHTML;
            ret.push(vmname);
        }
    }

    return ret;
}

function deleteVm() {
    var ret = getSelectedVm();
    $.ajax({
        async: false,
        url: "/vm/delete",
        method: "POST",
        data: JSON.stringify(ret),
        dataType: "json",
        success: function (result) {
            if (result.status == 0) {
                window.location.reload();
            } else {
                alert("删除虚拟机失败！");
            }
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
        }
    })
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
    $.ajax({
        url: "/conninfo?vmname=" + vmname,
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
    alert(vmname);
    var vmConnInfo = getVmConnInfo(vmname);
    var hostname = vmConnInfo.hostname;
    var port = vmConnInfo.port;

    var para = "?hostname=" + hostname + "&port=" + port;
    window.open("spice-html5/spice.html" + para);
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
                alert("启动虚拟机失败！");
            }
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
        }
    })
}

function createSnapshot() {
    var ret = getSelectedVm();
    if (ret.length == 0) {
        alert("请选择要创建快照的VM！");
        return;
    }
    if (ret.length != 1) {
        alert("只能选择1个VM创建快照！");
        return;
    }
    $.ajax({
        async: false,
        url: "/vm/remplate",
        method: "POST",
        data: JSON.stringify(ret),
        dataType: "json",
        success: function (result) {
            if (result.status == 0) {
                window.location.reload();
            } else {
                alert("启动虚拟机失败！");
            }
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
        }
    })
}

function deleteSnapshot() {
    var ret = getSelectedVm();
    if (ret.length == 0) {
        alert("请选择要删除快照的VM！");
        return;
    }
    if (ret.length != 1) {
        alert("只能选择1个VM删除快照！");
        return;
    }
    $.ajax({
        async: false,
        url: "/vm/snapshot",
        method: "DELETE",
        data: JSON.stringify(ret),
        dataType: "json",
        success: function (result) {
            if (result.status == 0) {
                window.location.reload();
            } else {
                alert("启动虚拟机失败！");
            }
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
        }
    })
}

function createTemplate() {
    var ret = getSelectedVm();
    if (ret.length == 0) {
        alert("请选择要创建模板的VM！");
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
                alert("启动虚拟机失败！");
            }
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
        }
    })
}

function addIso() {
    var ret = getSelectedVm();
    if (ret.length == 0) {
        alert("请选择要挂载光盘的VM！");
        return;
    }
    if (ret.length != 1) {
        alert("只能选择1个VM挂载光盘！");
        return;
    }
    $.ajax({
        async: false,
        url: "/iso",
        method: "post",
        data: JSON.stringify(ret),
        dataType: "json",
        success: function (result) {
            if (result.status == 0) {
                window.location.reload();
            } else {
                alert("挂载光盘失败！");
            }
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
        }
    })
}