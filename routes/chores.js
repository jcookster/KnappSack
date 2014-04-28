
/*
 * 
 */
var choreRepo = require( '../repositories/choreRepo' ).choreRepo;

exports.people = function ( req, res ) { choreRepo.getPeople( res ); };
exports.list = function ( req, res ) { choreRepo.getChores( res ); };
exports.assignments = function ( req, res ) { choreRepo.calcAssignments(res); };
exports.save = function ( req, res ) { res.send( choreRepo.saveChores( req.body ) ); };