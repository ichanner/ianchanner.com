const title = document.getElementById('title_input')
const text = document.getElementById('text')

function post(){

	axios.post("/post", {body: text.value, title: title.value}).then((res)=>{

		location.href = "/"
	});
}