KISSY.add('brix/core/bx-tpl', function(S, IO) {

    var TRAILING_SLASH = /\/?$/

    var exports = {
        bxHandleTpl: function(callback) {
            var self = this
            var el = self.get('el')
            var source = self.get('tpl') || el.attr('bx-tpl')

            if (!source) {
                // 不需要在前端渲染模板
                callback()
            }
            else if (source.charAt(0) === '#') {
                self.bxScriptTpl(source, callback)
            }
            else if (source === '.') {
                self.bxHereTpl(el, callback)
            }
            else if (/^\.\//.test(source)) {
                self.bxRemoteTpl(
                    el.attr('bx-name').replace(TRAILING_SLASH, '') + source.substr(1),
                    callback
                )
            }
            else if (source === 'cached') {
                var withinEach = false
                var parent = el

                while ((parent = parent.parent()) && parent !== el) {
                    if (parent.attr('bx-each')) {
                        withinEach = true
                        break
                    }
                    // if found parent with [bx-name] first, then self brick is
                    // not within each.
                    else if (parent.attr('bx-name')) {
                        break
                    }
                }
                var subTpls = self.bxParent.get('subTplsCache')

                callback(withinEach ? subTpls[0] : subTpls.shift())
            }
            else {
                // 模板是直接传进来的，不需做处理
                callback(source)
            }
        },

        bxScriptTpl: function(selector, callback) {
            callback(S.one(selector).html())
        },

        bxHereTpl: function(el, callback) {
            callback(el.html())
        },

        bxRemoteTpl: function(mod, callback) {
            var family = mod.split('/')[0]
            var packages = S.config('packages')[family]
            var module = S.Env.mods[this.bxName.replace(TRAILING_SLASH, '/index')]
            var alias = module && module.alias

            if (alias && alias.length > 0) {
                mod = alias[0].replace(TRAILING_SLASH, '/' + mod.split('/').pop())
            }
            // The mod value shall be something like `mosaics/dropdown/tpl'
            if (packages.debug) {
                // In debug mode, we use XHR to get the template file.
                this.bxXhrTpl(mod, callback)
            }
            else {
                // In production mode, XHR is futile because the origin tpl.html
                // file will quite prossibly be different that the original server.
                //
                // We use KISSY.use to workaround this.
                //
                // bx-remote has the same strategy. So to avoid name collision.
                // We named the wrapped template js file with an affix `.tpl`.
                S.use(mod + '.tpl', function(S, tpl) {
                    callback(tpl)
                })
            }
        },

        bxXhrTpl: function(mod, callback) {
            if (!/^http/.test(location.href)) {
                throw Error('Cannot load tpl via xhr in current mode.')
            }

            IO.get(this.bxResolveModule(mod, '.html'), callback)
        }
    }

    return exports
}, {
    requires: [
        'ajax'
    ]
})