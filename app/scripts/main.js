
$(document).ready(function () {
    setTimeout( function () {
        console.log('[main.js] ATTACH EVENTS');

        $('input').on('click', function (e) {
            e.preventDefault();
            $(this).select();
            return false;
        });

        console.log('[main.js] DONE ATTACHING EVENTS');
    }, 2000);
});
