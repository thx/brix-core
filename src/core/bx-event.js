KISSY.add('brix/core/bx-event', function(S,Util) {

    var exports = {

        bxDelegate: function() {

            var c = this.constructor
            while (c) {
                this.bxDelegateMap(c.EVENTS)
                c = c.superclass ? c.superclass.constructor : null
            }

            //外部动态传入的事件代理
            var events = this.get('events')
            if (events) {
                this.bxDelegateMap(events)
            }
        },

        bxDelegateMap: function(eventsMap) {
            var self = this
            var el = this.get('el')
            var Event = S.Event
            var fnc
            var fn;

            function wrapFn(fnc) {
                return function() {
                    var obj = Util.bxGetAncestor(self)
                    var ancestor
                    if(obj.data){
                        //增加brixData，方便外部直接获取
                        arguments[0].brixData = obj.data
                        ancestor = obj.ancestor
                    }
                    else{
                        ancestor = self;
                    }
                    fnc.apply(this, arguments)
                    ancestor.digest()
                }
            }

            for (var sel in eventsMap) {
                var events = eventsMap[sel]
                for (var type in events) {
                    fnc = events[type]
                    fnc.handle = wrapFn(fnc)

                    fn = fnc.handle

                    if (sel === 'self') {
                        el.on(type, fn, this)
                    } else if (sel === 'window') {
                        Event.on(window, type, fn, this)
                    } else if (sel === 'body') {
                        Event.on('body', type, fn, this)
                    } else if (sel === 'document') {
                        Event.on(document, type, fn, this)
                    } else {
                        el.delegate(type, sel, fn, this)
                    }
                }

            }
        },

        bxUndelegate: function() {
            var c = this.constructor

            while (c) {
                this.bxUndelegateMap(c.EVENTS)
                c = c.superclass ? c.superclass.constructor : null
            }
            //外部动态传入的事件代理
            var events = this.get('events')
            if (events) {
                this.bxUndelegateMap(events)
            }
        },

        bxUndelegateMap: function(eventsMap) {
            var el = this.get('el')
            var Event = S.Event
            var fn

            for (var sel in eventsMap) {
                var events = eventsMap[sel]
                for (var type in events) {
                    fn = events[type].handle

                    if (sel === 'self') {
                        el.detach(type, fn, this)
                    } else if (sel === 'window') {
                        Event.detach(window, type, fn, this)
                    } else if (sel === 'body') {
                        Event.detach('body', type, fn, this)
                    } else if (sel === 'document') {
                        Event.detach(document, type, fn, this)
                    } else {
                        el.undelegate(type, sel, fn, this)
                    }

                    fn = null;
                    delete events[type].handle
                }
            }
        }
    }

    return exports
}, {
    requires: ['brix/tool/util','event']
})