const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Service Schema
const ServiceSchema = new Schema({
	date: { 
		type: Date,
		default: Date.now 
	},
	
	ori: {
		type: String,
		required: [true, 'El lugar de recojo es necesario']
	},
	dest: {
		type: String,
		required: [true, 'El lugar de destino es necesario']
	},
	desc: {
		type: String,
		required: [true, 'El servicio debe llevar observaciones']
	},
	status: {
		hora: Date,
		type: Boolean,
		default: true
	},// Boolean
	completed: {
		type: Boolean,
		default: false
	},
	meta:{
		applicant: String,
		driver: String,
		dni: String,
		hrRe: Date,
		hrEn: Date
	}
	

});

module.exports = mongoose.model('Services', ServiceSchema);

