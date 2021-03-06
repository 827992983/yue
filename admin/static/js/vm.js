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
                window.location.reload();
            })
        }
    });

    $.ajax({
        async: false,
        url: "/vm/template",
        dataType: "json",
        method: "GET",
        success: function (result) {
            if (result.status == 0) {
                var data = result.data;
                var i = 0;
                for (i = 0; i < data.length; i++) {
                    var select_owner = document.getElementById("select_template");
                    select_owner.add(new Option(data[i]))
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

    document.getElementById("select_template").onchange = function (){
        var selected = document.getElementById("select_template")
        var index = selected.selectedIndex;
        if (index > 0) {
            var templatename = selected.options[index].value;
            var vminfo = getVmInfo(templatename);
            document.getElementById("system_type").options[vminfo.system].selected = true;
            document.getElementById("memory").value = vminfo.memory;
            if (vminfo.cpu == 2){
                document.getElementById("cpu").options[1].selected = true;
            }else if(vminfo.cpu == 4){
                document.getElementById("cpu").options[2].selected = true;
            }else if (vminfo.cpu == 8){
                document.getElementById("cpu").options[3].selected = true;
            }else{
                document.getElementById("cpu").options[0].selected = true;
            }

            if (vminfo.disk1 > 0) {
                document.getElementById("disk1").value = vminfo.disk1;
            }else{
                document.getElementById("disk1").value = "";
            }
/*
            if (vminfo.disk2 > 0) {
                document.getElementById("disk2").value = vminfo.disk2;
            }else{
                document.getElementById("disk2").value = "";
            }
*/
            document.getElementById("disk1").setAttribute("disabled", "disabled");
            document.getElementById("disk2").setAttribute("disabled", "disabled");

            if (vminfo.nic1.length > 1){
                document.getElementById("nic1").options[0].selected = true;
            }else{
                document.getElementById("nic1").options[1].selected = true;
            }

            if (vminfo.nic2.length > 1){
                document.getElementById("nic2").options[1].selected = true;
            }else{
                document.getElementById("nic2").options[0].selected = true;
            }
        }
    }

    //$("#btn_create_vm").click(function () {} //jquery 方式
    document.getElementById("btn_create_vm").onclick = function () { //javascript方式
        var data = new Object();
        data.name = document.getElementById("vm_name").value;

        var selected = document.getElementById("select_template")
        var index = selected.selectedIndex;
        if (index >= 1) {
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
        if (nic1 == "Yes") {
            data.nic1 = "yes";
        } else {
            data.nic1 = "no";
        }

        selected = document.getElementById("nic2");
        index = selected.selectedIndex;
        var nic2 = selected.options[index].value;
        if (nic2 == "Yes") {
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
                if (nic1 == "Yes") {
                    data.nic1 = "yes";
                } else {
                    data.nic1 = "no";
                }

                selected = document.getElementById("nic2");
                index = selected.selectedIndex;
                var nic2 = selected.options[index].value;
                if (nic2 == "Yes") {
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
                            alert("编辑成功，下次启动生效！")
                            $('.theme-popover-mask').fadeOut(100);
                            $('.theme-popover').slideUp(200);
                            window.location.reload();//刷新页面的方法
                        } else if(result.status == 4303) {
                            alert("这是模板不能编辑!");
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
            } else if(result.status == 4201){
                alert("虚拟机正在运行，无法删除！")
                window.location.reload();
            } else if(result.status == 4203){
                alert("请先删除基于该模板建立的虚拟机，然后再删除该模板！")
                window.location.reload();
            }else {
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
    var data=new Object();
    data.vmname = ret[0]
    $.ajax({
        async: false,
        url: "/vm/snapshot",
        method: "POST",
        data: JSON.stringify(data),
        dataType: "json",
        success: function (result) {
            if (result.status == 0) {
                alert("创建快照成功!")
                window.location.reload();
            } else if(result.status == 4701) {
                alert("虚拟机正在运行，无法创建快照！");
            } else if(result.status == 4702) {
                alert("快照已经存在，请先删除旧的快照，然后创建新快照！");
            } else {
                alert("创建快照失败！");
            }
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
        }
    })
}

function restoreSnapshot() {
    var ret = getSelectedVm();
    if (ret.length == 0) {
        alert("请选择要恢复快照的VM！");
        return;
    }
    if (ret.length != 1) {
        alert("只能选择1个VM恢复快照！");
        return;
    }
    var data = new Object()
    data.vmname = ret[0]
    $.ajax({
        async: false,
        url: "/vm/snapshot",
        method: "PUT",
        data: JSON.stringify(data),
        dataType: "json",
        success: function (result) {
            if (result.status == 0) {
                alert("恢复快照成功!")
                window.location.reload();
            } else if(result.status == 4701) {
                alert("虚拟机正在运行，无法恢复快照！");
            } else {
                alert("恢复快照失败！");
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
    var data = new Object()
    data.vmname = ret[0]
    $.ajax({
        async: false,
        url: "/vm/snapshot",
        method: "DELETE",
        data: JSON.stringify(data),
        dataType: "json",
        success: function (result) {
            if (result.status == 0) {
                alert("删除快照成功!")
                window.location.reload();
            } else if(result.status == 4701) {
                alert("虚拟机正在运行，无法删除快照！");
            }  else {
                alert("删除快照失败！");
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

    if (ret.length != 1) {
        alert("只能选择1个VM创建模板！");
        return;
    }

    $.ajax({
            async: false,
            url: "/vm/template",
            method: "post",
            data: JSON.stringify(ret),
            dataType: "json",
            success: function (result) {
                if (result.status == 0) {
                    alert("创建模板成功,！");
                    $('.theme-popover-mask').fadeOut(100);
                $('.theme-popover').slideUp(200);
                } else if (result.status == 4003) {
                    alert("有快照的虚拟机不可以创建模板！");
                } else if (result.status == 4004) {
                    alert("已经基于模板创建的虚拟机，不可以创建模板！");
                } else {
                    alert("创建模板失败！");
                }
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
            }
    });
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

    var vmname = ret[0]

    $.ajax({
        url: "static/html/addiso.html",
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
        url: "/iso",
        dataType: "json",
        success: function (result) {
            if (result.status == 0) {
                var data = result.data;
                var i = 0;
                for (i = 0; i < data.length; i++) {
                    var select_iso = document.getElementById("iso");
                    select_iso.add(new Option(data[i]))
                }
            } else {
                alert("获取光盘信息失败！")
            }
        }
    });

    document.getElementById("btn_add_iso").onclick = function () { //javascript方式
        data = new Object();
        data.vmname = vmname;
        selected = document.getElementById("iso")
        var index = selected.selectedIndex;
        data.iso = selected.options[index].value;
        $.ajax({
            async: false,
            url: "/iso",
            method: "post",
            data: JSON.stringify(data),
            dataType: "json",
            success: function (result) {
                if (result.status == 0) {
                    alert("挂载光盘成功，仅下次启动生效！");
                     $('.theme-popover-mask').fadeOut(100);
                $('.theme-popover').slideUp(200);
                } else {
                    alert("挂载光盘失败！");
                }
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
            }
        });
    }
}
