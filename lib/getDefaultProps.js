'use strict';

module.exports = function(){
    return {
        loading: false,
        columnMinWidth: 50,
        cellPadding: 5,
        scrollbarSize: 20,

        scrollBy: undefined,
        virtualRendering: true,

        styleAlternateRowsCls: 'z-style-alternate',
        withColumnMenuCls: 'z-with-column-menu',
        cellEllipsisCls: 'z-cell-ellipsis',
        defaultClassName: 'react-datagrid',

        withColumnMenu: true,
        sortable: true,
        filterable: true,
        resizableColumns: true,

        showCellBordersCls: 'z-cell-borders',
        showCellBorders: false,
        styleAlternateRows: true,
        cellEllipsis: true,
        rowHeight: 31,

        groupNestingWidth: 20,

        defaultStyle: {
            position: 'relative'
        }
    }
}