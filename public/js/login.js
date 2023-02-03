import config from "./config.json" assert { type: "json" };
$("#login").click(() => {
	const email = $("#email").val()
	const password = $("#password").val()

	if (email == "" || password == "") {
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'Rellena los datos!',
		})
	} else {
		var settings = {
			"url": `/login`,
			"method": "POST",
			"timeout": 0,
			"headers": {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			"data": {
				"email": email,
				"password": password
			}
		};

		$.ajax(settings).done(function (response) {
			if (response.login == true) {
				Swal.fire(
					'Good job!',
					'You clicked the button!',
					'success'
				)
				window.location.replace("/dashboard")
			} else {
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: 'Usuario Erroeno!',
				})
			}
		});
	}
});