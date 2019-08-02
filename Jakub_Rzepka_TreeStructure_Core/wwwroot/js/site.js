$(document).ready(() => {

    debugger
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
             
        },
        error: (xhr, ajaxOptions, thrownError) => {
            alert(xhr.status);
            alert(thrownError);
        }
    });
};

function treeBuilder(parentId, data) {

    for (var node of data.filter(x => x.parentNodeId === parentId)) {

        var str = "&nbsp&nbsp";

        var nodeHtml = `<p name="${node.id}" class="${node.parentNodeId}"> ${str.repeat(node.parentNodeId)} ${node.name} </p>`;
        $('.wrap').append(nodeHtml);

        treeBuilder(node.id, data);
    }
}