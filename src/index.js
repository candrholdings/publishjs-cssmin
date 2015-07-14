!function (cssmin, path, util) {
    'use strict';

    var number = util.number,
        replaceMultiple = util.regexp.replaceMultiple,
        time = util.time;

    module.exports = function (inputs, outputs, callback) {
        var that = this;

        inputs.deleted.forEach(function (filename) {
            outputs[filename] = null;
        });

        inputs = inputs.newOrChanged;

        Object.getOwnPropertyNames(inputs).forEach(function (filename) {
            var startTime = Date.now(),
                original = inputs[filename],
                minified;

            try {
                minified = processFile(filename, original.toString());
            } catch (ex) {
                that.log('Failed to process ' + filename + ' due to ' + ex.message);
                throw ex;
            }

            if (minified) {
                var minifiedBuffer = outputs[filename] = new Buffer(minified);

                that.log([
                    'Minified ',
                    filename,
                    ', took ',
                    time.humanize(Date.now() - startTime),
                    ' (',
                    number.bytes(original.length),
                    ' -> ',
                    number.bytes(minifiedBuffer.length),
                    ', ',
                    (((minifiedBuffer.length / original.length) - 1) * 100).toFixed(1),
                    '%)'
                ].join(''));
            } else {
                outputs[filename] = original;
            }
        });

        callback(null, outputs);
    };

    function processFile(filename, content) {
        var extname = (path.extname(filename) || '').toLowerCase();

        if (extname === '.html' || extname === '.htm') {
            return processHTML(content);
        } else if (extname === '.css') {
            return processCSS(content);
        }
    }

    function processHTML(text) {
        return replaceMultiple(
            text,
            [
                [
                    /((?:<style [^>]*?type=")(?:text\/css)(?:"[^>]*>))([\s\S]*?)(<\/style>)/gmi,
                    function (match0, match1, match2, match3, index, input) {
                        return match1 + cssmin(match2) + match3;
                    }
                ]
            ]
        );
    }

    function processCSS(code) {
        return cssmin(code);
    }
}(
    require('cssmin'),
    require('path'),
    require('publishjs').util
);