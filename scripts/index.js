var index = 0;
var count = 0;
var last_day = null;
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

			const date = new Date(article.created_at)
			const today = new Date().toLocaleDateString('en-EN', {timeZone: 'EST', day:'numeric'})
			const day = date.getDate()
			
			if(day != last_day){

			    container.appendChild(document.createElement('br'))

			    if(last_day){

				//const hr = document.createElement('hr')
				//container.appendChild(hr)
			    }

			   // const date_header = document.createElement('p')
			    //date_header.setAttribute('class', 'center')

			    const date_break = document.createElement('div')
			    const date_text = day == today ? 'Today' : article.created_at.split(',')[0]
			    const text_node = document.createTextNode(date_text)

			    date_break.setAttribute('class', 'hr-sect')
			    date_break.appendChild(text_node)

			   // date_header.appendChild(document.createTextNode(recent_text))
			   // container.appendChild(date_header)

			    container.appendChild(date_break)
			   
			    createPreview(article.title, article.id)
			    last_day = day
			}
			else{

			    createPreview(article.title, article.id)
			}

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
