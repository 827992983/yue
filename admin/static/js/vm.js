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
    data.vmid = "all";
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
            alert(JSON.stringify(result))
        }
    });
}

function createVm() {
    alert('create vm!');
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