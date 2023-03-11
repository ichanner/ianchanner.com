const container = document.getElementById('container')
const title = document.getElementById('title')
const reads = document.getElementById('reads')
const url = new URL(window.location.href)
const paths = String(url).split('/')
const id = paths[paths.length-1]

function loadArticle(is_refresh){

	axios.get('/article/'+id+'?is_refresh='+is_refresh).then((res)=>{

		title.appendChild(document.createTextNode(res.data.title))
		reads.appendChild(document.createTextNode(res.data.views + " Views"))
 		date.appendChild(document.createTextNode(res.data.created_at))

		container.innerHTML = res.data.body
	})
}

$(document).ready(function () {

	const type = performance.navigation.type

	if (type === 0) {
		
		loadArticle(false)
	}
	else{

		loadArticle(true)
	}
  
});