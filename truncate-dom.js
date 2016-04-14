(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["truncateDom"] = factory();
	else
		root["truncateDom"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	
	module.exports = function (container, debug) {
	    var canvas = document.createElement('canvas');
	    var div = document.createElement('div');
	    var docFragment = document.createDocumentFragment();

	    var style = window.getComputedStyle(container);
	    var font = [
	        style['font-weight'],
	        style['font-style'],
	        style['font-size'],
	        style['font-family'],
	    ].join(' ');

	    docFragment.appendChild(canvas);
	    docFragment.appendChild(div);
	    var ctx = canvas.getContext('2d');
	    ctx.font = font;

	    function measureText (text) {
	        return ctx.measureText(text).width;
	    }

	    function tText (text, targetWidth) {
	        if (measureText(text) <= targetWidth) return text;

	        var width = 0;
	        var len = text.length;

	        for (var i=0; i<len && width<=targetWidth; i++) {
	            if (debug) console.log('text[i]=', i, text[i]);
	            width += measureText(text[i]);
	        }

	        return text.slice(0, i-1);

	    }

	    function tNode (node, targetWidth) {
	        if (measureText(node.textContent) <= targetWidth) return;

	        var width = 0;
	        var childNodes = node.childNodes;
	        var len = childNodes.length;

	        var childNode, childNodeWidth;

	        // process part1
	        for (var i=0; i<len && width<= targetWidth; i++) {
	             childNode = childNodes[i];
	             childNodeWidth = measureText(childNode.textContent);
	             width += childNodeWidth;
	             if (debug) console.log('=======================');
	             if (debug) console.log('childNode=', childNode);
	             if (debug) console.log('childNodeWidth=', childNodeWidth);
	             if (debug) console.log('width=', width);
	             if (debug) console.log('targetWidth=', targetWidth);
	        }

	        if (debug) console.log('--------------------');
	        // process part2
	        for (var j=len-1; j>=i; j--) {
	             var nodeToRemove = childNodes[j];
	             node.removeChild(nodeToRemove);
	             if (debug) console.log('removeChild', nodeToRemove);
	        }

	        // process part3: childNode
	        width -= childNodeWidth;

	        if (width === targetWidth) {
	             node.removeChild(childNode);
	             return;
	        }

	        var gap = targetWidth - width;

	        if (debug) console.log('++++++++++++++++');
	        if (debug) console.log('gap=', gap);
	        switch (childNode.nodeType) {
	            case 1: // Element
	                tNode(childNode, gap);
	                break;
	            case 3: // TextNode
	                childNode.textContent = tText(childNode.textContent, gap);
	                break;
	        }

	    }

	    function truncate (html, line, truncateText) {
	        debug = !!truncate.enableDebug;
	        html = html || '';
	        if (debug) console.log('origin html=', html);
	        html = html.replace(/\s+/g, ' ').trim();
	        if (debug) console.log('trimed html=', html);
	        line = line || 1;
	        truncateText = truncateText || '...';

	        div.innerHTML = html;

	        var ellipsisWidth = measureText(truncateText);
	        var containerWidth = container.offsetWidth - parseInt(container.style.borderLeftWidth) - parseInt(container.style.borderRightWidth);
	        var targetWidth = containerWidth * line - ellipsisWidth;

	        if (measureText(div.textContent) <= targetWidth) return div.innerHTML;

	        tNode(div, targetWidth);
	        return div.innerHTML + truncateText;
	    };

	    truncate.measureText = measureText;
	    return truncate;
	};


/***/ }
/******/ ])
});
;