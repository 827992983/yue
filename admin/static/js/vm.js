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

    //$("#btn_create_user").click(function () {} //jquery 方式
    document.getElementById("btn_create_vm").onclick = function () { //javascript方式

    }
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