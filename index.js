
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

    function tText (text, targetWidth, containerWidth) {
        if (measureText(text) <= targetWidth) return text;

        var deviation = Math.ceil(targetWidth / containerWidth);

        var width = 0;
        var len = text.length;

        for (var i=0; i<len && width<=targetWidth; i++) {
            width += measureText(text[i]);
            if (debug) console.log('text[i]=', i, text[i]);
        }

        if (debug) console.log('deviation=', deviation);
        return text.slice(0, i-deviation);

    }

    function tNode (node, targetWidth, containerWidth) {
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

        // if no childNode left
        if (i === 0) return;

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
                tNode(childNode, gap, containerWidth);
                break;
            case 3: // TextNode
                childNode.textContent = tText(childNode.textContent, gap, containerWidth);
                break;
        }

    }

    function truncate (html, line, truncateText, element) {
        debug = !!truncate.enableDebug;
        html = html || '';
        if (debug) console.log('origin html=', html);
        html = html.replace(/\s+/g, ' ').trim();
        if (debug) console.log('trimed html=', html);
        line = line || 1;
        truncateText = truncateText || '...';

        div.innerHTML = html;

        var ellipsisWidth = measureText(truncateText);

        var containerWidth = container.offsetWidth;
        var targetWidth = containerWidth * line - ellipsisWidth;

        var innerHTML;
        if (measureText(div.textContent) <= targetWidth) {
            innerHTML = div.innerHTML;
            if (element) element.innerHTML = innerHTML;
            return innerHTML;
        }

        tNode(div, targetWidth, containerWidth);
        innerHTML =  div.innerHTML + truncateText;
        if (element) {
            element.innerHTML = innerHTML;
            refine(element, line, truncateText);
        };
        return innerHTML;
    };

    function getTextNode (node, callback) {
        switch (node.nodeType) {
            case 1: // Element
                var childNodes = node.childNodes;
                for (var i=childNodes.length-1; i>=0; i--) {
                    var childNode = childNodes[i];
                    getTextNode(childNode, callback);
                }
                break;
            case 3: // TextNode
                callback(node);
        }
    }

    function getTextNodes (node) {
        var textNodes = [];
        getTextNode(node, function(textNode){
            textNodes.push(textNode);
        });
        return textNodes;
    }

    function refine (element, line, truncateText) {

        var html = element.innerHTML;
        element.innerHTML = 't';
        var lineHeight = element.offsetHeight;
        element.innerHTML = html;

        var targetHeight = line * lineHeight;
        var offsetHeight = element.offsetHeight;

        if (offsetHeight <= targetHeight) return;

        var textNodes = getTextNodes(element);
        var len = textNodes.length;

        if (debug) console.log('textNodes=', len, textNodes);

        // process last textNode
        var textNode = textNodes[0];
        var textContent = textNode.textContent;

        for (var j=textContent.length-1-truncateText.length; j>=0 && offsetHeight > targetHeight; j--) {
            textNode.textContent = textContent.slice(0, j) + truncateText;
            offsetHeight = element.offsetHeight;
        }

        // process others
        for (var i=1; i<len; i++) {
            textNode = textNodes[i];
            textContent = textNode.textContent;

            for (var j=textContent.length-1; j>=0 && offsetHeight > targetHeight; j--) {
                textNode.textContent = textContent.slice(0, j);
                offsetHeight = element.offsetHeight;
            }
        }

    }

    truncate.getTextNodes = getTextNodes;
    truncate.refine = refine;

    truncate.measureText = measureText;
    return truncate;
};
