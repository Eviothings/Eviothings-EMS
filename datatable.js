$(document).ready(function() {
    $('#example').DataTable( {
        "ajax": {
            "url": "http://localhost:1880/test",
			"type" : "POST",
            "dataSrc": ""
        },
        "columns": [
            { "data": "R_Phase_Current" },
            { "data": "Y_Phase_Current" },
            { "data": "B_Phase_Current" }
        ]
    } );
} );

