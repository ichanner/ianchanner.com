
const password = document.getElementById('password')
const username = document.getElementById('useername')

function login(){

	if(password.value.length == 0){

		alert("Please enter a password")
	}
	else{

		axios.post("/auth", {password: password.value, username: username.value}).then((res)=>{

			localStorage.setItem('token', res.data.token)

			location.href = "/"
		
		}).catch((err)=>{

			if(err.response){

				if(err.response.status == 403){

					alert('Invalid password!')
				}
			}
		})
	}
}