
const name = document.getElementById('name')
const wit = document.getElementById('wit')

function post(){

	axios.post("/giveaway", {name: name.value, wit: wit.value}).then((res)=>{

		location.href = "/"
	});
}