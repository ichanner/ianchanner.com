const title = document.getElementById('title_input')
const text = document.getElementById('text')
const token = localStorage.getItem('token')

function post(){

	axios.post("/post", {body: text.value, title: title.value, token: token}).then((res)=>{

		location.href = "/"
	});
}