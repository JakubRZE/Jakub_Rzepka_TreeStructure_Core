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

            AddNewNode();

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
        }
        else {
            $(".Active").removeClass("Active")
            $('input').blur();
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
        connectWith: ".connectedSortable",
    }).disableSelection();
}

function ShowHideDragIcon() {
    $(document).on("click", "input", (e) => {
        var inputName = e.target.getAttribute('name');
        $('[name=drag' + inputName + ']').show();

        $(e.target).focusout(() => {
            $('[name=drag' + inputName + ']').hide();
        })
    });
}

function AddNewNode() {
    $(document).on("click", "#Add", (e) => {

        var appendTo = $("input").hasClass("Active") ? $(".Active").attr('name') : ".wrap";
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
                GenerateHTML(response.nodeName, response.newNodeId, parentId, false, "#" + appendTo);
                FocusOn(response.newNodeId);

            } else {
                alert('not success')
            }
        },
        error: () => { alert('Something goes worng:(') }
    });

}

function NameGenerator(count) {

    var name = "New Node (" + count + ")"

    if ($("input").val() === name)
    {
        generateName(count++);
    }

    return name;
}