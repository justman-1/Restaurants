function decode(e){
	return decodeURIComponent(e)
}

let express = require("express")
let app = express()
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = express.json();
let http = require("http")
let fs = require("fs")

let PORT = process.env.PORT || 80
let server = require("http").createServer(app).listen(PORT)


app.use(express.static('scripts'))
app.use(express.static('styles'))
app.use(express.static('imgs'))
app.use(express.static(__dirname))
app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
app.set('view engine', 'ejs')
app.listen(3000)


const mongoose = require("mongoose")
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
	constructor(userName, text, date, mark, logo, photoes){
		this.name = userName;//Mike
		this.text = text;//Here are tasty dishes
		this.date = date;//2021.04.12
		this.mark = mark;//from 1 to 5
		this.logo = logo;
		this.photoes = photoes//Array
	}
}

class Dish{
	constructor(name, description, image){
		this.name = name;
		this.description = description;
		this.image = image;
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
    delivery: Boolean,
    takeout: Boolean,
});
const userScheme = new Schema({
	firstName: String,
	lastName: String,
	email: String,
	password: String,
	image: String,
	restaurants: Array
})

const Restaurant = mongoose.model("Restaurant", restScheme);
const User = mongoose.model("User", userScheme);

app.get("/", (req, res)=>{
	res.render('main', {})
})

app.get('/getRests', (req, res)=>{
	let times = req.headers['times']*5
		Restaurant.find({}, (err, docs)=>{
			let arr = docs.slice(+times, +times + +5)
			arr.forEach(e=>{
				e = {name: e.name,
					cuisine: e.cuisine,
					rating: e.rating,
				  description: e.description,
					images: e.images}
					return e
			})
			console.log(arr)
			res.send(JSON.stringify(arr))
			console.log(1111111111)
			if(err){console.log(err)}
		})
})

app.get('/getFilterRests', (req, res)=>{
	let filter = JSON.parse(decode(req.headers['filter']))
	let deliveryFilter = JSON.parse(decode(req.headers['filter2']))
	let filt1 = []
	let filt2 = []
	filter.forEach(e=>{
		if(e[1] === true){
			filt1.push(e[0])
		}
	})
	deliveryFilter.forEach(e=>{
		if(e[1] === true){
			filt2.push(e[0])
		}
	})
	console.log(1111)
	setTimeout(()=>{
		let x = 0
	    let y = 0
	    console.log('filt1: ' + filt1.length)
	    console.log('filt2: ' + filt2.length)
	    let result2 = []
	    let result1 = []
		if(filt1.length < 1 && filt2.length < 1){
			Restaurant.find({}, (err, docs)=>{
				if(docs.length > 5){
					docs.length = 5
				}
				docs.forEach(e=>{
					e = {name: e.name,
						cuisine: e.cuisine,
						rating: e.rating,
					  description: e.description,
						images: e.images}
						return e
				})
				res.send(JSON.stringify(docs))
				console.log(222222)
			})
		}
		else if(filt1.length < 1 && filt2.length > 0){
			console.log(333333333)
			filt2.forEach(e=>{
				if(e == 'Delivery'){
					Restaurant.find({delivery: true}, (err, docs)=>{
						result2 = result2.concat(docs)
					})
				}
				else if(e == 'Takeout'){
					Restaurant.find({takeout: true}, (err, docs)=>{
						result2 = result2.concat(docs)
					})
				}
			})
			result2.forEach(e=>{
				e = {name: e.name,
					cuisine: e.cuisine,
					rating: e.rating,
				  description: e.description,
					images: e.images}
					return e
			})
			setTimeout(()=>{
				    res.send(JSON.stringify(result2))
			    }, 250)
		}
		else if(filt1.length > 0 && filt2.length < 1){
			filt1.forEach(e=>{
				Restaurant.find({cuisine: e}, (err, docs)=>{
					result1 = result1.concat(docs)
					console.log(docs)
					console.log(e)
					result1.forEach(e=>{
						e = {name: e.name,
							cuisine: e.cuisine,
							rating: e.rating,
						  description: e.description,
							images: e.images}
							return e
					})
				})
			})
			setTimeout(()=>{
				res.send(JSON.stringify(result1))
			}, 250)
			console.log(4444444444)
		}
		else if(filt1.length > 0 && filt2.length > 0){
			filt1.forEach(e=>{
				Restaurant.find({cuisine: e}, (err, docs)=>{
					result1 = result1.concat(docs)
					console.log(docs)
					console.log(e)
				})
			})
			filt2.forEach(e=>{
				if(e == 'Delivery'){
					Restaurant.find({delivery: true}, (err, docs)=>{
						result2 = result2.concat(docs)
					})
				}
				else if(e == 'Takeout'){
					Restaurant.find({takeout: true}, (err, docs)=>{
						result2 = result2.concat(docs)
					})
				}
			})
			setTimeout(()=>{
				console.log(555555)
				let result3 = []
				result1.forEach(e=>{
					result2.forEach(e2=>{
						if(e.name == e2.name){
							result3.push(e)
						}
					})
				})
				setTimeout(()=>{
					result3.forEach(e=>{
						e = {name: e.name,
							cuisine: e.cuisine,
							rating: e.rating,
							description: e.description,
							images: e.images}
							return e
					})
					res.send(JSON.stringify(result3))
				}, 250)
			}, 150)
		}
	}, 30)
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
            setTimeout(()=>{
							console.log(result)
							result.forEach(e=>{
								e = {name: e.name,
									cuisine: e.cuisine,
									rating: e.rating,
									description: e.description,
									images: e.images}
									return e
							})
							res.end(JSON.stringify(result))}, 300)
		})
	}
})

app.get('/getRecs', (req, res)=>{
	Restaurant.find({}, (err, docs)=>{
		if(docs.length > 10){
			docs.length = 10
		}
		docs.sort((a, b)=>{
			return b.rating - a.rating
		})
		docs.forEach(e=>{
			e = {name: e.name,
				cuisine: e.cuisine,
				rating: e.rating,
				description: e.description,
				images: e.images}
				return e
		})
		setTimeout(()=>{res.end(JSON.stringify(docs))}, 300)
	})
})

app.get('/restaurant', urlencodedParser, (req, res)=>{
	res.render('restaurant')
})

app.get("/getRest", (req, res)=>{
	let name = decode(req.headers['name'])
	Restaurant.findOne({name: name}, (err, docs)=>{
		res.send(JSON.stringify(docs))
		console.log(docs)
	})
})

app.get('/signup', (req, res)=>{
	let name1 = decode(req.headers['firstname'])
	let name2 = decode(req.headers['lastname'])
	let email = decode(req.headers['email'])
	let password = decode(req.headers['password'])
	User.find({}, (err, docs)=>{
		let x = 0
		docs.forEach(e=>{
			if(e.email === email){
				res.send({
					type: 'Error',
					text: 'A user with this email already exists'
				})
				x = 1
			}
		})
		setTimeout(()=>{
			if(x == 0){
				let user = new User({
					firstName: name1,
	                lastName: name2,
	                email: email,
	                password: password,
	                image: 'none',
	                restaurants: []
				})
				user.save((err)=>{
					if(err){console.log(err)}
						res.send(JSON.stringify({
							type: 'user',
							firstName: name1,
	                        lastName: name2,
	                        email: email,
	                        password: password,
	                        image: 'none',
	                        restaurants: []
						}))
				})
			}
		}, 100)
	})
})

app.get('/login', (req, res)=>{
	let email = decode(req.headers['email'])
	let password = decode(req.headers['password'])
	User.find({}, (err, docs)=>{
		let x = 0
		docs.forEach(e=>{
			if(e.email === email){
				x = 1
				if(e.password == password){
					console.log(e)
					res.send(JSON.stringify({
						type: 'user',
						firstName: e.firstName,
	                    lastName: e.lastName,
	                    email: e.email,
	                    password: e.password,
	                    image: e.image,
	                    restaurants: e.restaurants
					}))
				    x = 1
				}
				else{
					res.send(JSON.stringify({
					    type: 'Error',
					    text: 'Wrong password'
				    }))
				}
			}
		})
		setTimeout(()=>{
			if(x === 0){
				res.send(JSON.stringify({
					type: 'Error',
					text: 'There is no user with such email'
				}))
			}
		}, 50)
	})
})

app.get("/feed", (req, res)=>{
	res.render("profile")
})

app.post('/changeImage', jsonParser, (req, res)=>{
	let image = req.body.image
	let email = req.body.email
	User.updateOne({email: email}, {image: image}, (err)=>{
		res.send()
	})
})

app.post("/changeName", (req, res)=>{
	let name1 = req.body.name1
	let name2 = req.body.name2
	let email = req.body.email
	User.updateOne({email: email}, {firstName: name1, lastName: name2}, (err)=>{
		if(err){console.log(err)}
	})
})

app.post("/addToCollection", (req, res)=>{
	let email = req.body.email
	let rest = req.body.rest
	User.findOne({email: email}, (err, docs)=>{
		let rests = docs.restaurants
		rests.push(rest)
		User.updateOne({email: email}, {restaurants: rests}, (err)=>{})
	})
})

app.post("/removeFromCollection", (req, res)=>{
	let email = req.body.email
	let rest = req.body.rest
	User.findOne({email: email}, (err, docs)=>{
		let rests = docs.restaurants
		for(i=0;i<rests.length;i++){
			if(rests[i] == rest){
				rests.splice(i, 1)
			}
		}
		setTimeout(()=>{
			User.updateOne({email: email}, {restaurants: rests}, ()=>{})
		}, 20)
	})
})

app.get('/getOneRest', (req, res)=>{
	let name = decode(req.headers['rest'])
	Restaurant.findOne({name: name}, (err, docs)=>{
		res.send(docs)
	})
})

app.post("/sendReview", jsonParser, (req, res)=>{
	console.log(req.body)
	console.log('dsafdadsfdsafdfaadfadfsadfs')
	Restaurant.findOne({name: req.body.rest}, (err, docs)=>{
		let reviews = docs.reviews
		reviews.unshift(req.body.review)
		let rating = 0
		for(i=0;i<reviews.length;i++){
			rating = +rating + +reviews[i].mark
			console.log(rating)
			console.log(reviews[i].mark)
			if(i == reviews.length - 1){
				rating = rating/reviews.length
			}
		}
		rating = rating.toPrecision(2)
		Restaurant.updateOne({name: req.body.rest}, {reviews: reviews, rating: rating}, ()=>{})
		res.send('ok')
	})
})

app.get('/admin_panel', (req, res)=>{
	res.render('admin')
})

app.post('/addRestaurant', (req, res)=>{
	let data = req.body
	let rest = new Restaurant({
		name: data.name,
        city: data.city,
        cuisine: data.cuisine,
        rating: 0,
        description: data.description,
        dishes: data.dishes,
        bestDishes: data.bestDishes,
        images: data.images,
        address: data.address,
        reviews: data.reviews,
        delivery: data.delivery,
        takeout: data.takeout,
	})
	rest.save(()=>{
		res.send('ok')
	})
})
