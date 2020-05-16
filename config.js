$(document).ready(function () {

    var database = null;
    var starCountRef = null;
    var text = "";

    try {
        database = firebase.database();
        starCountRef = database.ref('test');
    } catch (err) {
        alert(err.message);
    }


    try {
        starCountRef.once('value', function (snapshot) {

            text = snapshot.val();
            $('#testTitle').text(text);
        });
    } catch (error) {
        alert(error.message)
    }



    $('#testTitle').text(text);
});