var app
var Brick

var S = KISSY


describe('app and Brick', function() {

  this.timeout(5000)

  before(function(done) {
    KISSY.use('brix/app,brix/base', function(S, _app, _Brick) {
      app = _app
      Brick = _Brick

      app.config({
        components: 'thx.test',
        base: './'
      })

      done()
    })
  })

  describe('#prepare', function() {

    it('should not fail if the el is gone when instantiating', function() {
      app
        .prepare('#fixture1')
        .then(function(brick) {
          // 因为 [bx-name="thx.test/opoa-foo"] 节点已经被干掉了
          expect(brick.find('thx.test/opoa-foo')).to.be(undefined)
          expect(brick.bxChildren).to.be.empty()
        })

        // 5ms 后清空 #fixture1 中的内容，即不再有 thx.test/opoa-foo 组件
        // thx.test/opoa-foo/index 模块原本在 10ms 后返回
        S.later(function() {
          S.one('#fixture1').empty()
        }, 5)
    })
  })

  describe('#destroy', function() {

    it('should check if the el is gone before destroying itself', function() {
      app
        .prepare('#fixture2')
        .then(function(brick) {
          expect(brick.bxChildren.length).to.be(1)
          expect(brick.find('thx.test/opoa-foo')).to.be.a(Brick)

          S.one('#fixture2').remove()

          brick.destroy()

          expect(brick.bxChildren).to.be.empty()
          expect(brick.get('el')).to.be(null)

          // http://stackoverflow.com/questions/5076944/what-is-the-difference-between-null-and-undefined-in-javascript
        })
    })
  })
})