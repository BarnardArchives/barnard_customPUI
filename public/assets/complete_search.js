/* 
 * A set of functions, some new, others that override or extend existing 
 * ArchivesSpace's search functionality specifically for Barnard College.
 * 
 * @file        Provides search support overrides and new functions.
 * @since       2019-02-07 (Y-M-D)
 * @author      Benjamin Rosner (@br2490 on github)
 * @version     1.0.25
 * @supported   ArchivesSpace v2.5.0
 * 
 */

var fn_removeSearchRow = function(e){
    e.stopPropagation;
    // Remove the entire row.
    $(this).parents(".search_row").remove();
    // Always ALWAYS ensure that there is an add row button available.
    $('.add_row').last().parent().show();
    return false;
}

var fn_addSearchRow = function(e){
    e.stopPropagation;
    var $row = new_row_from_template();

    // Handle pressing CR in search.
    $row.find("input[name='q\[\]']").keypress(function (e) {
        var key = e.which;
        if (key == 13) {
            $("#submit_search").click();
            return false;
        }
    });

    // create the new row
    $(this).parents('.search_row').after($row);
    // remove the add button from the previous row
    $(this).parents(".add_search_row").hide();
    
    // focus the search new search box
    $row.find("input[name='q\[\]']").focus();

    return false;
}

function initialize_search() {
    $as = $("#advanced_search");
    // add minus row buttons and click event.
    $as.find('.search_row').each(function(i) {
        new_button($(this), $as.find('.search_row').length - 1 == i);
    });
    /* then save the first_row, so we don't always have to find it */
    var $first = $($as.find("#search_row_0"));
    
    $template = $first.clone();
    $template.find(':input').each(function() {
        if ($(this).is('select')) {
            $(this).find('option[selected]').removeAttr('selected');
        } else {
            $(this).val(''); // empty all row values
        }
    });
    $template.find(".norepeat").each(function() { $(this).empty(); });
    $template.find(".hidden").each(function() {$(this).removeClass("hidden"); });
    $template.find("#op0").removeProp("disabled"); /* the disabled boolean operator */
    $template.find("#op0").val('AND');
    $template.find("#op_").remove();

    $first.find("#q0").keypress(function (e) {
        var key = e.which;
        if (key == 13) {
            $("#submit_search").click();
            return false;
        }
    });
    
    // hide the first remove button.
    $first.find(".plusminus").remove();

    // squash whitespace in rows     
    $first.find('> .col-sm-1:first').hide();
    // Change size to span on first row:
    $first.find('> .col-sm-3:first').addClass('col-sm-7').removeClass('col-sm-3');
    
    // The rest can't be as big:
    $template.find('> .col-sm-3.norepeat').remove();
    $template.find('> .col-sm-3:first').addClass('col-sm-6').removeClass('col-sm-3');

    return true;
}

function new_button($row, show_add) {
    var $minus = $row.find(".plusminus");
    var $add = $row.find(".add_row");
    $(".add_row").parent().hide();
    $minus.html("<button class='btn btn-default' title='" + minusText + "'><i aria-hidden='true' class='" + minusFACss + "'></i></button>");
    if (show_add) {
        $add.parent().show();
    } else {
        $add.parent().hide();
    }
    $minus.find("button").click(fn_removeSearchRow);
    $add.find("button").click(fn_addSearchRow);
    return true;
}

$(function( ) {
    $('#submit_search').on('click',
        function( e ) {
            $("input[name='from_year[]']").val($("input[id='from_year_all'").val());
            $("input[name='to_year[]']").val($("input[id='to_year_all").val());
        } );
});
