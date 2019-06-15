import * as assert from 'assert';
import { getConfiguration, cfg } from '../config';
import * as vscode from 'vscode';
import update from 'ramda/es/update';
import { async } from 'rxjs/internal/scheduler/async';

suite("Configuration Tests", function () {
    // Defines a Mocha unit test
    test("getConfiguration", function() {
        let cfg1 = cfg();
        assert.equal(cfg1.hideUnusedS6F11, getConfiguration().hideUnusedS6F11);
        assert.notEqual(cfg(), undefined);
    });
});