
/*
 * 
 */
var choreRepo = require( '../repositories/choreRepo' ).choreRepo;

exports.people = function ( req, res ) {
    var that = this;
    that.res = res;

    choreRepo.getPeople().then( function ( item, error ) {

        if ( error )
            console.log( error );

        if ( item )
            that.res.send( item );
        else
            that.res.send( [] );
    });
};

exports.list = function ( req, res ) {
    choreRepo.getChores().then( function ( item, error ) {

    if ( error )
        console.log( error );

    if ( item )
        res.send( item.chores );
    else
        res.send( [] );
    });
};
exports.assignments = function ( req, res ) { choreRepo.calcAssignments( res ); };
exports.save = function ( req, res ) { res.send( choreRepo.save( req.body ) ); };