
const password = document.getElementById('password')

function login(){

	if(password.value.length == 0){

		alert("Please enter a password")
	}
	else{

		axios.post("/auth", {password: password.value}).then((res)=>{

			localStorage.setItem('is_auth', true)

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