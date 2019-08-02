$(document).ready(() => {


    loadData();


    //Slide toggle on click
    $(document).on("click", ".arrowIcon", (e) => {
        var ulName = e.target.getAttribute('name');
        $("#" + ulName).slideToggle();
    });


    //$(document).on("click", (e) => {
    //    var ulName = e.target.getAttribute('name');
    //    $("#" + ulName).toggleClass('desc');
    //});

   
    //SortList();

    
    $(function () {
        $(".sortable").sortable({
            connectWith: ".connectedSortable"
        }).disableSelection();
    });
});

function loadData() {

    jQuery('.wrap').empty();

    $.ajax({
        url: '/Home/GetNodes',
        method: 'GET',
        dataType: 'json',
        success: (data) => {
            
            treeBuilder(null, data);
             
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
        else
        {
            if (node.hasChildren == true)
            {
                var parentNodeId = "#" + node.parentNodeId;
                appendNode(node, parentNodeId);
            }
            else
            {
                var nodeHtml =
                    //`<li id="${node.id}" class="ui-state-default m-0 p-0 ${node.parentNodeId}"> ${node.name} </li>`;
                    `<li  id="${node.id}" class="ui-state-default m-0 p-0 ${node.parentNodeId}">
                         <div class="flexbox">         
                            <div class="d-inline pl-2">
                                <span style="font-size: 0.3em; vertical-align: middle;">
                                   <i class="fas fa-circle" style="vertical-align: middle;"></i> 
                                </span>
                            </div>

                            <div class="d-inline customElement pl-2">
                                Item 3
                            </div>
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
        //`<li class="ui-state-default ${node.parentNodeId}"  name="${node.id}"> ${node.name}
        //               <ul id="${node.id}" class="sortable">    
        //               </ul>
        //            </li>`
        `<li class="ui-state-default m-0 p-0 ${node.parentNodeId}" name="${node.id}">
            <div class="flexbox">
                <div class="d-inline ">
                    <i class="fas fa-caret-right text-center arrowIcon" name="${node.id}"></i>
                </div>

                <div class="d-inline customElement pl-1">
                   ${node.name}
                </div>
            </div>

            <ul id="${node.id}" class="sortable customUlist connectedSortable">
            </ul>
        </li>`;
    $(appendTo).append(nodeHtml);
}



function SortList() {

    $(document).on("click", (e) => {
        var listId = "#" + e.target.getAttribute('name');

        sorting(listId);
        $(listId).toggleClass('desc');

    });
}


function sorting(listId) {

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

