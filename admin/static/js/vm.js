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
            alert(JSON.stringify(result))
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

    //$("#btn_create_vm").click(function () {} //jquery 方式
    document.getElementById("btn_create_vm").onclick = function () { //javascript方式
        $.ajax({
            async: false,
            url: "/templates",
            dataType: "json",
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

        var data = new Object();
        data.name = document.getElementById("vm_name").value;
        var selected = document.getElementById("select_template")
        var index = selected.selectedIndex;
        data.templatename = selected.options[index].value;
        selected = document.getElementById("system_type");
        index = selected.selectedIndex;
        data.system = selected.options[index].value;
        selected = document.getElementById("cpu");
        index = selected.selectedIndex;
        data.cpu = selected.options[index].value;
        data.memory = document.getElementById("memory").value;
        selected = document.getElementById("nic1");
        index = selected.selectedIndex;
        data.nic1 = selected.options[index].value;
        selected = document.getElementById("nic2");
        index = selected.selectedIndex;
        data.nic2 = selected.options[index].value;
        data.disk1 = document.getElementById("disk1").value;
        data.disk2 = document.getElementById("disk2").value;
        selected = document.getElementById("owners");
        index = selected.selectedIndex;
        data.owner = selected.options[index].value;
        data.istemplate = "no";
        data.yourself = "";
        data.snapshotname = "";
        data.snapshotpath = "";
        data.templatepath = "";
        data.id = "";
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