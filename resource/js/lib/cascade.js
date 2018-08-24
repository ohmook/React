/**
 * Library Belt
 * newriseupjs 2.0
 * IE >= 9
 * @creator OhMook
 * @since 17.06.08
 * @version 2.8.0
 */
(function (exports) {
    "use strict"

    var _types = ['object',
            'array',
            'function',
            'string',
            'number',
            'boolean',
            'date',
            'regExp',
            'json'],
        _doms = ['window',
            'HTML.+?Element'],
        _props = ['length'],
        /* cache */
        _obj = exports.Object,
        _arry = exports.Array,
        _arryp = _arry.prototype;


    /* is */
    function isEqual(o, t) {
        return equal(o, function () {
            return t
        });
    }

    function isClass(o, k) {
        return equal(toClass(o), function () {
            return '[object '.concat(toCapitalize(k), ']');
        });
    }

    function toType(o) {
        return (toClass(o).match(/^\[object\s(\w+)\]$/)[1]).toLowerCase();
    }


    function isFunction(f) {
        return typeof f === _types[2];
    }

    function isString(o) {
        return isClass(o, _types[3]);
    }



    function isNumber(o) {
        return typeof o === _types[4] && isFinite(o);
    }

    function isBoolean(o) {
        return isClass(o, _types[5]);
    }

    function isArray(a) {
        if (_arry.isArray) {
            return _arry.isArray(a);
        }
        return isClass(a, _types[1]);
    }


    function isPair(o) {
        if (!isArray(o)) {
            return false;
        }
        return every(o, function (vo) {
            return isArray(vo) &&
                vo.length === 2 &&
                vo[0] &&
                exist(vo[1]);
        })
    }

    function isObject(o) {
        return exist(o) && typeof o === _types[0];
    }

    function isMap(o) {
        return isClass(o, _types[0]);
    }

    function isRegExp(o) {
        return isClass(o, _types[7]);
    }

    function isWindow(o) {
        return isClass(o, _doms[0]);
    }

    function isDOM(o) {
        var len = _doms.length,
            cls = toClass(o);

        while (len) {
            if (cls.search(new RegExp(_doms[--len])) > -1) {
                return true;
            }
        }
        return false;
    }

    function isEmpty(o) {
        return exist(o) && nonest(first(o));
    }

    function isInstance(f) {
        var fis = finfo(f),
            fname = fis.shift().toLowerCase();

        return not(some)(_types, function (v) {
            return v === fname;
        })
    }

    function isProp(v) {
        var len = _props.length;

        while (len) {
            if (_props[--len] === v) {
                return true;
            }
        }
        return false;
    }

    /* to */
    function toClass(o) {
        return _obj.prototype.toString.call(o);
    }

    function toArray(o, i, l) {
        if (nonest(o.length)) {
            return toPair(o).slice(i, l);
        }
        return _arryp.slice.call(o, i, l);
    }

    function toRegExp(v) {
        return isRegExp(v) && v || new RegExp('^'.concat(v, '$'));
    }

    function toCapitalize(s) {
        return first(s).toUpperCase() + rest(s);
    }

    /* Abstract */
    function exist(t) {
        return t != null;
    }

    function nonest(t) {
        return t == null;
    }

    function truth(t) {
        return (t !== false) && exist(t);
    }

    function untruth(t) {
        return nonest(t) || t === false;
    }

    function trim(d) {
        return rtrim(ltrim(d));
    }

    function ltrim(d) {
        return d && d.replace(/^\s+/, '');
    }

    function rtrim(d) {
        return d && d.replace(/\s\s*$/, '');
    }

    /**
     * Each
     * @since 17.06.27
     * @param {Object}
     * @param {Function(value,index, object)}
     * @param {Object} this
     * @method
     */
    function each(o, f, sf) {
        var rst;

        if (o.forEach) {
            o.forEach(function (v) {
                if (nonest(rst) &&
                    !isProp(v)) {
                    rst = f.apply(this, arguments);
                }
            }, sf);
        } else {
            for (var oi in o) {
                if (!o.hasOwnProperty(oi) ||
                    isProp(oi)) {
                    continue;
                }

                if (nonest(rst)) {
                    rst = f.call(sf, o[oi], oi, o);
                } else {
                    return rst;
                }
            }
        }
        return rst
    }

    /**
     * loop
     * @since 17.06.29
     * @param {Object|Array}
     * @param {Function}
     * @param {Function}
     * @abstract
     */
    function loop(o, f, sf) {
        if (isArray(o)) {
            var rst;

            for (var i = 0, l = o.length; l > i; i++) {
                if (nonest(rst)) {
                    rst = f.call(sf, o[i], i, o);
                } else {
                    return rst;
                }
            }
            return rst;
        } else {
            /* object */
            return each.apply(sf, arguments);
        }
    }

    function alway(v) {
        return function () {
            return v;
        }
    }

    function defalue(o, deft) {
        return exist(o) ? o : deft;
    }

    function or() {
        return dispatch.apply(this, toArray(arguments));
    }

    function and() {
        return partial(condition.apply(this, toArray(arguments)), alway(true));
    }

    /**
     * Object Add and Replace
     * @since 17.07.26
     * @param {Object|Array|Function}
     *    destination reference
     * @param {Object} addition
     * @abstract
     */
    function extend(o) {

        if (not(or(isObject,
            isFunction,
            isWindow))(o)) {
            return o;
        }

        loop(rest(arguments), function (ov) {
            each(ov, function (v, k) {
                o[k] = v;
            })
        });
        return o;
    }

    /**
     * Execute Function when True
     *
     * @since 17.06.23
     * @param {Boolean} Execute True
     * @param {Object} [optional] function parameters
     * @abstract
     */
    function when(o, f) {
        return function () {
            return truth(o) && f.apply(null, toArray(arguments));
        }
    }

    function is(o, to) {
        var isnot = not(isObject);

        if (isnot(o) ||
            isnot(to)) {
            return false;
        }

        var gen = generate([o, to],
            function (os) {
                var second = os[1];

                return every(os[0], function (v, k) {
                    return second[k];
                });
            },
            function (os) {
                return concat(os).reverse();
            });

        return !!(exist(o) &&
            exist(to) &&
            o.constructor === to.constructor &&
            gen.head() &&
            gen.tail().head());
    }

    /**
     * Equal
     * @since 17.06.26
     * @param {Object}
     * @param {Function}
     * @return {Function}
     */
    function equal(o, f) {
        var rst = f();
        return o === rst || is(o, rst);
    }

    function not(f) {
        return function () {
            return !f.apply(f, arguments);
        }
    }

    /**
     * Empty
     * @since 17.07.24
     * @param {All}
     *    new Instance support
     * @abstract
     */
    function empty(o) {
        if (nonest(o)) {
            return o;
        }

        var constrt = o.constructor;
        return isInstance(constrt) ? constrt : constrt();
    }

    function trampoline(o) {
        var rst = o.apply(o, rest(arguments));

        while (isFunction(rst)) {
            rst = rst();
        }
        return rst;
    }

    /**
     * Map
     * @since 17.06.27
     * @param {Object|Array}
     * @param {Function}
     */
    function map(o, f, sf) {
        if (o.map) {
            return o.map(f, sf);
        } else {
            /* {Object} */
            var rst = empty(o);
            each(o, function (v, i) {
                rst[i] = f.apply(sf, arguments);
            });
            return rst;
        }
    }

    function filter(o, f, sf) {
        if (o.filter) {
            return o.filter(f, sf);
        } else {
            var rst = empty(o),
                r;
            each(o, function (v, i) {
                if (truth(r = f.apply(sf, arguments))) {
                    rst[i] = r;
                }
            });
            return rst;
        }
    }

    /**
     * toPair Object -> Array {a:'a', b:'b'} -> [['a', 'a'], ['b', 'b']]
     *
     * @since 17.06.26
     * @param {Object}
     * @param {Boolean} isDeep
     * @method
     */
    function toPair(o, b) {
        if (!isObject(o)) {
            return o;
        }

        var rst = [];

        each(o, function (v, k) {
            rst.push([k, truth(b) && trampoline(curry(toPair, v)) || v]);
        });
        return rst;
    }

    /**
     * if function parameter null -> default value
     *
     * @since 17.07.01
     * @param {Function}
     * @params {Parameters}
     * @method
     */
    function fnull(f) {
        var defs = rest(arguments),
            dlen = defs.length;

        return function () {
            var args = toArray(arguments),
                len = Math.max(dlen, args.length);

            for (var i = 0; len > i; i++) {
                args[i] = exist(args[i]) &&
                    args[i] ||
                    defs[i];
            }
            return f.apply(null, args);
        }
    }

    function some(o, f, sf) {
        if (o.some) {
            return o.some(f);
        } else {
            return !!each(o, function () {
                if (truth(f.apply(sf, arguments))) {
                    return true;
                }
            });
        }
    }

    function every(o, f, sf) {
        if (o.every) {
            return o.every(f);
        } else {
            return not(each)(o, function () {
                if (!truth(f.apply(sf, arguments))) {
                    return true;
                }
            });
        }
    }

    function partial(f) {
        var ps = rest(arguments);

        return function () {
            return f.apply(f, ps.concat(toArray(arguments)));
        }
    }

    function bind(f, o) {
        var ps = toArray(arguments, 2),
            func;

        if (f.bind) {
            return f.bind.apply(f, concat(o, ps))
        }

        func = function () {
            return f.apply(o, ps.concat(toArray(arguments)));
        }

        func.prototype = undefined;
        return func;
    }

    function compose() {
        var funcs = toArray(arguments);

        return function () {
            var len = funcs.length,
                rst = funcs[--len].apply(this, arguments);

            while (len--) {
                rst = funcs[len].call(this, rst);
            }
            return rst;
        }
    }

    /**
     * Clone
     * 1. new Instance not Support
     * @since 17.07.14
     * @param {Array|Object|Function, ..}
     * @param {Boolean} Deepth
     * @return {Object} Result Copy
     * @abstract
     */
    function clone(o) {

        if (!isObject(o) && !isFunction(o)) {
            return o;
        }

        var newo = empty(o);

        each(o, function (v, k) {
            newo[k] = trampoline(partial(clone, v));
        });
        return newo;
    }

    function dispatch() {
        var funcs = toArray(arguments);

        return function () {
            var args = arguments,
                self = this,
                rst;

            some(funcs, function (f) {
                return f && (rst = f.apply(self, args));
            });
            return rst;
        }
    }

    /**
     * Concat
     * @since 17.06.26
     * @param {ALL, ..}
     * @return {Array}
     * @abstract
     */
    function concat() {
        return _arryp.concat.apply([], arguments);
    }

    /**
     * Push
     * @since 17.07.24
     * @param {Object|Array|String}
     * @param {String} Value
     * @param {String} Key
     * @abstract
     */
    function push(o) {
        var rst = empty(o);

        return function (v, k) {
            if (isObject(o)) {
                rst = copy(o);
                rst[k] = v;
            } else {
                rst = String.prototype.concat.call(o, v);
            }
            return rst;
        }
    }

    /**
     * First
     *
     * @since 17.07.17
     * @params {Object|Array}
     * @return {Object|Array}
     * @abstract
     */
    function first(o) {
        return nth(o, 0);
    }

    function second(o) {
        return nth(o, 1);
    }

    function nth(o, idx) {
        var len = 0;

        return each(o, function (v, i) {
            if (idx === len++) {
                return o[i]
            }
        });
    }

    function size(o) {
        if (o.length) {
            return o.length;
        }

        var len = 0;

        each(o, function () {
            len++;
        });
        return len;
    }

    function invoke(mn, f) {
        return function (o) {
            var res = rest(arguments);

            f = o[mn] || f;
            return f.apply(o, res);
        }
    }

    function isa(k, f) {
        return function (o) {
            var res = rest(arguments),
                /* unary */
                v

            if (exist(v = o[k])) {
                return !!f.apply(null, concat(v, k, res))
            }
            return false;
        }
    }

    function flat(arry) {
        if (isArray(arry)) {
            return concat.apply(concat, map(arry, flat));
        }
        return arry;
    }

    function curry(f) {
        var vars = rest(arguments);

        return function () {
            return f.apply(f, concat(toArray(arguments), vars));
        }
    }

    function curries(f) {
        return function (second) {
            return function (first) {
                return f.call(f, first, second);
            }
        }
    }

    /**
     * Merge
     *
     * @since 17.06.29
     * @param {All}
     * @param {ALL}
     * @method
     */
    function merge(o) {
        if (!isObject(o)) {
            return o;
        }
        return extend.apply(null, concat([extend(empty(o), o)], rest(arguments)));
    }

    /**
     * Shllow Copy
     * @since 17.11.07
     * @param {All}
     * @param {ALL}
     * @method
     */
    function copy(o) {
        return merge(o);
    }

    /**
     * Union
     * @since 17.11.02
     * @param P1 {Object|Function|Window}
     * @param P2 {Object|Function|Window}
     * @param {Function({P2 Property}, {P2 Value}){P1}}
     * @method
     */
    function union(o, d, f) {

        if (not(or(isObject,
            isFunction,
            isWindow))(o)) {
            return o;
        }

        var isf = f || function () {
            return false;
        };

        return reduce(1)(d, function (co, v, k) {

            if (nonest(co[k]) || isf.call(co, v, k)) {
                co[k] = v;
            }
            return co;
        }, copy(o));
    }

    function visit(refs) {
        return function (o) {
            var co = copy(o);

            return reduce(1)(refs, function (cf, nf) {
                cf = nf(cf);
                return cf;
            }, co);
        }
    }

    function visits(mf) {
        var refs = rest(arguments),
            o = refs.pop(),
            func = visit(refs);

        if (!isObject(o)) {
            return func(o);
        }
        return func(map(o, mf));
    }

    /**
     * Rest Arguments
     *
     * @since 17.06.29
     * @param {All}
     * @param {Function}
     * @method
     */
    function rest(o) {

        if (or(nonest,
            isFunction)(o)) {
            return o;
        }

        var len = 1;

        if (isObject(o)) {
            if (exist(o.length)) {
                return toArray(o, len);
            }
            return reduce(1)(o, function (cv, nv, k) {
                if (len++ > 1) {
                    cv[k] = nv;
                }
                return cv;
            }, empty(o));
        }
        return String.prototype.slice.call(o, len);
    }

    /**
     *  inherit
     * Function Base
     * @since 17.07.27
     * @param {Object} Destination
     * @return {Object} Childs
     * @abstrict
     */
    function inherit(o) {

        if (!isFunction(o)) {
            return create(o);
        }

        var vars = rest(arguments),
            instance = function () {
                this.constructor.apply(this, vars);
            }

        instance.prototype = o.prototype;
        instance.prototype.constructor = o;
        return new instance;
    }

    /**
     * create
     * Object Base
     * @since 17.07.27
     * @param {Object} Destination
     * @param {Object} DefineProperty
     * @return {Object} Childs
     * @abstrict
     */
    function create(o, auth) {

        if (_obj.create) {
            return _obj.create.call(null, o, auth);
        }

        var instance = function () {
            },
            /* unary */
            newi;

        instance.prototype = o;
        instance.prototype.constructor = o.constructor;

        newi = new instance;
        role(newi, auth);
        return newi;
    }

    function pipeline(o) {
        return visit(rest(arguments))(o);
    }

    function condition() {
        var valifs = toArray(arguments);

        return function (f) {
            var res = rest(arguments),
                rst = false;

            if (every(valifs, function (vf) {
                rst = vf.apply(this, res);
            }, this)) {
                rst = f.apply(this, res);
            }
            return rst;
        }
    }

    function others() {
        var funcs = toArray(arguments);

        return function (f) {
            var res = rest(arguments),
                rst = res;

            if (not(every)(funcs, function (vf) {
                rst = vf.apply(this, rst);
            }, this)) {
                rst = f.apply(this, res);
            }
            return rst;
        }
    }

    /**
     * Function info
     *
     * @since 17.06.13
     * @param {Function}
     * @return {Array} unnamed : ['', argument, ..] named : [function name,
     *         argument, ..]
     * @method
     */
    function finfo(o) {

        if (!isFunction(o)) {
            return [];
        }
        /**
         * 0 : full function 1 : function name 2 : parameter string
         */
        var funs = o.toString().match(/^[\s\(]*function\s*([^(]*)\(([^)]*)\)/);

        return concat(funs[1], funs[2]
            .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
            .replace(/\s+/g, '').split(','));
    }

    /**
     * Generate
     * @since 17.07.17
     * @param {Function} Head
     * @param {Function} Tail
     * @return {Object} {head: , tail:, }
     * @abstract
     */
    function generate(o, hf, tf) {

        return {
            head: function () {
                return hf.apply(this, concat([o], toArray(arguments)));
            },
            tail: function () {
                return generate(tf.apply(this, concat([o], toArray(arguments))), hf, tf);
            }
        }
    }

    /**
     * toMap
     * @since 17.07.17
     * @param {Array|Primitive}
     * @param {Boolean} isDeep
     * @return {Object}
     * @method
     *  [VAL1, VAL2] -> {0 : VAL1, 1 : VAL2}
     *  [[VAL1, VAL2]] -> {VAL1 : VAL2}
     *  [[VAL1, VAL2], [VAL3, VAL5]] -> {VAL1 : VAL2, VAL3 : VAL5}
     */
    function toMap(as, isd) {
        var init = {};

        if (nonest(as)) {
            return init;
        }

        return reduce(1)(as, toMap.method.toPair(as, isd), init);
    }

    toMap.method = {
        ofunc: function (cv, nv, k) {
            cv[k] = nv;
            return cv;
        },
        toPair: function (as, isd) {
            var f = this.ofunc;
            if (isPair(as)) {
                var func = f;

                f = function (cv, nv) {
                    var n = nv[1];
                    return func(cv, (truth(isd) && isArray(n) ? trampoline(curry(toMap, [n])) : n), nv[0]);
                }
            }
            return f;
        }
    }

    /**
     * Reducs
     * @since 17.06.27
     * @param {Array} [Object, Function, init]
     * @factory
     */
    function reduce(m) {
        var method = reduce.method;

        return function (o, f, init) {
            var param = {
                mode: m,
                obj: o,
                func: f,
                init: init
            };

            if (!isArray(o)) {
                return method.object(param);
            }
            return method.array(param);
        }
    }

    function validator(msg, f) {

        function func() {
            return f.apply(fn, arguments);
        }

        func.message = msg;
        return func;
    }

    function validate() {
        var funcs = toArray(arguments);

        return function () {
            var args = arguments;

            return reduce(1)(funcs, function (cf, nf) {
                if (!truth(nf.apply(null, args))) {
                    cf.push(nf.message);
                }
                return cf;
            }, []);
        }
    }

    /**
     * Contain/Notain
     *
     * @since 17.06.13
     * @param {Object/Array}
     * @param {Array}
     *            finder ex : [{a:'a'}, "a", ['a','b']]
     * @method
     */
    function contain(m) {
        var meths = contain.method,
            sof = meths.func(m);

        return function (o, as) {
            var context = partial(meths.inspect, sof, as);
            return reduce(1)(o, context, empty(o))
        }
    }

    /**
     * Contains/Notains
     *
     * @since 17.07.18
     * @param {Object/Array}
     * @param {Array}
     *        primitive varags finder ["a", 1, true]
     * @method
     */
    function contains(m) {
        var meths = contain.method,
            sof = contain.method.func(m);

        return function tain(o, as) {
            var context = partial(meths.inspect, sof, as),
                rst;

            return reduce(1)(o, function (cv, nv, k) {

                if (isObject(nv)) {
                    rst = trampoline(partial(tain, nv, as));

                    if (size(rst)) {
                        cv[k] = rst;
                    }
                } else {
                    context.apply(meths, arguments);
                }
                return cv;
            }, empty(o))
        }
    }

    /* method */
    contain.method = {

        func: function (m) {
            var sof = isEqual;

            if (m < 0) {
                sof = not(sof);
            }
            return sof;
        },

        inspect: function (sof, as, cv, nv, k) {
            var isf = partial(sof, nv);

            if (some(as, function (v) {
                return isf(v);
            })) {
                if (isArray(cv)) {
                    cv.push(nv);
                } else {
                    cv[k] = nv;
                }
            }
            return cv;
        }
    }

    /**
     * set Define Property
     * @since 17.06.16
     * @param {Object|Array}
     * @return {Object} [Optional]
     *        default: freeze writable, enumerable,
     *            configrable, extensible, value{set, get}
     * @abstract
     */
    function role(o, opt) {

        if (!isObject(o)) {
            return o;
        }

        if (opt) {
            role.method.patch(o)(opt);

            each(o, function (v, i) {
                _obj.defineProperty(o, i, opt);
            });
        }
    }

    role.method = {

        auths: ['writable',
            'enumerable',
            'configrable',
            'extensible',
            'sealable ',
            'freesible',
            'value',
            'set',
            'get'],

        success: function (k, o) {
            _obj.preventExtention(o);
            delete o[k];
            return true;
        },

        patch: function (o) {
            var self = this;

            // freesible
            return dispatch(
                isa(self.auths[5], function (v, k) {

                    if (truth(v)) {
                        _obj.freeze(o);
                        return self.success(k, o);
                    }
                    return false;
                }),
                // sealable
                isa(self.auths[4], function (v, k) {

                    if (truth(v)) {
                        _obj.seal(o);
                        return self.success(k, o);
                    }
                    return false;
                }),
                // extensible
                isa(self.auths[3], function (v, k) {

                    if (truth(v)) {
                        return self.success(k, o);
                    }
                    return false;
                }));
        }
    }

    reduce.method = {

        native: function (obj, os, m) {
            var f = os[0],
                i = 0;

            os[0] = function (c, n) {
                return f.call(undefined, c, n, i++, obj);
            };

            if (m > 0) {
                return _arryp.reduce.apply(obj, os);
            } else {
                return _arryp.reduceRight.apply(obj, os);
            }
        },
        /**
         * Reducs Apply Array
         * @since 17.06.23
         * @param {String}
         *        1: left, 2: right
         * @method
         */
        array: function (o) {
            var os = [],
                obj = o.obj,
                func = o.func,
                init = o.init,
                m = o.mode;

            if (exist(init)) {
                os = [init];
            }

            if (obj.reduce && !o.type) {
                return this.native(obj, [func].concat(os), m);
            } else {
                /* {Object} */
                var /* unary */
                    rst,
                    len,
                    i,
                    il;

                os = os.concat(obj);
                rst = os.shift();
                len = os.length;

                i = -Math.floor((len - ((len - 1) * m)) / 2);
                len = Math.ceil((len + ((len - 1) * m)) / 2);

                for (; len > i; i++) {
                    il = Math.abs(i);
                    rst = func.call(null, rst, os[il], il, os);
                }

                return rst;
            }
        },
        valueOf: function (vs) {
            var rst = empty(vs);

//			if(vs && vs[0] && vs[1]){
//				rst[vs[0]] = vs[1];
//			}else{
            rst = vs;
            //}
            return rst;
        },

        object: function (o) {
            var obj = toPair(o.obj),
                f = o.func,
                self = this;

            o.obj = obj;
            o.type = _types[0];
            o.func = function (cv, nv, i, os) {
                return f.call(null,
                    cv,
                    nv[1],
                    nv[0],
                    os);
            }
            return this.array(o);
        }
    }

    function valueOf(obj, val) {
        var costrt = obj.constructor;
        return isInstance(costrt) ? new costrt(val) : costrt(val);
    }

    function replace(dest, sap, rep) {
        if (nonest(dest)) {
            return dest;
        }

        var dst = [],
            rst;

        if (isObject(dest)) {
            dst = copy(dest);
        } else {
            dst.push(dest);
        }

        rst = map(dst, function (val, key) {
            if (isObject(val)) {
                return trampoline(replace, val, sap, rep);
            }
            return valueOf(val, val.toString().replace(new RegExp(sap, 'g'), rep));
        })

        if (isObject(dest)) {
            return rst;
        } else {
            return rst[0];
        }
    }

    var fn = function (exports) {

            return (
                extend(
                    function (fst) {
                        if (isFunction(fst)) {
                            return dom.ready(fst);
                        }
                        return dom.apply(null, arguments);
                    },
                    {
                        map: map, each: each, filter: filter,
                        reduce: reduce(1), reduceRight: reduce(-1), some: some,
                        every: every, toPair: toPair, role: role,
                        create: create, inherit: inherit, when: when,
                        fnull: fnull, rest: rest, loop: loop,
                        isa: isa, isEqual: isEqual, isEmpty: isEmpty,
                        toArray: toArray, validate: validate, validator: validator,
                        dispatch: dispatch, partial: partial, curry: curry,
                        bind: bind, condition: condition, compose: compose,
                        contain: contain(1), notain: contain(-1), nth: nth,
                        contains: contains(1), notains: contains(-1), exist: exist,
                        flat: flat, extend: extend, union: union,
                        concat: concat, clone: clone, visits: visits,
                        first: first, second: second, trim: trim,
                        generate: generate, toMap: toMap, isDOM: isDOM,
                        size: size, invoke: invoke, untruth: untruth,
                        push: push, empty: empty, others: others,
                        pipeline: pipeline, and: and, observe: observe,
                        ltrim: ltrim, rtrim: rtrim, merge: merge,
                        isString: isString, isNumber: isNumber, copy: copy,
                        defalue: defalue, curries: curries, truth: truth,
                        isBoolean: isBoolean, Class: klass.create, nonest: nonest,
                        isArray: isArray, toValue: toValue, open: open,
                        Block: Block, replace: replace, valueOf: valueOf,
                        escape: cape.es, unescape: cape.unes, cdn: cdn
                    }
                )
            )
        },

        cdn = (function () {


//		var 	types = ['script', 'link'],
//				options ={	[types[0]]	: {	type			: 'text/javascript',
//													to				: 'head',
//													href			:  'src'},
//								[types[1]] 	: {	type			: 'text/css',
//													to				: 'head',
//													rel				: 'stylesheet',
//													href			: 'href' }};

            /*


		var	typs = ['script', 'link'],
				option = [],
				windw = exports,
				args = $to.array(arguments),
				typ = args.shift();

		if(Function.is(typ)){
			args[0]&&(windw = args[0]);
			ready(typ);
		}else{
			option =	{ script		: {	element	: typs[0],
													type			: 'text/javascript',
													to				: 'head',
													href			:  'src'},
								link		:{		element	: typs[1],
													type			: 'text/css',
													to				: 'head',
													rel			: 'stylesheet',
													href			: 'href'}};

			Object.extend(option[typ], args[0], true);
			args[1]&&(windw = args[1]);
		}
		function script(href, callback){
			var 	opt = option[typ],
					src = opt.src = windw.document.createElement(opt.element);

			src.type = opt.type;
			src.rel = opt.rel;

			switch(typ){
			case typs[0] :		//Script
				if(src.readyState){	//IE
					src.onreadystatechange = function(){
						var state = src.readyState;
						if(	"loaded".isEqual(state) ||
							"complete".isEqual(state)){
							src.onreadystatechange = null;
							callback&&callback.call(src);
						};
					};
				}else{
					src.onload = function(){
						callback&&callback.call(src);
					};
				};
				break;
			default:
			}
			src[opt.href] = href;
			windw.document.getElementsByTagName(opt.to)[0].appendChild(src);
			return this;
		};
		function require(){
			var 	args = $to.array(arguments),
					func = args.shift();
		};
		function ready(func){
			var documt = windw.document;
			if (documt.addEventListener) {
				documt.addEventListener("DOMContentLoaded", func, false);
			}
			// IE
			else if (documt.attachEvent) {
				documt.attachEvent("onreadystatechange", function(){
			    if ('complete'.isEqual(documt.readyState)) {
			    	documt.detachEvent( "onreadystatechange", arguments.callee);
			    }
			  });
			}
		};

		return {	script	:	script,
						ready	:	ready,
						require	:	require	};

		return {};
		*/
        })(),

        cape = (function (exports) {
            var replaces = [["\'", "\\'"],
                    ["\"", "\\\""],
                    ["\\r\\n", "\\n"],
                    ["\\n", "\\n"],
                    ["\\/", "\\/"],
                    ["\\&", "%26"],
                    ["\\?", "%3F"],
                    ["\\+", "%2B"]],
                genrat = curry(
                    generate,
                    function (reps) {
                        //TAIL
                        return map(reps, function (vals) {
                            return vals.slice().reverse();
                        })
                    });

            function is(val) {
                return /([^a-zA-Z0-9]+)/.test(val);
            }

            function replacer(reps, val) {
                return reduce(1)(reps, function (cv, nv) {
                    return cv = replace(cv, nv[0], nv[1]);
                }, val);
            }

            function es(val) {
                if (!is(val)) {
                    return val;
                }

                return genrat(replaces, function (reps, val) {
                    //HEAD
                    return exports.encodeURIComponent(replacer(reps, val));
                }).head(val);
            }

            function unes(val) {
                if (!is(val)) {
                    return val;
                }

                return genrat(replaces, function (reps, val) {
                    //HEAD
                    return replacer(reps, val);
                }).tail().head(exports.decodeURIComponent(val));
            }

            return {
                es: es,
                unes: unes
            }
        })(exports),

        open = (function (exports) {

            var docum = exports.document,
                funcs = {
                    post: function (val) {
                        return val;
                    },
                    get: function (val) {
                        return cape.es(val);
                    }
                }

            return function (obj) {
                var type = obj.type.toLowerCase(),
                    body = docum.querySelector('body'),
                    func = funcs[type];

                if (func) {
                    var url = obj.url,
                        name = obj.name,
                        form = docum.createElement('form'),
                        options = [];

                    form.setAttribute('method', type);
                    form.setAttribute('action', url);
                    form.setAttribute('target', name);

                    if (obj.data) {
                        each(obj.data, function (val, key) {
                            var input = docum.createElement('input');
                            input.type = 'hidden';
                            input.name = key;
                            input.value = func(val);
                            form.appendChild(input);
                        });
                    }

                    if (obj.option) {
                        options = reduce(1)(obj.option, function (co, val, key) {
                            co.push(key.concat('=', val));
                            return co;
                        }, []);
                    }

                    var owin = exports.open('about:blank', name, options.toString())

                    body.appendChild(form);

                    if (exports.focus) {
                        owin.focus();
                    }

                    form.submit();
                    body.removeChild(form);

                    if (obj.callback) {
                        owin.onload = obj.callback;
                    }
                    return owin;
                }
            }
        })(exports),

        Block = (function () {

            var err = function (errm, modu, o) {
                this.message = errm;
                this.module = modu;
                this.object = o;
            }
            err.prototype = new Error();
            return err;
        }()),

        toValue = (function () {

            var types = _types,
                patterns = {};

            patterns[types[5]] = ['^(true|false)$'];
            patterns[types[4]] = ['^\\d+\\.?\\d+?$'];
            patterns[types[8]] = ['^\\{.+\\}$', '^\\[.+\\]$'];
            patterns[types[7]] = ['^\\/(.+)\\/$'];

            return function (val) {

                if (!isString(val)) {
                    return val;
                }

                var value = val,
                    /* unary */
                    regx;

                each(patterns, function (vu, ix) {
                    return loop(vu, function (v, x) {
                        regx = new RegExp(v);

                        if (equal(true, bind(regx.test, regx, val))) {
                            switch (ix) {
                                case types[5] :		//boolean
                                    value = val === 'true' ? true : false;
                                    break;
                                case types[4] :		//number
                                    value = ~~val;
                                    break;
                                case types[8] :		//json
                                    value = JSON.parse(val);
                                    break;
                                case types[7] :		//regExp
                                    value = new RegExp(val.replace(regx, '$1'));
                                    break;
                            }
                            return false;
                        }
                    })
                })
                return value;
            }
        })(),

        /**
         * Class
         * @since 17.07.10
         * @calss
         */
        klass = (function () {

            var membs = ['$super',
                '$virtual'];

            function method(o) {
                var self = this,
                    parent = self.parent,
                    proto = self.prototype;

                each(o, function (vu, ix) {

                    dispatch(
                        when(parent &&
                            isFunction(vu), function (v, i) {
                            switch (finfo(v)[1]) {
                                case membs[0] :		// $super
                                    proto[i] = bind(parent[i], proto);
                                    break;
                                case membs[1] :		// $virtual
                                    if (exist(parent[i])) {
                                        parent[i] = bind(v, parent);
                                    }
                                    proto[i] = bind(v, proto);
                                    break;
                                default :
                                    return false;
                            }
                        }),
                        function (v, i) {
                            proto[i] = v;
                            return true;
                        }
                    )(vu, ix);
                });

                extend(proto, {
                    isEqual: function (that) {
                        return isEqual(this, that);
                    },
                    compareTo: function (that) {
                        if (this.constructor !== that.constructor) {
                            new Block('no compareTo not constructor', 'compareTo', that);
                        }
                        //TODO
                    }
                    //toJSON				:	function(){
                    //				return this;
                    //			},
                    //toString			:	function(){
                    //				return "MOOK";
                    //			},
                    //toLocaleString	:	function(){
                    //				//TODO
                    //			}
                });
            }

            function member() {

                var self = this,
                    parent = self.parent,
                    proto = self.prototype;

                when(parent, function (f) {
                    loop(membs, f);
                })(function (v) {
                    switch (v) {
                        case membs[0] :				// $super
                            proto[v] = Object.create(parent);
                            break;
                        case membs[1] :				// $virtual
                            // parent[v] = extend({}, proto);
                            break;
                    }
                });
            }

            function create() {

                var empty = function () {
                    },
                    newty = function () {
                        this.initialize.apply(this, arguments);
                    },
                    os = toArray(arguments),
                    /* unary */
                    func,
                    proto;

                if (isFunction(os[0])) {
                    func = os.shift();
                    func.childs.push(newty);

                    empty.prototype = func.prototype;
                    newty.prototype = new empty;
                    newty.prototype.constructor = newty;
                }

                extend(newty, {
                    parent: func && func.prototype,
                    method: method,
                    member: member,
                    childs: []
                });

                loop(os, function (o) {
                    newty.method(o);
                });

                newty.member();
                proto = newty.prototype;

                if (!proto.initialize) {
                    proto.initialize = function () {
                    };
                }
                return newty;
            }

            return {create: create};
        }()),

        /**
         * Table Data Control varags : [{Object|Array}, ..]
         *
         * @since 17.06.23
         * @calss
         */
        table = (function () {

            var Table = function (datas) {
                this.datas = datas;
                this.length = datas.length;
            }

            Table.prototype = {
                constructor: Table,
                each: function (f) {
                    return each(this.datas, f);
                },
                compareTo: function (inst) {
                    if (!(inst instanceof Table)) {
                        throw new Block("no compareTo", 'table', inst);
                    }
                }
            }

            return function () {
                return new Table(toArray(arguments));
            }

            // TODO
            // sort
            // reverse
            // where
            // find
            // object
            // keys
            // values
            // pluck
            // invert
            // omit
            // pick,
            // group
            // count
            // first
            // second


        }()),

        /**
         * Container
         *
         * @param {Object|Array}
         * @since 17.07.21
         * @calss
         */
        container = (function () {

            var /*
				wheres = {	'$lt'		: 	function(){},
							'$gt'		: 	function(){},
							'$eq'		: 	function(){},
							'$elt'		: 	function(){},
							'$egt'		: 	function(){},
							'$in'		: 	function(){} },
				*/
                keys = {
                    '$or': function () {
                    },
                    '$key': function (v, k) {
                        return some(this, function (kv) {
                            return toRegExp(kv).test(k);
                        })
                    },
                    '$value': function (v) {
                        return some(this, function (kv) {
                            return toRegExp(kv).test(v);
                        })
                    }
                },
                Container = function (o) {
                    this.obj = o;
                }

            Container.method = {
                query: function (ts) {
                    var res = rest(arguments);

                    return each(ts, function (fv, fk) {
                        return keys[fk] && keys[fk].apply(fv, res);
                    })
                },
                /*test*/
                query2: function (ts) {
                    var res = rest(arguments);

                    return each(ts, function (fv, fk) {
                        return keys[fk] && keys[fk].apply(fv, res);
                    })
                }
            };

            Container.prototype = {
                constructor: Container,
                /**
                 * Container Find
                 * @param {Object}
                 *    1. {key : 'value', ..} and
                 *    2. {key : { $lt : 10}, ..}, and wheres
                 *    3. {key : { $in : [10]}, ..}
                 *    4. {$or : [ { key : {$in : [10]}}, ..]
                 * 	5. {$key : [], ..}			 *
                 * @since 17.07.21
                 * @method
                 */
                find: function (t) {
                    var obj = this.obj,
                        query = partial(Container.method.query, t),
                        /* unary */
                        no;

                    function finds(o, rst) {

                        return reduce(1)(o, function (rs, nx, k) {
                            no = isObject(nx) ? trampoline(partial(finds, nx, empty(nx))) : nx;

                            if (isObject(no) &&
                                !isEmpty(no) ||
                                query(no, k)) {			//primitive
                                //TODO
                                //and query
                                rs = push(rs)(no, k);
                            }
                            return rs;
                        }, rst);
                    }

                    return finds(obj, empty(obj));
                }
                /*
			update	: function(o){

			},
			remove	:function(o){

			}
			*/
            }

            return function (o) {
                return new Container(o);
            }
        }()),

        /**
         * Lazy
         * @since 17.07.21
         * @param {Object|Array}
         * @param {Function} first  point callback
         */
        lazy = (function () {

            function Lazy() {
            }

            Lazy.prototype = {
                constructor: Lazy,

                invoke: function (mn, f) {
                    var invk = invoke(mn, f);

                    return this.push(function () {
                        return invk.apply(null, concat([this], toArray(arguments)));
                    });
                },

                map: function (f) {
                    return this.push(function () {
                        return map(this, f);
                    });
                },

                inspect: function () {
                    var self = this,
                        rst = self.obj,
                        ars = toArray(arguments);

                    loop(self.funcs, function (vf) {
                        rst = vf.apply(rst, ars);
                    });
                    return rst;
                },

                isEqual: function (that) {
                    return that instanceof Lazy;
                }
            }

            return function (o) {
                var lazy = inherit(Lazy),
                    is = (o instanceof Lazy),
                    /* unary */
                    funcs,
                    obj;

                funcs = is ? o.funcs : [];
                obj = is ? o.obj : o;

                return extend(lazy, {
                    push: function (f) {
                        funcs.push(f);
                        return this;
                    }
                    //,
//				get obj(){
//					return obj;
//				},
//				get funcs(){
//					return funcs;
//				}
                });
            }
        }()),

        /**
         * Monad
         * @param {Object|Array[,..]}
         * @since 17.07.24
         * @calss
         */
        /*
	monad = (function(){

		//TODO
		function Monad(){}

		Monad.prototype = {
			constructor	:	Monad,
		}

		return function(){
			return new Monad(o, f);
		}
	}()),
	*/
        /**
         * Promis
         * @param {Object|Array[,..]}
         * @since 17.07.24
         * @calss
         */
        /*
	promis = (function(){

		//TODO
		function Promis(o, f){
		};

		Promis.prototype = {
			constructor	:	Promis,
		}

		return function(o, f){
			return new Promis(o, f);
		}
	}()),
	*/
        /**
         * Dom
         * @param {String|Dom} Selector, Dom
         * @params {String|Dom} Selector, Dom
         * @since 17.08.04
         * @class
         */
        dom = (function () {

            var readies = ['loading',
                    'interactive',
                    'complete'],
                className = (function () {
                    var space = '\u0020';

                    function has(clsName, val) {
                        return (new RegExp('\\b'.concat(val, '\\b'))).test(clsName);
                    }

                    function pattern(classes) {
                        return new RegExp('(\\b'.concat(classes.join('\\b|\\b'), '\\b)'), 'g');
                    }

                    function add(clsName, classes) {
                        var aclass = [];

                        clsName.replace(pattern(classes), function (cx, $1) {
                            aclass.push($1);
                        });

                        aclass = aclass.join(space);

                        return trim(clsName.concat(
                            space,
                            reduce(1)(classes, function (cv, nv) {
                                if (!has(aclass, nv)) {
                                    cv.push(nv);
                                }
                                return cv;
                            }, []).join(space)
                            )
                        );
                    }

                    function remove(clsName, classes) {
                        return trim(clsName.replace(
                            pattern(classes),
                            space
                            )
                        ).replace(/([\s+]{2,})/g, space);
                    }

                    function toArray(val, rst) {
                        var classes = [];

                        if (isString(val)) {
                            classes = concat(val, rst)
                        } else if (isArray(val)) {
                            classes = val;
                        } else {
                            throw new Block("not is {String} or {Array}", 'dom->css.toArray', val);
                        }
                        return classes;
                    }

                    return {
                        toArray: toArray,
                        remove: remove,
                        add: add,
                        pattern: pattern,
                        has: has
                    }
                })();

            function ready(f) {
                ;
                var docm = exports.document;

                if (docm.addEventListener) {
                    docm.addEventListener("DOMContentLoaded", f);
                } else if (docm.attachEvent) {		//IE
                    docm.attachEvent("onreadystatechange", function () {
                        if (docm.readyState === readies[1]) {  //interactive
                            docm.detachEvent("onreadystatechange", f);
                        }
                    });
                }
            }

            function isValidate() {
                //TODO
                // if(	s instanceof Dom ||
                // 	isString(sel) &&
                // 	isRegxSelector();

                return true;
            }

            function selfHTML(html) {
                /**
                 * 0 : context,
                 * 1 : all,
                 * 2 : <
                 * 3 : \n
                 * 4 : $
                 */
                var matchs = /((^<.+?>)<|(^<.+?>)\n|(^<.+?>)$)/.exec(html);

                if (matchs) {
                    return rtrim(matchs[2] || matchs[1]);
                }
                return matchs;
            }

            function dataToCamel(s) {
                var ds = s.split('-'),
                    rst;

                if (ds) {
                    rst = ds[1];
                    for (var i = 2, il = ds.length; il > i; i++) {
                        rst += toCapitalize(ds[i]);
                    }
                }
                return rst;
            }

            function camelToData(s) {
                var data = 'data-';

                s.replace(/(([A-Z])?([a-z0-9]+)?)/g, function (c, $1, $2) {
                    data += $2 ? '-' : '';
                    data += $1.toLowerCase();
                });
                return data;
            }

            function dataFromString(s) {

                if (!isString(s)) {
                    return s;
                }

                /*
			 * 0 : context,
			 * 1 : name
			 * 2 : value
			 */
                var data = {};

                s.replace(
                    /(data-(?:\w|-)+)\s*=\s*[\"\'](.+?)[\"\']/g,
                    function (c, $1, $2) {
                        data[dataToCamel($1)] = toValue($2);
                    }
                );
                return data;
            }

            function querySelector(str, D) {
                if (isDOM(str)) {
                    return [str];
                }

                if (nonest(D)) {
                    D = [document];
                }

                var qs;

                return reduce(1)(D, function (cv, nv) {
                    qs = nv.querySelectorAll(str);

                    if (exist(qs)) {
                        cv = cv.concat(toArray(qs));
                    }
                    ;
                    return cv;
                }, []);
            }

            function valueOf(obj) {
                return reduce(1)(obj, function (co, no, k) {
                    co[k] = toValue(no);
                    return co;
                }, {})
            };

            function Dom(sel, D) {
                each(sel, function (val) {
                    dispatch(
                        function (vu) {
                            var is = (vu instanceof Dom);
                            if (is) {
                                this.set(vu);
                            }
                            return is;
                        },
                        function (vu, d) {
                            if (isValidate(vu)) {
                                //TODO
                                //customize Regex
                                var query = querySelector(vu, d);

                                if (query) {
                                    this.set(query);
                                    return true;
                                }
                            }
                            return false;
                        }
                    ).call(this, val, D);
                }, this);
            }

            Dom.prototype = {
                /* member */
                constructor: Dom,
                prefix: '',

                /* method */
                get: function (idx) {
                    return this[idx];
                },

                set: function (o) {
                    var len = this.length || 0;

                    each(o, function (v) {
                        this[len++] = v;
                    }, this);

                    this.length = len;
                },

                each: function (context, idx) {
                    if (exist(idx)) {
                        return context.call(this, this[idx], idx, this);
                    }
                    return each(this, context, this);
                },

                reduce: function (context, idx) {
                    var init = [],
                        isIdx = exist(idx);

                    if (isIdx ||
                        this.length === 1) {
                        return context.call(this, init, (isIdx ? this[idx] : this[0]))[0];
                    }
                    return reduce(1)(this, context, init);
                },

                /**
                 * Dom-Data
                 * @param {String|Object}
                 *    String -> get|key
                 *    Object -> set
                 * @param {String} value
                 * @since 17.08.07
                 * @method
                 */
                data: function (key, val) {
                    return this.each(function (elem, idx) {
                        return dispatch(
                            function (elm) {
                                var data = {};

                                if (isMap(key)) {
                                    data = key;
                                } else if (exist(val)) {
                                    data[key] = val
                                }

                                /* SET */
                                if (size(data) > 0) {
                                    each(data, function (v, k) {
                                        if (elm.dataset) {
                                            elm.dataset[k] = v;
                                        } else {
                                            elm.setAttribute(camelToData(k), v);
                                        }
                                    });
                                    return true;
                                }
                                /* GET */
                                return false;
                            },
                            compose(
                                function (data) {
                                    return key ? data[key] : data;
                                },
                                function (ele) {
                                    return (
                                        ele.dataset ?
                                            valueOf(ele.dataset) :
                                            dataFromString(selfHTML(this[idx].outerHTML))
                                    )
                                }
                            )
                        ).call(this, elem);
                    });
                },
                /**
                 * Dom-selfHTML
                 * @param {Number} dom Index
                 * @return {String|Array}
                 *    1. Element = 1 then String
                 *  2. Element > 1 then Array
                 * @method
                 */
                selfHTML: function (idx) {
                    return this.reduce(function (ce, ne) {
                        ce.push(selfHTML(ne.outerHTML));
                        return ce;
                    }, idx);
                },

                find: function () {
                    //TODO
                    //>a 일경우 근접 접근 처리
                    return new Dom(toArray(arguments), this)
                },

                text: function (txt) {
                    this.each(function (elem) {
                        elem.innerText = txt;
                    })
                },

                html: function (txt) {
                    //TODO
                    //xhr 형태로 구현
                },

                /**
                 * Dom - className
                 * @since 17.12.22
                 * @params
                 * SET : {String} ,..
                 * SET : {Array}
                 * DEL : {Boolean=TRUE}, ({Array}|{String} ,..)
                 * GET : undefined
                 * @return
                 *    SET, DEL -> this
                 *    GET -> {Array}
                 *@method
                 */
                classNames: function (val) {
                    var classes = [],
                        comps = curry(compose, function (elem) {
                            return {
                                element: elem,
                                className: elem.className
                            };
                        }),
                        _className = className;

                    if (exist(val)) {
                        //SET, REMOVE
                        var isb = isBoolean(val),
                            isr = false,
                            rst = rest(arguments);

                        if (isb) {
                            isr = val;
                            val = rst.shift();
                        }

                        classes = _className.toArray(val, rst);

                        if (isb && isEqual(isr, true)) {
                            //REMOVE
                            comps = comps(function (oelem) {
                                var elem = oelem.element;
                                elem.className = _className.remove(elem.className, classes);
                            })
                        } else {
                            //SET
                            comps = comps(function (oelem) {
                                var elem = oelem.element;
                                elem.className = _className.add(elem.className, classes);
                            })
                        }
                    } else {
                        //GET
                        comps = comps(function (oelem) {
                            var clsName = oelem.className;

                            if (clsName) {
                                classes = classes.concat(clsName.split(/\s+/g));
                            }
                        })
                    }

                    this.each(comps);

                    if (val) {
                        return this;
                    } else {
                        return classes;
                    }
                },

                removeClass: function (val) {
                    return bind(this.classNames, this, true).apply(this, arguments)
                },

                addClass: function () {
                    return bind(this.classNames, this, false).apply(this, arguments)
                },

                everyClass: function (val) {
                    var _className = className,
                        classes = _className.toArray(val, rest(arguments));

                    return !!!this.each(function (elem) {
                        var clsName = elem.className;

                        if (!every(classes, function (vu) {
                            return _className.has(clsName, vu);
                        })) {
                            return true;
                        }
                    });
                },

                hasClass: function (val) {
                    var _className = className,
                        classes = _className.toArray(val, rest(arguments));

                    return !!this.each(function (elem) {
                        if (_className.pattern(classes).test(elem.className)) {
                            return true;
                        }
                    });
                }

                /*
			prefix	:	function(){
				var pfix = this.prefix;

				if(pfix){
					pfix += '_';
				}
				return '#'.concat(pfix);
			}
			*/
            }

            return extend(
                function () {
                    return new Dom(toArray(arguments));
                },
                {ready: ready})
        }()),

        /**
         * Observe
         * @param {String} tocken
         * @param {Object}
         *        {	view : this,
         * 			update{O} : function}
         * @class
         */
        observe = (function () {
            var newly,
                index = 0,
                topics = {};

            function update(topic, data) {
                this.fn && this.fn.update && this.fn.update(topic, data);
            }

            function spread(topic, obj) {
                each(topics, function (val, ix) {
                    val.update.call(val.view, topic, obj);
                })
            }

            function subscribe(topic, obj) {
                if (topics[topic]) return index;

                topics[topic] = union(obj, {update: update});
                newly = topic;
                return ++index;
            }

            function publish(topic, obj, sync) {
                if (untruth(sync)) {
                    setTimeout(function () {
                        spread(topic, obj);
                    }, 25);
                } else {
                    spread(topic, obj);
                }
            }

            function remove(topic) {
                topic = topic || newly;

                if (topics[topic]) {
                    delete topics[topic];
                    delete exports[topic];	// delete window[topic];
                    index--;
                }
            }

            function unsubscribe(topic) {
                topic = topic || newly;

                if (topics[topic]) {
                    delete topics[topic];
                    index--;
                }
                ;
            }

            function tocken() {
                return index - 1;
            }

            function isFind(topic) {
                return !!topics[topic];
            }

            return {
                subscribe: subscribe,
                unsubscribe: unsubscribe,
                tocken: tocken,
                publish: publish,
                remove: remove,
                isFind: isFind
            };
        })();

    extend(exports, {
        $fn: fn(exports)
        //$table		: table,
        //$container	: container,
        //$lazy			: lazy,
        //$monad		: monad,
        //$Error		: Block
    });

})(window);