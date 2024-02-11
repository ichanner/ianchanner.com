
const password = document.getElementById('password')
const username = document.getElementById('username')

function login(){

	if (username.value.length == 0){

		alert("Please enter a username")
	}
	else if(password.value.length == 0){

		alert("Please enter a password")
	}
	else{

		axios.post("/signin", {username: username.value, password: password.value}).then((res)=>{

			localStorage.setItem('token', res.data)

			location.href = "/"
		
		}).catch((err)=>{

			if(err.response){

				if(err.response.status == 403){

					alert('Incorrect password or username!')
				}
			}
		})
	}
}