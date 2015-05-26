!function (assert, path) {
    'use strict';

    require('vows').describe('Integration test').addBatch({
        'When minifying a CSS file': {
            topic: function () {
                var callback = this.callback,
                    topic;

                require('publishjs')({
                    cache: false,
                    log: false,
                    processors: {
                        cssmin: require('../index')
                    }
                }).build(function (pipe) {
                    pipe.from(path.resolve(path.dirname(module.filename), 'integration-test-files'))
                        .cssmin()
                        .run(callback);
                }, callback);
            },

            'should returns a minified copy': function (topic) {
                assert.equal(Object.getOwnPropertyNames(topic).length, 1);
                assert.equal(topic['default.css'].buffer.toString(), 'html,body{font-family:Arial}');
            }
        }
    }).export(module);
}(
    require('assert'),
    require('path')
);