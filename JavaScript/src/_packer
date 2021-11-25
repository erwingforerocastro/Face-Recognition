(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
        (global = global || self, factory(global.MvfyHsv = global.MvfyHsv || {}));
}(this, (function(exports) {

    'use strict';

    /**  
     * @license
     * MvFy HSV: Modulo de seguridad visual
     *
     * Copyright©Erwing Fc ~ erwingforerocastro@gmail.com All Rights Reserved.
     *
     *
     * Date: 2020-09-04
     */

    const environment;

    function isBrowser() {
        return typeof window === 'object' &&
            typeof document !== 'undefined' &&
            typeof HTMLImageElement !== 'undefined' &&
            typeof HTMLCanvasElement !== 'undefined' &&
            typeof HTMLVideoElement !== 'undefined' &&
            typeof ImageData !== 'undefined' &&
            typeof CanvasRenderingContext2D !== 'undefined';
    }

    function isNodejs() {
        return typeof global === 'object' &&
            typeof require === 'function' &&
            typeof module !== 'undefined'
            // issues with gatsby.js: module.exports is undefined
            // && !!module.exports
            &&
            typeof process !== 'undefined' && !!process.version;
    }

    function getEnv() {
        if (!environment) {
            throw new Error('getEnv - environment is not defined, check isNodejs() and isBrowser()');
        }
        return environment;
    }

    function setEnv(env) {
        environment = env;
    }

    function initialize() {
        // check for isBrowser() first to prevent electron renderer process
        // to be initialized with wrong environment due to isNodejs() returning true
        if (isBrowser()) {
            setEnv(createBrowserEnv());
        }
        if (isNodejs()) {
            setEnv(createNodejsEnv());
        }
    }

    function createNodejsEnv() {

    }

    function createBrowserEnv() {}

    const env = {
        getEnv: getEnv,
        setEnv: setEnv,
        initialize: initialize,
        createBrowserEnv: createBrowserEnv,
        createNodejsEnv: createNodejsEnv,
        isBrowser: isBrowser,
        isNodejs: isNodejs
    };

    initialize();




})));