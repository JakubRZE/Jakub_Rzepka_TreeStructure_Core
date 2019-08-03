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

        },
        error: (xhr, ajaxOptions, thrownError) => {
            alert(xhr.status);
            alert(thrownError);
        }
    });
};

function treeBuilder(parentId, data) {

    for (var node of data.filter(x => x.parentNodeId === parentId)) {

        if (node.parentNodeId === null) {
            appendNode(node, '.wrap');
        }
        else {
            if (node.hasChildren == true) {
                var parentNodeId = "#" + node.parentNodeId;
                appendNode(node, parentNodeId);
            }
            else {
                var nodeHtml =





                    `<li class="ui-state-default m-0 p-0 ${node.parentNodeId} name="${node.id}">

                         <div class="flexbox">         

                            <div class="d-inline pl-2">
                            </div>
                            <input class="w-100 customInput" name="${node.id}" value="${node.name}" readonly="">

                            <span class="pr-1 movable" name="drag${node.id}" style="font-size: 1em; background-color: #ffc107; display:none;">
                            <i class="fas fa-arrows-alt"></i>
                            <span>

                        </div>

                    </li>`;





                $("#" + node.parentNodeId).append(nodeHtml);
            }
        }
        treeBuilder(node.id, data);
    }
}


function appendNode(node, appendTo) {
    var nodeHtml =





        `<li class="ui-state-default m-0 p-0 ${node.parentNodeId}" name="${node.id}">

            <div class="flexbox">

                <div class="d-inline ">
                    <i class="fas fa-caret-down text-center arrowIcon" name="${node.id}"></i>
                </div>

                <input class="w-100 customInput" name="${node.id}" value="${node.name}" readonly="">

                <span class="pr-1 movable" name="drag${node.id}" style="font-size: 1em; background-color: #ffc107; display:none;">
                <i class="fas fa-arrows-alt"></i>
                <span>

            </div>






            <ul id="${node.id}" class="sortable customUlist connectedSortable toggle">
            </ul>

        </li>`;
    $(appendTo).append(nodeHtml);
}


function SlideToggleList() {
    $(document).on("click", ".arrowIcon", (e) => {
        var ulId = "#" + e.target.getAttribute('name');
        $(ulId).slideToggle();
        $(e.target).toggleClass("flip");
    });
}

function SortList() {
    $(document).on("click", "#Sort", () => {
        var listId = "#" + $(".Active").attr('name'); 
        SortingEngine(listId);
        $(listId).toggleClass('desc');
});
}

function ShowHideLists() {
    $(document).on("click", "#Roll", (e) => {
        if (!$(e.target).hasClass("clicked")) {
                $(e.target).addClass("clicked");
                $("ul:not(.wrap)").slideUp();
                $(".fa-caret-down").addClass("flip");
        }
        else {
            $(e.target).removeClass("clicked");
            $("ul:not(.wrap)").slideDown();
            $(".fa-caret-down").removeClass("flip");
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
