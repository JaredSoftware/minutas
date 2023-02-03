import config from "./config.json" assert { type: "json" };
$(document).ready(function () {
	$('#myTable').DataTable();
});

console.log(config);

$("#add").click(() => {
	var name = $("#name").val()
	var last = $("#last").val()

	if (name == "" || last == "") {
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'Agregue los datos!'
		})
	} else {

		var settings = {
			"url": `/add`,
			"method": "POST",
			"timeout": 0,
			"headers": {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			"data": {
				"email": name,
				"password": last
			}
		};

		$.ajax(settings).done(function (response) {
			window.location.reload()
		});

	}
});

$("#update").click(() => {
	var name = $("#nameUP").val()
	var last = $("#lastUP").val()
	var numero = $("#numeroUP").val()

	if (name == "" || last == "" || numero == "Selecione uno") {
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'Something went wrong!',
			footer: '<a href="">Why do I have this issue?</a>'
		})
	} else {
		var settings = {
			"url": `/update`,
			"method": "POST",
			"timeout": 0,
			"headers": {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			"data": {
				"email": name,
				"password": last,
				"number": numero
			}
		};

		$.ajax(settings).done(function () {
			window.location.reload()
		});
	}
})
