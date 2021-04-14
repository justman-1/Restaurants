let mongoose = require('mongoose')
let mongoPath = 'mongodb+srv://new_admin:admin123@cluster0.7rahq.mongodb.net/restaurants?retryWrites=true&w=majority'
//mongodb+srv://new_admin:admin123@cluster0.7rahq.mongodb.net/restaurants?retryWrites=true&w=majority

module.exports = async () => {
	await mongoose.connect(mongoPath, {useNewUrlParser: true, useUnifiedTopology: true})
	return mongoose
}
