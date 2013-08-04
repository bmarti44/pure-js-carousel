/*jslint devel: false, browser: true, maxerr: 50, indent: 4, white: false*/
/*global log: false, console: false, clearInterval: false, clearTimeout: false, document: false, event: false, frames: false, history: false, Image: false, location: false, name: false, navigator: false, Option: false, parent: false, screen: false, setInterval: false, setTimeout: false, window: false, XMLHttpRequest: false */

/**
 *	@description
 *		This file will control the carousel, and setup some common functions
 *	@author
 *		Brian Martin
 *	@version
 *		0.0.2
 *	@namespace
 *		YahooExercise
 */
(function (carousel) {
	'use strict';	// always put use strict at the top of the closure

	var log,	// local log function (Paul Irish version)
		yLib;

	/**
	 * @method
	 * @private
	 * @description
	 * Global log function
	 * Full Disclosure, this is stolen from Paul Irish
	 * Heavily modified by me to do correct reporting of where the error occurred
	 * http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
	 * @return void
	 */
	log = function () {
		var errorLog,
			stack = [];

		errorLog = new Error();

		if (typeof (window.console) !== 'undefined') {	// if a console is available
			log.histtory = [];

			try {

				if (log.history instanceof (Array)) {
					log.history.push(arguments);
				} else {
					log.history = [];		//keep a history of all our logs (WARNING! Possible memory leak)
				}

				console.log(Array.prototype.slice.call(arguments));
				// log the line the error ocurred at for FF and Chrome
				if (errorLog.stack !== 'undefined') {

					if (errorLog.stack.indexOf('@') >= 0) {
						stack = errorLog.stack.split('@');
					}

					if (!stack.length) {

						stack = errorLog.stack.split('\n');

					}
					// this works for FF and Chrome, not so much for Opera/Safari
					console.log(stack[stack.length - (stack.length - 2)]);
				}

			} catch (exception) {
				// don't print anything for safari/opera/IE, they don't like this
			}
		}

	};

	/**
	 * @class YCarousel
	 * @description Controls the main functionality for the carousel
	 * @param options An object literal of possible options
	 */
	function YCarousel(options) {
		// make sure this function gets initialized as a class
		if (!(this instanceof (YCarousel))) {
			return new YCarousel(options);
		}

		var initialize,
			setupListeners,
			module,
			element,
			cursorPosition,
			listItems,
			ulItem,
			itemWidth,
			originalOffset,
			recursiveLeft;

		/**
		 * @description initialize the YCarousel
		 * @private
		 * @method
		 * @constructor Not exactly a constructor, but the inception point for the class
		 * @return void
		 */
		initialize = function () {

			if (typeof (options) === 'undefined') {
				options = {};
			}

			if (typeof (options.visible) !== 'undefined') {
				options.visible = parseInt(options.visible, 10);
			} else {
				options.visible = 2;
			}

			if (typeof (options.selector) === 'undefined') {
				options.selector = '#carousel';
			}
			// assign a starting value for all the variables
			cursorPosition = 0;
			originalOffset = 0;
			recursiveLeft = 0;
			module.version = '0.0.1';
			element = yLib.select('#carousel');
			module.configure(options);

		};

		/**
		 * @description Sets the listners for the YCarousel
		 * @private
		 * @method
		 * @return void
		 */
		setupListeners = function () {
			yLib.unbind('#carousel', 'mouseout', module.stop);
			yLib.unbind(ulItem[0], 'mousedown', module.start);
			yLib.unbind(ulItem[0], 'mouseup', module.outofbounds);

			yLib.bind('#carousel', 'mouseout', module.outofbounds);
			yLib.bind(ulItem[0], 'mousedown', module.start);
			yLib.bind(ulItem[0], 'mouseup', module.stop);
		};

		// define our object literal to be use for the public functions
		module = module || {};

		/**
		 * @description This sets up/configures the YCarousel
		 * @public
		 * @method
		 * @param options An object literal of possible values (object)
		 * @return void
		 */
		module.configure = module.configure || function (options) {
			var width,
				i;

			if (typeof (options.selector) !== 'undefined') {
				element = yLib.select(options.selector);
			}

			width = element.clientWidth;
			listItems = element.getElementsByTagName('li');
			ulItem = element.getElementsByTagName('ul');

			itemWidth = (width / (typeof (options.visible) !== 'undefined' ? options.visible : 2)).toFixed(0);

			for (i = 0; i < listItems.length; i += 1) {
				listItems[i].style.width = itemWidth + 'px';
			}

			ulItem[0].style.width = ((itemWidth + options.widthOffset) * listItems.length) + 'px';

			setupListeners();

		};

		/**
		 * @description This controls the scrolling mechanism for the carousel
		 * @public
		 * @method
		 * @param event The event object (object)
		 * @return void
		 */
		module.scroll = module.scroll || function (event) {
			if (event.preventDefault) {
				event.preventDefault();
			} else {
				event.returnValue = false;
			}
			var i,
				offset;

			if (typeof (event.pageX) !== 'undefined') {
				offset = event.pageX;
		    } else {
				offset = event.clientX + document.body.scrollLeft;
			}

			offset = (originalOffset - offset - recursiveLeft) * -1;

			for (i = 0; i < listItems.length; i += 1) {
				listItems[i].style.left = offset + 'px';
			}

		};

		/**
		 * @description This sets up the listeners for the scroll method
		 * @public
		 * @method
		 * @param event The event object (object)
		 * @return void
		 */
		module.start = module.start || function (event) {
			if (event.preventDefault) {
				event.preventDefault();
			} else {
				event.returnValue = false;
			}

			if (typeof (event.pageX) !== 'undefined') {
				originalOffset = event.pageX;
		    } else {
				originalOffset = event.clientX + document.body.scrollLeft;
			}

			yLib.bind(ulItem[0], 'mousemove', module.scroll);
		};

		/**
		 * @description This tears down the listeners for the scroll method
		 * @public
		 * @method
		 * @param event The event object (object)
		 * @return void
		 */
		module.stop = function (event) {
			if (event.preventDefault) {
				event.preventDefault();
			} else {
				event.returnValue = false;
			}
			recursiveLeft = parseInt(listItems[0].style.left.replace('px', ''), 10);
			yLib.unbind(ulItem[0], 'mousemove', module.scroll);
		};

		/**
		 * @description This tears down the listeners if you move the mouse out of bounds
		 * @public
		 * @method
		 * @param event The event object (object)
		 * @return void
		 */
		module.outofbounds = function (event) {
			if (event.preventDefault) {
				event.preventDefault();
			} else {
				event.returnValue = false;
			}

			// this if would be much better if I passed in the parent dynamically
			if (event.relatedTarget && event.relatedTarget.id === "content") {
				recursiveLeft = parseInt(listItems[0].style.left.replace('px', ''), 10);
				yLib.unbind(ulItem[0], 'mousemove', module.scroll);
			}
		};

		try {
			initialize();	// initialize all our variables
			return module;	// return our object literal
		} catch (exception) {
			log(exception);		// something went wrong, log it safely
		}
	}

	/**
	 * @class YLib
	 * @description Super simple class to handle common functionality
	 */
	function YLib() {
		// make sure this function gets intialized as a class
		if (!(this instanceof (YLib))) {
			return new YLib();
		}

		var initialize,
			module;

		/**
		 * @description initialize our YLib "Library"
		 * @private
		 * @method
		 * @constructor Not exactly a constructor, but the inception point for the class
		 * @return void
		 */
		initialize = function () {
			module.version = '0.0.1';
		};

		// define our object literal for the class
		module = module || {};

		/**
		 * @description This will bind events to elements for the YCarousel
		 * @public
		 * @method
		 * @param event Either a string selector, or an object (string or object)
		 * @param eventName The name of the even (string)
		 * @return void
		 */
		module.bind = function (selector, eventName, eventHandler) {
			var element;
			// this won't work if you use new String('some string') but for brevity, i'm only going to do 
			// the type check
			if (typeof (selector) === 'string') {
				element = yLib.select(selector);
			} else {
				element = selector;
			}

			if (typeof (element.addEventListener) !== 'undefined') {
				element.addEventListener(eventName, eventHandler, true);
				return true;
			}

			if (typeof (element.attachEvent) !== 'undefined') {
				element.attachEvent('on' + eventName, eventHandler);
				return true;
			}

			return false;

		};

		/**
		 * @description This will unbind events from elements for the YCarousel so we don't get memory leaks
		 * @public
		 * @method
		 * @param event Either a string selector, or an object (string or object)
		 * @param eventName The name of the even (string)
		 * @param eventHandler The function to execute on the event (function)
		 * @return void
		 */
		module.unbind = function (selector, eventName, eventHandler) {
			var element;
			// this won't work if you use new String('some string') but for brevity, i'm only going to do 
			// the type check
			if (typeof (selector) === 'string') {
				element = yLib.select(selector);
			} else {
				element = selector;
			}

			if (typeof (element.removeEventListener) !== 'undefined') {
				element.removeEventListener(eventName, eventHandler, true);
				return true;
			}

			if (typeof (element.detachEvent) !== 'undefined') {
				element.detachEvent('on' + eventName, eventHandler);
				return true;
			}

			return false;

		};

		/**
		 * @description This will take in a CSS selector and return an element
		 * @public
		 * @method
		 * @param event A string selector, does not support an object (string)
		 * @return void
		 */
		module.select = function (selector) {

			if (typeof (document.querySelector) !== 'undefined') {
				return document.querySelector(selector);
			}
			// i don't have time to do anything but just select it by ID if the browser doesn't support querySelector
			return document.getElementById(selector.replace('#', ''));

		};

		try {
			initialize();	// kick everything off
			return module;	// return the object literal
		} catch (exception) {
			log(exception);
		}
	}
	// define our YLib instance
	yLib = new YLib();

	// no need to worry about onReady, we're handling that in the loader
	carousel = new YCarousel({
		'selector': '#carousel',
		'visible': 2,
		'widthOffset': 20
	});

}(window.YCarousel = window.YCarousel || {}));	// this allows for other scripts to perform patching and hot fixes
