/*
 author:lijian
 date: 2016
 Copyright: free
 */

function getAllVms() {
    $.ajax({
        url: "/vm?vmid=all",
        method: "GET",
        async: false,
        dataType: "json",
        beforeSend: function (request) {
            request.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
        },
        success: function (result) {
            //alert(JSON.stringify(result))
        }
    });
}

function getVm() {
    var data = new Object();
    data.vmid = "";
    alert(JSON.stringify(data))
    $.ajax({
        url: "/vm",
        method: "GET",
        async: false,
        data: JSON.stringify(data),
        dataType: "json",
        beforeSend: function (request) {
            request.setRequestHeader('X-CSRFToken', getCookie("csrftoken"))
        },
        success: function (result) {
            //alert(JSON.stringify(result))
        }
    });
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

        alert(JSON.stringify(data))
        $.ajax({
            async: false,
            url: "/vm",
            method: "POST",
            data: JSON.stringify(data),
            dataType: "json",
            success: function (result) {
                if (result.status == 0) {
                    alert("创建虚拟机成功！")
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
    getAllVms();
}

function editVm() {

}

function deleteVm() {

}

function startVm() {

}

function connectVm() {

}

function stopVm() {

}

function createSnapshot() {

}

function deleteSnapshot() {

}

function createTemplate() {

}

function addIso() {

}