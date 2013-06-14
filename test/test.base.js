var app
var Brick

var S = KISSY



describe('brix/base', function() {

  before(function(done) {
    KISSY.use('brix/app,brix/base', function(S, _app, _Brick) {
      app = _app
      Brick = _Brick

      app.config('namespace', 'thx.test')

      done()
    })
  })

  describe('#bxGetTemplate', function() {
    it('from parameter', function(done) {
      app
        .boot({
          el: '#fixture1',
          tmpl: '<div class="foo"></div>'
        })
        .on('ready', function() {
          expect(this.get('tmpl')).to.equal('<div class="foo"></div>')
          done()
        })
    })

    it('from script tag', function(done) {
      app.boot('#fixture2').on('ready', function() {
        expect(S.Node(this.get('tmpl')).hasClass('foo-template')).to.equal(true)
        done()
      })
    })

    if (/^http/.test(location.href)) {
      it('from xhr', function(done) {
        app.boot('#fixture3').on('ready', function() {
          expect(this.get('tmpl')).to.equal('<div class="egg"></div>')
          done()
        })
      })
    }


  })
})