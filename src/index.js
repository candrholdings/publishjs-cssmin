!function (cssmin, number, time) {
    'use strict';

    module.exports = function (inputs, outputs, callback) {
        var that = this;

        inputs = inputs.newOrChanged;

        Object.getOwnPropertyNames(inputs).forEach(function (filename) {
            var startTime = Date.now(),
                original = inputs[filename],
                minified = outputs[filename] = new Buffer(cssmin(original.toString()));

            that.log([
                'Minified ',
                filename,
                ', took ',
                time.humanize(Date.now() - startTime),
                ' (',
                number.bytes(original.length),
                ' -> ',
                number.bytes(minified.length),
                ', ',
                (((minified.length / original.length) - 1) * 100).toFixed(1),
                '%)'
            ].join(''));
        });

        callback(null, outputs);
    };
}(
    require('cssmin'),
    require('./util/number'),
    require('./util/time')
);