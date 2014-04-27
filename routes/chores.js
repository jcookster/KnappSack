
/*
 * GET chore listing.
 */
var choreRepo = require('../repositories/choreRepo').choreRepo;

exports.people = function(req, res) {res.send(choreRepo.getPeople(req.params.gid) );};
exports.list = function(req, res){ res.send(choreRepo.getChores(req.params.gid).chores); };
exports.assignments = function(req, res){ res.send(choreRepo.calcAssignments(req.params.gid) ); };
exports.save = function(req, res){ res.send(choreRepo.saveChores() ); };