jQuery(document).ready(function($) {
    // Wrapping all tables with a wrapper to make large table scrollable on mobile.
    $( '#main table' ).wrap( '<div class="responsive-table"></div>' );
    // And load our datatables into the page.
    $( '#main table.sortable' ).tablesorter();
});
