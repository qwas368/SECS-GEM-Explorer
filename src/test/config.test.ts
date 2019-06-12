import * as assert from 'assert';
import { getConfiguration, cfg } from '../config';

suite("Configuration Tests", function () {
    // Defines a Mocha unit test
    test("getConfiguration", function() {
        assert.equal(cfg().hideUnusedS6F11, getConfiguration().hideUnusedS6F11);
        assert.notEqual(cfg(), undefined);
    });
});