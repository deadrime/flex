"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var Store = /** @class */ (function () {
    function Store(_a) {
        var state = _a.state, mutations = _a.mutations, persisted = _a.persisted;
        var _this = this;
        this.mutations = mutations;
        this.state = state;
        this.listeners = [];
        if (persisted && localStorage) {
            this.persisted = persisted.map(function (i) {
                if (typeof i === 'string') {
                    var property = i;
                    return {
                        property: property,
                        set: function (key, value) { return localStorage.setItem(key, JSON.stringify(value)); },
                        get: function (key) { return JSON.parse(String(localStorage.getItem(key))); }
                    };
                }
                else {
                    return i;
                }
            });
            this.persisted.forEach(function (i) {
                var finded = i.get(i.property);
                if (finded) {
                    _this.state[i.property] = i.get(i.property);
                }
            });
        }
    }
    Store.prototype.run = function (action, args) {
        var prevState = this.state;
        var newState = lodash_1.cloneDeep(this.state);
        var result = this.mutations[action](newState, args);
        this.state = newState;
        if (this.persisted && localStorage) {
            this.persisted.forEach(function (i) {
                if (!lodash_1.isEqual(prevState[i.property], newState[i.property])) {
                    i.set(i.property, newState[i.property]);
                }
            });
        }
        this.listeners.forEach(function (cb) {
            cb(newState, prevState);
        });
        return result;
    };
    Store.prototype.getState = function () {
        return lodash_1.cloneDeep(this.state);
    };
    Store.prototype.subscribe = function (newListener) {
        this.listeners.push(newListener);
    };
    Store.prototype.unsubscribe = function (cb) {
        this.listeners.splice(this.listeners.indexOf(cb), 1);
    };
    return Store;
}());
exports.Store = Store;
exports.default = Store;
