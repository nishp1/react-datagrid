'use strict';

module.exports = function(){
    return {
        loading: false,
        columnMinWidth: 50,
        cellPadding: '0px 5px',
        headerPadding: '10px 5px',
        filterIconColor  : '#6EB8F1',
        menuIconColor    : '#6EB8F1',
        scrollbarSize: 20,

        scrollBy: undefined,
        virtualRendering: true,

        styleAlternateRowsCls: 'z-style-alternate',
        withColumnMenuCls: 'z-with-column-menu',
        cellEllipsisCls: 'z-cell-ellipsis',
        defaultClassName: 'react-datagrid',

        withColumnMenu: true,
        sortable: true,

        filterable: null,
        resizableColumns: null,
        reorderColumns: null,

        emptyCls: 'z-empty',
        emptyTextStyle: null,
        emptyWrapperStyle: null,

        loadMaskOverHeader: true,

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