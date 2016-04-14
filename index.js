
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
        return ctx.measureText(text.replace(/\s+/g, ' ')).width;
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

        // process part2
        for (var j=len-1; j>=i; j--) {
             var nodeToRemove = childNodes[j];
             node.removeChild(nodeToRemove);
             if (debug) console.log('removeChild', nodeToRemove);
             if (debug) console.log('--------------------');
        }

        // process part3: childNode
        width -= childNodeWidth;

        if (width === targetWidth) {
             node.removeChild(childNode);
             return;
        }

        var gap = targetWidth - width;

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
        html = html || '';
        line = line || 1;
        truncateText = truncateText || '...';

        div.innerHTML = html;

        var ellipsisWidth = measureText(truncateText);
        var containerWidth = container.offsetWidth;
        var targetWidth = containerWidth * line - ellipsisWidth;

        tNode(div, targetWidth);

        return div.innerHTML + truncateText;
    };

    truncate.measureText = measureText;
    return truncate;
};
