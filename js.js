function decode(e){
	return decodeURIComponent(e)
}

let express = require("express")
let app = express()
let http = require("http")
 
let PORT = process.env.PORT || 80
let server = require("http").createServer(app).listen(PORT)

app.use(express.static('scripts'))
app.use(express.static('styles'))
app.use(express.static('imgs'))
app.use(express.static(__dirname))
app.set('view engine', 'ejs')

const mongoose = require('mongoose')
const Schema = mongoose.Schema

let mongo = require('./mongo')
let connectToMongoDb = async () => {
	await mongo().then(MongoClient => {
		try{
			console.log('Connected to mongoDB!')
		} finally{
			console.log("ok")
		}
	})
}
connectToMongoDb()

class Review{
	constructor(userName, text, date, mark){
		this.name = userName;//Mike
		this.text = text;//Here are tasty dishes
		this.date = date;//2021.04.12
		this.mark = mark;//from 1 to 5 
	}
}

const restScheme = new Schema({
    name: String,
    city: String,
    cuisine: String,
    rating: Number,// rating from marks of all reviews
    description: String,
    dishes: Array,
    bestDishes: Array,
    images: Array,
    address: String, 
    reviews: Array,
});

const Restaurant = mongoose.model("Restaurant", restScheme);

app.get("/", (req, res)=>{
	res.render('main', {})
})

app.get('/getRests', (req, res)=>{
	let times = req.headers['times']*5
		Restaurant.find({}, (err, docs)=>{
			let arr = docs.slice(+times, +times + +5)
			console.log(arr)
			res.send(JSON.stringify(arr))
			console.log(1111111111)
			if(err){console.log(err)}
		})
})

app.get('/getFilterRests', (req, res)=>{
	let filter = JSON.parse(decode(req.headers['filter']))
	let arr = []
	filter.forEach(e=>{
		if(e[1] != false){
			arr.push(e[0])
		}
	}) 

	let result = []
	arr.forEach(e=>{
		Restaurant.findOne({cuisine: e}, (err, docs)=>{
			if(docs != null){
				result.push(docs)
			}
		})
	})
	console.log(arr.length)
	let x = 0
	for(i=0;i<3;i++){
		if(arr[i] != undefined){
			x = 1
		}
	}
	if(x == 0){
		Restaurant.find({}, (err, docs)=>{
			result = docs
			console.log(result)
			console.log(docs)
			res.send(JSON.stringify(result))
		})
	}
	else{
		Restaurant.find({}, (err, docs)=>{
			console.log('length:' + arr.length)
			console.log(result)
			setTimeout(()=>{res.send(JSON.stringify(result))}, 100)
		})
	}
})

app.get('/searchRests', (req, res)=>{
	let text = decode(req.headers['text']).toLowerCase()
	console.log(text)
	if(text.replace(/\s/g, '') != ''){
		console.log(1)
		Restaurant.find({}, (err, docs)=>{
			console.log(2)
			let result = []
				console.log(3)
				docs.forEach(elem=>{
					let name = elem.name.toLowerCase()
					console.log(name + '  ' + text)
				    if(name.search(text) != -1){
				        result.push(elem)
				        console.log(232423234234)
			        }
			    })
            setTimeout(()=>{console.log(result);res.end(JSON.stringify(result))}, 300)
		})
	}
})

app.get('/getRecs', (req, res)=>{
	Restaurant.find({}, (err, docs)=>{
		docs.sort((a, b)=>{
			return b.rating - a.rating
		})
		setTimeout(()=>{res.end(JSON.stringify(docs))}, 300)
	})
})

