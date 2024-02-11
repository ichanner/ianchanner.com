const title = document.getElementById('title_input')
const text = document.getElementById('text')
const url = new URL(window.location.href)
const paths = String(url).split('/')
const id = paths[paths.length-1]
const token = localStorage.getItem('token')


$(document).ready(function () {

	axios.get(`/article/${id}?is_refresh=false`).then((res)=>{

		title.value = res.data.title
		text.value = res.data.body
	})
})


function save(){

	axios.patch(`/edit/${id}`, {body: text.value, title: title.value, token: token}).then((res)=>{

		location.href = `/posts/${id}`
	}).catch((err)=>{

			if(err.response){

				if(err.response.status == 403){

					alert('Who told you about this page?')
				}
			}
	})
}