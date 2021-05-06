// initialize an array of id's of tables(datables)
function initDataTables(tableIds) {
    if (!Array.isArray(tableIds)) tableIds = [tableIds];
    tableIds.map(id => {
        $('#' + id).DataTable( {
            dom: 'Bfrtip',
            lengthMenu: [
                [ 10, 25, 50, -1 ],
                [ '10 rows', '25 rows', '50 rows', 'Show all' ]
            ],
            buttons: [
                'copy', 'csv', 'excel', 'pdf', 'print'
            ],
             responsive: true,
                "ajax": {
                    url: originalBase + ""+$("#" + id).attr("url"),
                    dataSrc: 'data'
                },
                "createdRow": function( row, data, dataIndex ) {
                    if (dataIndex == 0) {
                        // remove url attribute,
                        $('#' + id).attr('url', "");
                    }

                    // used for customizing content rendering [date YYYY-MM]
                    const config = getConfig($('#' + id).attr('element-config'));
        
                    const columnData = JSON.parse($('#' + id).attr('column-data'));
                    let render = $('#' + id).attr('render');
                    log("total_cus", render, "render", typeof render);
                    // replace all occurence of column-data with data from response
                    columnData.forEach(column => {
                        if (config && Object.keys(config).includes(column)) {
                            // render = render.replaceAll(`[${column}]`, useConfig(data, config, column, false));

                            render = render.replace(/`[${column}]`/g, useConfig(data, config, column, false));

                            // render = useConfig(data, config, column, true, data[column]);
                        }
                        else {
                            // render = render.replaceAll(`[${column}]`, data[column]);
                            render = render.replace(/`[${column}]`/g, data[column]);
                        }
                        
                    });
                    // attach id gotten from url to render
                    if (data.id != undefined) {
                        render = render.replaceAll('[row_id]', data['id']);
                    }
                    
                    // append custom row class if provided
                    if ($("#" + id).attr('row-class') != undefined) {
                        
                        $(row).attr('class', $("#" + id).attr('row-class'));
                    }
                    // else {
                    //     $(row).attr('class', ($(row).attr('class') + " " + $("#" + id).attr('row-class')));
                    // }
        
                    $(row).addClass('selected');
                    $(row).html(render)
                },   
                "columns": JSON.parse($("#" + id).attr('column-data')).map(column => {
                    return {"data": column}
                })
            } );
        
    })
}