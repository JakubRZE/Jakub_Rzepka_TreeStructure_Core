$(document).ready(() => {

    loadData();

});

function loadData() {

    jQuery('.wrap').empty();

    $.ajax({
        url: '/Home/GetNodes',
        method: 'GET',
        dataType: 'json',
        success: (data) => {

            treeBuilder(null, data);

            MakeListSortable();
            SlideToggleList();
            SortList();
            ShowHideDragIcon();
            MarkAsActive();
            ShowHideLists();
            InputFocusOut();

            AddNewNode();
            DeleteNode();
            EditeNodeButton();
            submitEditButton();
            

        },
        error: (xhr, ajaxOptions, thrownError) => {
            alert(xhr.status);
            alert(thrownError);
        }
    });
};

function treeBuilder(parentId, data) {
    for (var node of data.filter(x => x.parentNodeId === parentId)) {

        var appendTo = parentId === null ? '.wrap' : "#" + node.parentNodeId;
        GenerateHTML(node.name, node.id, node.parentNodeId, node.hasChildren, appendTo);

        treeBuilder(node.id, data);
    }
}

function GenerateHTML(nodeName, nodeId, parentNodeId, hasChildren, appendTo) {

    var arrowIcon = hasChildren ? `<i class="fas fa-caret-down text-center arrowIcon" name="${nodeId}"></i>` : "";

    var htmlForAppend = `<li class="ui-state-default m-0 p-0 ${parentNodeId}" name="${nodeId}">
                             <div class="flexbox">         
                                <div class="d-inline pl-2">
                                     ${arrowIcon}
                                </div>
                                <input class="w-100 customInput" name="${nodeId}" value="${nodeName}" readonly="">
                                <span class="pr-1 movable" name="drag${nodeId}" style="font-size: 1em; background-color: #ffc107; display:none;">
                                     <i class="fas fa-arrows-alt"></i>
                                <span>
                            </div>
                            <ul id = "${nodeId}" class="sortable customUlist connectedSortable toggle"> 
                            </ul >
                            </li>`;

    $(appendTo).append(htmlForAppend);
}

function SlideToggleList() {
    $(document).on("click", ".arrowIcon", (e) => {
        var ulId = "#" + e.target.getAttribute('name');
        $(ulId).slideToggle();
        $(e.target).toggleClass("flip");
    });
}

function MarkAsActive() {
    $(document).on("click", "input", (e) => {
        if (!$(e.target).hasClass("Active")) {
            $(".Active").removeClass("Active")
            $(e.target).addClass("Active");
            $("#Edit, #Del").removeClass("disabled")
        }
        else {
            $(".Active").removeClass("Active")
            $('input').blur();
            $("#Edit, #Del").addClass("disabled")
        }
    });
}

function FocusOn(id) {
    $(".Active").removeClass("Active")
    $('[name=' + id + ']').addClass("Active");
}

function SortList() {
    $(document).on("click", "#Sort", () => {
        if (!$("input").hasClass("Active")) {
            var listClass = ".wrap"
            SortingEngine(listClass);
            $(listClass).toggleClass('desc');
        }
        else {
            var listId = "#" + $(".Active").attr('name');
            SortingEngine(listId);
            $(listId).toggleClass('desc');
        }

    });
}

function SortingEngine(listId) {
    $(listId).html(
        $(listId).children("li").sort(function (a, b) {
            if (!$(listId).hasClass("desc")) {
                return $(a).text().toUpperCase().localeCompare(
                    $(b).text().toUpperCase());
            }
            else {
                return -$(a).text().toUpperCase().localeCompare(
                    $(b).text().toUpperCase());
            }
        })
    );

}

function ShowHideLists() {
    $(document).on("click", "#Roll", (e) => {
        if (!$(e.target).hasClass("clicked")) {
            $(e.target).addClass("clicked");
            $("ul:not(.wrap)").slideUp();
            $(".fa-caret-down").addClass("flip");
            $("#Roll").addClass("flip-1");
        }
        else {
            $(e.target).removeClass("clicked");
            $("ul:not(.wrap)").slideDown();
            $(".fa-caret-down").removeClass("flip");
            $("#Roll").removeClass("flip-1");
        }
    });
}

function MakeListSortable() {
    $(".sortable").sortable({
        //disabled: true
        connectWith: ".connectedSortable",
        containment: ".wrap",
        revert: true,
        update: (event, ui) => {

            var nodeId = ui.item.attr('name');
            var parentId = ui.item.parent().attr('id');
            Edit("", nodeId, parentId);

        }

    }).disableSelection();
}

function ShowHideDragIcon() {
    $(document).on("click", "input", (e) => {
        var inputName = e.target.getAttribute('name');
        $('[name=drag' + inputName + ']').show();
    });
}

function AddNewNode() {
    $(document).on("click", "#Add", (e) => {

        var appendTo = $("input").hasClass("Active") ? $(".Active").attr('name') : ".wrap";
        $("#Add").addClass("disabled");
        AddNode(e, appendTo)

    });
}

function AddNode(e, appendTo) {

    e.preventDefault();
    e.stopImmediatePropagation();

    var parentListId = appendTo;

    $.ajax({
        url: '/Home/AddNewNode',
        method: 'POST',
        //contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        data: {
            //__RequestVerificationToken: token,
            name: NameGenerator(1),
            parentId: parentListId
        },
        success: (response) => {
            if (response.success) {

                var parentId = response.nodeParentId === null ? "" : response.nodeParentId;
                if (appendTo !== ".wrap") appendTo = "#" + appendTo;

                GenerateHTML(response.nodeName, response.newNodeId, parentId, false, appendTo);
                $("#Edit, #Del").removeClass("disabled");
                FocusOn(response.newNodeId);

                $("#Add").removeClass("disabled");

                $(".selector").sortable("refresh");

            } else {
                alert('not success')
            }
        },
        error: () => { alert('Something goes worng:(') }
    });

}

function NameGenerator(count) {

    var name = "New Node (" + count + ")"

    if ($("input").val() === name) {
        generateName(count++);
    }

    return name;
}

function DeleteNode() {
    $(document).on("click", "#Del", (e) => {

        if ($("input").hasClass("Active")) {
            var nodeId = $(".Active").attr('name');
            Delete(e, nodeId)
        }


    });
}

function Delete(e, nodeId) {
    e.preventDefault();
    e.stopImmediatePropagation();


    $.ajax({
        url: '/Home/DeleteNode',
        method: 'POST',
        //contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        data: {
            //__RequestVerificationToken: token,
            id: nodeId
        },
        success: (response) => {
            if (response.success) {

                $('li[name=' + nodeId + ']').remove();
                $("#Edit, #Del").addClass("disabled");

            } else {
                alert('not success')
            }
        },
        error: () => { alert('Something goes worng:(') }
    });
}

function EditeNodeButton() {
    $(document).on("click", "#Edit", (e) => {

        var nodeId = $(".Active").attr('name');
        var inputName = "input[name='" + nodeId + "']";

        $(inputName).attr("readonly", false);
        $(inputName).select();

        $("#Edit").hide();
        $("#SubmitEdit").show();

        $(inputName).focus();
    });

}

function submitEditButton() {
    $(document).on("click", "#SubmitEdit", submitButtonHandler);
}


function submitButtonHandler() {
    var nodeId = $(".Active").attr('name');
    var inputName = "input[name='" + nodeId + "']";

    if ($(inputName).val()) {
        $(inputName).attr("readonly", true);
        $("#SubmitEdit").hide();
        $("#Edit").show();
        var newName = $(inputName).val();
        Edit(newName, nodeId, null);
    }

}



function Edit(newName, nodeId, parentId) {

    $.ajax({
        url: '/Home/EditNode',
        method: 'POST',
        //contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        data: {
            //__RequestVerificationToken: token,
            name: newName,
            id: nodeId,
            parentId: parentId
        },
        success: (response) => {
            if (response.success) {

                if (response.success) {
                    $("[name = '" + response.nodeId + "']").effect("highlight", { color: '#02d402' });
                } else {
                    $("[name = '" + response.nodeId + "']").effect("highlight", { color: '#ff4207' });
                }

            } else {
                alert('not success')
            }
        },
        error: () => { alert('Something goes worng:(') }
    });
}

function InputFocusOut() {
    $(".customInput").focusout((e) => {

        if ($(e.target).attr("readonly") === 'readonly')
        {
            var inputName = e.target.getAttribute('name');
            $('[name=drag' + inputName + ']').hide();
            return;
        }

        if ($(e.target).val()) submitButtonHandler();
        else
        {
            $(e.target).effect("highlight", { color: '#ff4207' }).focus();
            $(e.target).attr("readonly", true);
            $("#SubmitEdit").hide();
            $("#Edit").show();
            $(e.target).val($(e.target).attr('value'));
        }

    });
}



