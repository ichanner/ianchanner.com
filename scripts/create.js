const title = document.getElementById('title_input')
const text = document.getElementById('text')
const token = localStorage.getItem('token')

function post(){

	axios.post("/post", {body: text.value, title: title.value, token: token}).then((res)=>{

		location.href = "/"
	
	}).catch((err)=>{

			if(err.response){

				if(err.response.status == 403){

					alert('Please login as a writer with your proper username and password')
				}
			}
	})
}