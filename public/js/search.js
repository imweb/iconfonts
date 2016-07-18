var $searchForm = $('#search_form');
var ENTER_KEY = 13;
function searchHandler (event) {
    if (event.charCode === ENTER_KEY)
        $searchForm.submit();
}
$searchForm.keypress(searchHandler);