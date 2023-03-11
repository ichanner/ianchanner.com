var index = 0;
var count = 0;
const load_button =  document.getElementById('load')
const container = document.getElementById('blog')	

function createPreview(title, id){

	const div = document.createElement('div')
	const br = document.createElement('br')
	const link = document.createElement('a')
	const name = document.createTextNode(title)

	div.appendChild(link)
	link.href = '/posts/' + id
	link.appendChild(name)
	container.appendChild(br)
	container.appendChild(div)
}

function loadPreviews(first_time){

	const next = first_time ? (Number(sessionStorage.getItem('index')) || 0) : index

	axios.get('/articles/'+next.toString()+'?first_time='+first_time).then((res)=>{

		res.data.forEach((article, i)=>{
		
			index+=1;
			if(count-1 == index) load_button.remove()
			sessionStorage.setItem('index', index)
			createPreview(article.title, article.id)

			if(i == res.data.length-1){

				if (sessionStorage.getItem("scroll") != null) {

			        $(window).scrollTop(sessionStorage.getItem("scroll"));
			    }
			}
		})
	})
}

$(document).ready(function () {

  	$(window).on("scroll", function() {

        sessionStorage.setItem("scroll", $(window).scrollTop());
    });
  
});

axios.get('/count').then((res)=>{

	count = res.data;
	loadPreviews(true)
})
