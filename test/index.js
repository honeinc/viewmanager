'use strict';

var test = require( 'tape' );
var ViewManager = require( '..' );
var EventEmitter2 = require( 'eventemitter2' ).EventEmitter2;

test( 'testing ViewManager', function( t ) {
    t.equals( typeof ViewManager, 'function', 'ViewManager is exported as a function' );
    t.equals( typeof new ViewManager(), 'object', 'new instance of ViewManager is created when calling new' );
    t.equals( typeof new ViewManager().views, 'object', 'new ViewManager instance has a views object' );
    t.equals( Array.isArray( new ViewManager().viewList ), true, 'new ViewManager instance has a viewList array' );
    t.equals( new ViewManager() instanceof EventEmitter2, true, 'ViewManager is an instanceof an event emitter' );
    t.equals( typeof new ViewManager().options, 'object', 'new ViewManager instance has an options object' );
    t.end();
} );

test( 'testing ViewManager::add invalid view', function( t ) {
    var viewmanager = new ViewManager();

    viewmanager.on( 'error', function( err ) {
        t.equals( err instanceof Error, true, 'When an invalid view is added to an instance of ViewManager the error event is called and passes and error object' );
        t.end();
    });

    t.equals( viewmanager.add(), false, 'when adding a view to ViewManager via the add method if the view is not added the function will return false' );
});

test( 'testing ViewManager::add duplicate id', function( t ) {
    var viewmanager = new ViewManager();

    viewmanager.on( 'error', function( err ) {
        t.equals( err instanceof Error, true, 'When a view, with a duplicate id, is added to an instance of ViewManager the error event is called and passes and error object' );
        t.end();
    });

    viewmanager.add( 'foo', document.createElement( 'section' ) );
    viewmanager.add( 'foo', document.createElement( 'div' ) );
});

test( 'testing ViewManager::add', function( t ) {
    var viewmanager = new ViewManager( {
        showClass: 'shown',
        hideClass: 'hidden'
    } );
    
    var el = document.createElement( 'div' );
    el.classList.add( 'hidden' );
    
    t.equals( viewmanager.add( 'foo', el ), true, 'when adding a valid view to viewmanager using add the function will return true if successful' );
    t.equals( viewmanager.viewList[ 0 ], el, 'when a view is added to viewmanager using add the viewList should contain that view' );
    t.equals( typeof viewmanager.views.foo, 'object', 'when adding a view to viewmanager via add the view should be accessable from the views property by id' );
    
    viewmanager.open( 'foo' );
    t.equals( el.classList.contains( 'shown' ), true, 'when a view is shown, the showclass will be added' );
    t.equals( el.classList.contains( 'hidden' ), false, 'when a view is shown, the hideClass will be removed' );
    t.end();
});

test( 'testing ViewManager::remove', function( t ) {
    var viewmanager = new ViewManager( );
    var el = document.createElement( 'div' );

    viewmanager.add( 'foo', el );
    viewmanager.remove( 'foo' );

    t.equals( viewmanager.viewList.length, 0, 'when removing a previously added view it should be removed from the view list' );
    t.equals( typeof viewmanager.views.foo, 'undefined', 'when a previously added view is removed from the ViewManager.views cache' );
    t.end();
});
