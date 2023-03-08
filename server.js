import express from "express"
import path from "path"
import {dirname} from 'path';
import dotenv from 'dotenv'
import crypto from 'crypto'
import {MongoClient} from "mongodb";
import {fileURLToPath} from 'url';
import cors from "cors"
import requestIp from "request-ip"

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

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.set('views', __dirname)
app.use(express.static(__dirname));
app.set('view engine', 'jade')
app.set('trust proxy', true)

app.listen(process.env.PORT || 3000, ()=>{

	console.log('Server initialized!')
})

app.get('/create', (req, res)=>{

	res.sendFile(path.join(__dirname, "/create.html"))
})

app.get('/', (req, res)=>{

	res.sendFile(path.join(__dirname, "/index.html"))
})	

app.get('/posts/:id', (req, res)=>{

	res.sendFile(path.join(__dirname, "/page.html"))
})

app.get('/count', async(req, res)=>{

	const count = await db.collection('articles').count()

	res.json(count)
})

app.get('/articles/:index', async(req, res)=>{

	const {index} = req.params
	const {first_time} = req.query 
	const skip = first_time == 'true' ? 0 : index
	const limit = first_time == 'true' ? (Number(index) < 10 ? 10 : index) : 10
		
	const articles = await db.collection('articles')
	.find({})
	.sort({date: -1})
	.skip(Number(skip))
	.limit(Number(limit))
	.toArray()

	res.json(articles)
})

app.get('/article/:id', async(req, res)=>{	

	const {id} = req.params 

	await db.collection('articles').updateOne({id: id}, {$inc: {views: 1}} )
	const article = await db.collection('articles').findOne({id: id})

	res.json(article)
})
 
app.post('/post', async(req, res)=>{

	const {title, body} = req.body
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
})

app.use((req, res, next)=>{

	const error = new Error('Not Found')
	error['status'] = 404
	next(error)
})

app.use((err, req, res, next)=>{

	if(err.status == 404){

		res.send('<center>'+err.message+'</center>').status(err.status)
	}
	else{

		return next()
	}
		
})