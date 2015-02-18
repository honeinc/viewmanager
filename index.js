'use strict';

var EventEmitter = require( 'eventemitter2' ).EventEmitter2;

module.exports = ViewManager;

function ViewManager( options ) {
    var self = this;
    options = options || {};

    EventEmitter.call( this );
    self.views = {};
    self.options = options;
    self.options.showClass = options.showClass || 'show';
    self.options.hideClass = options.hideClass || '';
}

ViewManager.prototype = Object.create( EventEmitter.prototype, {
    viewList: {
        get: function() {
            var self = this;
            return Object.keys( self.views ).map( function _mapView( id ) {
                return self.views[ id ];
            } );
        }
    }
} );

ViewManager.prototype.add = function( id, view ) {
    var self = this;
    
    if ( !id || !view ) {
        self.emit( 'error', new Error( 'An id and view must be specified when adding a view.' ) );
        return false;
    }
    
    if ( self.views[ id ] ) {
        self.emit( 'error', new Error( 'Duplicate id when adding view to ViewManager: ' + id ) );
        return false;
    }

    self.views[ id ] = view;
    return true;
};

ViewManager.prototype.remove = function( id ) {
    var self = this;
    var view = self.views[ id ];

    if ( !view ) {
        return false;
    }
    delete self.views[ id ];
    return true;
};

ViewManager.prototype.open = function( id ) {
    var self = this;

    var view = self.views[ id ];
    if ( !view ) {
        return false;
    }

    self._closeAll();
    
    if ( self.options.showClass ) {
        view.classList.add( self.options.showClass );
    }
    
    if ( self.options.hideClass ) {
        view.classList.remove( self.options.hideClass );
    }
};

ViewManager.prototype._closeAll = function() {
    var self = this;
    self.viewList.forEach( function _close( view ) {
        if ( self.options.showClass ) {
            view.classList.remove( self.options.showClass );
        }
        
        if ( self.options.hideClass ) {
            view.classList.add( self.options.hideClass );
        }
    } );
};
