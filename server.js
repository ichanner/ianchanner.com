import express from "express"
import path from "path"
import {dirname} from 'path';
import dotenv from 'dotenv'
import crypto from 'crypto'
import {MongoClient} from "mongodb";
import {fileURLToPath} from 'url';
import jwt from "jsonwebtoken"
import { Blowfish } from 'egoroof-blowfish';

const env = dotenv.config()
const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
let db

MongoClient.connect(process.env.DB_URI,{ 
			
	useNewUrlParser: true, 
	useUnifiedTopology: true

}).then((conn)=>{

	db = conn.db('ianchanner')
})

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static(__dirname))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.listen(process.env.PORT || 3000, ()=>{

	console.log('Server initialized!')
})

app.post('/auth', async(req, res)=>{

	const {password, username} = req.body
	const bf = new Blowfish(process.env.SECRET_KEY);
	//const encoded_pswd = bf.encode(password)
	const user = await db.collection('users').findOne({username: username, password: password})
	if(user){

		jwt.sign({ role: user.role }, process.env.SECRET_KEY, (err, token)=>{

			res.json({token: token}).end()
		});
	}
	else{

		res.status(403).send()
	}
})



app.get('/login', (req, res)=>{

	res.sendFile(path.join(__dirname, "views", "login.html"))
})

app.get('/create', async(req, res)=>{

	res.sendFile(path.join(__dirname, "views", "create.html"))		
})

app.get('/edit/:id', async(req, res)=>{

	res.sendFile(path.join(__dirname, "views", "edit.html"))	
})

app.get('/', (req, res)=>{

	res.sendFile(path.join(__dirname, "views", "index.html"))
})	

app.get('/posts/:id', (req, res)=>{

	res.sendFile(path.join(__dirname, "views", "page.html"))
})

app.get('/count', async(req, res)=>{

	const count = await db.collection('articles').count()

	res.json(count)
})

app.get('/articles/:index', async(req, res)=>{

	const {index} = req.params
	const {first_time} = req.query
	const max = 10
	const skip = first_time == 'true' ? 0 : index
	const limit = first_time == 'true' ? (Number(index) < max ? max : index) : max
	
	//jwt.verify(token, process.env.SECRET_KEY, async(err, decoded)=>{

	//	if(err){

	//		res.status(403).send()
	//	}
	//	else{

			const articles = await db.collection('articles')
				.find({})
				.sort({date: -1})
				.skip(Number(skip))
				.limit(Number(limit))
				.toArray()

			res.json(articles)
		//}
	//})
	
})

app.get('/article/:id', async(req, res)=>{	

	const {id} = req.params 
	const {is_refresh} = req.query

	if(is_refresh=='false') await db.collection('articles').updateOne({id: id}, {$inc: {views: 1}} )
	
	const article = await db.collection('articles').findOne({id: id})

	res.json(article)
})
 
app.post('/post', async(req, res)=>{

	const {title, body, token} = req.body

	jwt.verify(token, process.env.SECRET_KEY, async(err, decoded)=>{

		if(!err && decoded.role == 'writer'){

			const id = crypto.randomBytes(5).toString('hex')
			const date = new Date().toLocaleTimeString('en-EN', {
				timeZone: 'EST', 
				hour: '2-digit',
				minute:'2-digit', 
				month:'numeric', 
				year:'numeric', 
				day:'numeric'
			});

			await db.collection('articles').insertOne({id: id, title: title, body: body, date: Date.now(), created_at: date , views: 0})

			res.end()
		}
		else{

			res.status(403).send()
		}
	})
})

app.patch('/edit/:id', async(req, res)=>{

	const {title, body, token} = req.body
	const {id} = req.params

	jwt.verify(token, process.env.SECRET_KEY, async(err, decoded)=>{

		if(!err && decoded.role == 'writer'){		

			await db.collection('articles').updateOne({id: id},  {$set: {title: title, body: body} })

			res.end()
		}
		else{

			res.status(403).send()
		}
	})
})

app.post('/comment', async(req, res)=>{

	const {id, comment, name} = req.body 

	await db.collection('articles').updateOne({id: id}, 

		{ comments: 

			{$push: {id: uuid(), name: name, comment: comment, reply: false, replies: []} 
		} 
	})

})

app.post('/reply', async(req, res)=>{

	const {id, comment_id, name, comment} = req.body 

	await db.collection('articles').updateOne({id: id}, 

		{
			$push: { 'comments.$[comment].replies': 

				{
					id: uuid(), name: name, comment: comment, reply: true, replies: []
				} 
		} 
	
	}, {arrayFilters:[{'comment.id': comment_id}]})
})

/*
app.get('/comments/:article_id/:comment_id', async(req, res)=>{

	const {article_id, comment_id} = req.params 

	if(comment_id == null){

		const comments = db.collection('articles').aggregate([

			{$match: {id: article_id}},

			{

				{$filter:{

					input: 'comments',
					as: 'comment',
					cond:{ $eq:[article_id, '$$comment.id'] }
				}}
			}
		])


	}
	else{

		const replies = db.collection('articles').aggregate([

			{$match: {id: article_id}},

			{

				{$filter:{

					input: 'comments',
					as: 'comment',
					cond:{ $eq:[comment_id, '$$comment.id'] }
				}}
			}
		])
	}

})

*/

app.use((req, res, next)=>{

	const error = new Error('Not Found')
	error['status'] = 404
	next(error)
})

app.use((err, req, res, next)=>{

	if(err.status == 404){

		res.send('<center>'+err.message+'</center>').status(err.status).end()
	}
	else{

		return next()
	}
		
})