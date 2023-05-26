module.exports = app => {

	let userRoute = require('./user/user.routes')
	let contact = require("./contact/contact.routes")	


	
	app.use('/api/v1/user', userRoute)
	app.use('/api/v1/contact', contact)
	
}
