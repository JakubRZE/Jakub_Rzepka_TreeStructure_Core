$(document).ready(() => {

    debugger
    loadData();


    //Slide toggle on click

    //$(document).on("click", (e) => {
    //    var ulName = e.target.getAttribute('name');
    //    $("#" + ulName).slideToggle();
    //});


    //$(document).on("click", (e) => {
    //    var ulName = e.target.getAttribute('name');
    //    $("#" + ulName).toggleClass('desc');
    //});

   
    SortList();

    

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
                appendNode(node, "#" + node.parentNodeId);
            }
            else
            {
                var nodeHtml = `<li id="${node.id}" class="${node.parentNodeId}"> ${node.name} </li>`;
                $("#" + node.parentNodeId).append(nodeHtml);
            }
        }

        treeBuilder(node.id, data);
    }
}

function appendNode(node, appendTo) {
    var nodeHtml = `<li class="${node.parentNodeId}"  name="${node.id}"> ${node.name}
                       <ul id="${node.id}">    
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

