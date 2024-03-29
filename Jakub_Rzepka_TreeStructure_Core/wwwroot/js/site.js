﻿$(document).ready(() => {

    var token = $('input[name="__RequestVerificationToken"]').val();
    loadData(token);

});

function loadData(token) {

    jQuery('.wrap').empty();

    $.ajax({
        url: '/Home/GetNodes',
        method: 'GET',
        dataType: 'json',
        success: (data) => {

            treeBuilder(null, data);
            makeListAsSortableWidget(token);

            eventHandler(token);

        },
        error: (xhr, ajaxOptions, thrownError) => {
            alert(xhr.status);
            alert(thrownError);
        }
    });
};
function eventHandler(token) {
    $(document).on("click", ".arrowIcon", slideToggleList);
    $(document).on("click", ".customInput", markListElementAsActive);
    $(document).on("click", "#Sort", sortListAscDescToggler);
    $(document).on("click", "#Roll", showHideAllListsToggle);
    $(document).on("click", "input", showHideDragIcon);
    $(document).on("focusout", ".customInput", (e) => editingInputOnFocusOut(e, token));
    $(document).on("click", "#Add", (e) => addNewNodeLocateParent(e, token));
    $(document).on("click", "#Del", (e) => deleteNodeLocateElement(e, token));
    $(document).on("click", "#Edit", enableNodeEditing);
    $(document).on("click", "#SubmitEdit", () => submitNodeEditingMode(token));
}

function treeBuilder(parentId, data) {
    for (var node of data.filter(x => x.parentNodeId === parentId)) {

        var appendTo = parentId === null ? '.wrap' : "#" + node.parentNodeId;
        generateHTML(node.name, node.id, node.parentNodeId, node.hasChildren, appendTo);

        treeBuilder(node.id, data);
    }
}
function generateHTML(nodeName, nodeId, parentNodeId, hasChildren, appendTo) {
    var arrowIcon = hasChildren ? `<i class="fas fa-caret-down text-center arrowIcon" name="${nodeId}"></i>` : "";
    var htmlForAppend = `<li class="ui-state-default" name="${nodeId}" id="P${parentNodeId}">
                             <div class="flexbox">         
                                <div class="d-inline ${nodeId}">
                                     ${arrowIcon}
                                </div>
                                <input class="w-100 customInput" name="${nodeId}" value="${nodeName}" readonly="">
                                <span class="pr-1 movable" name="drag${nodeId}" style="font-size: 1em; background-color: #ffc107; display:none;">
                                     <i class="fas fa-arrows-alt"></i>
                                <span>
                            </div>
                            <ul id = "${nodeId}" class="sortable connectedSortable customUlist toggle"> 
                                <li class="space ${nodeId}" style="display:none;"></li>
                            </ul >
                            </li>`;
    $(appendTo).append(htmlForAppend);
}

function makeListAsSortableWidget(token) {
    $(".sortable").sortable({
        disabled: disableSortableWidget(),
        items: 'li:not(.space)',
        connectWith: ".connectedSortable",
        containment: ".scroll",
        tolerance: "pointer",
        revert: true,
        placeholder: "ui-state-highlight",
        start: (event, ui) => {
            var liId = ui.item.attr('name');
            $(".space:not(." + liId + ")").show();
        },
        stop: (event, ui) => {
            saveUpdatedNodeSortOrder(ui, token);
            $(".space").hide();
        }
    }).disableSelection();
}
function disableSortableWidget() {
    return $("#logged").hasClass("logged") ? false : true;
}

//SaveOrder
function saveUpdatedNodeSortOrder(ui, token) {
    var nodeId = ui.item.attr('name');
    var parentId = ui.item.parent().attr('id');

    edit(token, "", nodeId, parentId);

    deleteSlideArrow(ui.item.attr('id'))
    addSlideArrow(parentId);
    ui.item.attr('id', "P" + parentId);
}
function asignOrderIndexToEachNode(parentId) {
    if (!disableSortableWidget()) {
        var orderArray = [];

        $("#" + parentId).children('li:not(.space)').each(function (i) {
            var index = $(this).index();
            var nodeId = $(this).attr('name');
            var order =
            {
                Index: index,
                NodeId: nodeId,
                ParentId: parentId
            };
            orderArray.push(order);
        });

        updateIndexs(orderArray);
    }
}
function updateIndexs(orderArray) {
    $.ajax({
        url: "/Home/SortNode",
        type: 'POST',
        data: {
            sortVm: orderArray
        }
    });
}
//

//Add
function addNewNodeLocateParent(e, token) {
    var appendTo = $("input").hasClass("Active") ? $(".Active").attr('name') : ".wrap";
    $("#Add").addClass("disabled");
    add(token, e, appendTo);
}
function add(token, e, appendTo) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var parentListId = appendTo;

    $.ajax({
        url: '/Home/AddNewNode',
        method: 'POST',
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        data: {
            __RequestVerificationToken: token,
            Name: nameGenerator(),
            ParentNodeId: parentListId
        },
        success: (response) => {
            if (response.success) {

                var parentId = response.nodeParentId === null ? "" : response.nodeParentId;
                if (appendTo !== ".wrap") appendTo = "#" + appendTo;

                generateHTML(response.nodeName, response.newNodeId, parentId, false, appendTo);
                addSlideArrow(parentId);

                $("#Edit, #Del, #Move").removeClass("disabled");
                focusOnElement(response.newNodeId);

                var parentId = response.nodeParentId === null ? "0" : response.nodeParentId;
                asignOrderIndexToEachNode(parentId)

                $("#Add").removeClass("disabled");
                $(".selector").sortable("refresh");

            } else {
                alert('Something goes worng, try again :<');
            }
        },
        error: (response) => { handleError(response) }
    });
}
function nameGenerator() {
    let count = 0;
    var name = "New (" + count + ")"
    while ($(`.customInput:input[value="${name}"]`).length) {
        name = "New (" + ++count + ")";
    }
    return name;
}
//

//Del
function deleteNodeLocateElement(e, token) {
    if (confirm('Are you sure you want to delete this node (also content) ?')) {
        if ($("input").hasClass("Active")) {
            var nodeId = $(".Active").attr('name');
            deleteNode(token, e, nodeId)
        }
    }
}
function deleteNode(token, e, nodeId) {
    e.preventDefault();
    e.stopImmediatePropagation();

    $.ajax({
        url: '/Home/DeleteNode',
        method: 'POST',
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        data: {
            __RequestVerificationToken: token,
            id: nodeId
        },
        success: (response) => {
            if (response.success) {

                $("#Edit, #Del, #Move").addClass("disabled");
                $(".movable").hide();

                var parentId = $("li[name=" + nodeId + "]").attr('id');
                $('li[name=' + nodeId + ']').remove();
                deleteSlideArrow(parentId);

            } else {
                alert('Something goes worng, try again :<');
            }
        },
        error: (response) => { handleError(response) }
    });
}
//

//Edit
function enableNodeEditing() {
    var nodeId = $(".Active").attr('name');
    var inputName = "input[name='" + nodeId + "']";

    $(inputName).attr("readonly", false);
    $(inputName).select();

    $("#Edit").hide();
    $("#SubmitEdit").show();
    $("#Add, #Del, #Move").addClass("disabled")

    $(inputName).focus();
}
function submitNodeEditingMode(token) {
    var nodeId = $(".Active").attr('name');
    var inputName = "input[name='" + nodeId + "']";

    if ($(inputName).val()) {
        $(inputName).attr("readonly", true);
        $("#SubmitEdit").hide();
        $("#Edit").show();
        var newName = $(inputName).val();
        edit(token, newName, nodeId, null);
    }
}
function editingInputOnFocusOut(e, token) {
    if ($(e.target).attr("readonly") === 'readonly') {
        var inputName = e.target.getAttribute('name');
        $('[name=drag' + inputName + ']').hide();
        $("#Add, #Del, #Move").removeClass("disabled")
        return;
    }
    if ($(e.target).val()) submitNodeEditingMode(token);
    else {
        $(e.target).effect("highlight", { color: '#ff4207' }).focus();
        $(e.target).attr("readonly", true);
        $("#SubmitEdit").hide();
        $("#Edit").show();
        $(e.target).val($(e.target).attr('value'));
        $("#Add, #Del, #Move").removeClass("disabled")
    }
}
function edit(token, newName, nodeId, parentId) {
    $.ajax({
        url: '/Home/EditNode',
        method: 'POST',
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        data: {
            __RequestVerificationToken: token,
            Id: nodeId,
            Name: newName,
            ParentNodeId: parentId
        },
        success: (response) => {
            if (response.success) {

                asignOrderIndexToEachNode(parentId);
                $("input[name = '" + response.nodeId + "']").effect("highlight", { color: '#02d402' });
                $("#Add, #Del, #Move").removeClass("disabled");

            } else {
                $("input[name = '" + response.nodeId + "']").effect("highlight", { color: '#ff4207' });
            }
        },
        error: (response) => { handleError(response) }
    });
}
//

function sortListAscDescToggler() {
    if (!$("input").hasClass("Active")) {
        var listClass = ".wrap"
        var listId = $("#0").attr('id')
        sortingEngine(listClass);
        asignOrderIndexToEachNode(0)
        $(listClass).toggleClass('desc');
    }
    else {
        var listId = $(".Active").attr('name');
        sortingEngine("#" + listId);
        asignOrderIndexToEachNode(listId)
        $("#" + listId).toggleClass('desc');
    }
}
function sortingEngine(listId) {
    $(listId).html(
        $(listId).children("li.ui-state-default").sort(function (a, b) {
            if (!$(listId).hasClass("desc")) {
                return $(a).find("div>input").val().toUpperCase().localeCompare(
                    $(b).find("div>input").val().toUpperCase());
            }
            else {
                return -$(a).find("div>input").val().toUpperCase().localeCompare(
                    $(b).find("div>input").val().toUpperCase());
            }
        })
    );
}
function showHideAllListsToggle(e) {
    if (!$(e.target).hasClass("clicked")) {
        $(e.target).addClass("clicked");
        $("ul:not(.wrap, .navbar-nav)").slideUp();
        $(".fa-caret-down").addClass("flip");
        $("#Roll").addClass("flip-1");
        $(".customInput").removeClass("Active");
        $("#Edit, #Del, #Move").addClass("disabled");
    }
    else {
        $(e.target).removeClass("clicked");
        $("ul:not(.wrap, .navbar-nav)").slideDown();
        $(".fa-caret-down").removeClass("flip");
        $("#Roll").removeClass("flip-1");
        $(".customInput").removeClass("Active");
        $("#Edit, #Del, #Move").addClass("disabled");
    }
}
function markListElementAsActive(e) {
    if (!$(e.target).hasClass("Active")) {
        $(".Active").removeClass("Active");
        $(e.target).addClass("Active");
        $("#Edit, #Del, #Move").removeClass("disabled");
    }
    else {
        $(".Active").removeClass("Active");
        $('input').blur();
        $("#Edit, #Del, #Move").addClass("disabled")
        $(".movable").hide();
    }
}
function showHideDragIcon(e) {
    if (!disableSortableWidget()) {
        var inputName = e.target.getAttribute('name');
        if ($("[name=" + inputName + "]").hasClass("Active")) {
            $('[name=drag' + inputName + ']').show();
        }
    }
}
function deleteSlideArrow(id) {
    if (!id.includes("null")) {
        var oldParentId = id.slice(1);
        var count = $("#" + oldParentId + " li").length;
        if (count <= 1) {
            $("div." + oldParentId + "").children().remove();
        }
    }
}
function addSlideArrow(parentId) {
    if (parentId == "") return;
    if ($("div." + parentId + "").children().length < 1) {
        var html = `<i class="fas fa-caret-down text-center arrowIcon" name="${parentId}"></i>`;
        $("div." + parentId + "").append(html);
    }
}
function focusOnElement(id) {
    $(".Active").removeClass("Active")
    $('input[name=' + id + ']').addClass("Active");
}
function slideToggleList(e) {
    var ulId = "#" + e.target.getAttribute('name');
    $(".Active").removeClass("Active")
    $(ulId).slideToggle();
    $(e.target).toggleClass("flip");
}
function handleError(response) {
    console.log(response.responseText);
    alert('Something goes worng, try again :<');
}