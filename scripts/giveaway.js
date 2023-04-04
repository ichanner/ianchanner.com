
const name = document.getElementById('name')

function post(){

	axios.post("/giveaway", {name: name.value}).then((res)=>{

		location.href = "/"
	});
}