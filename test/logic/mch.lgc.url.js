/*
 * lgc.url.jsのテスト
 */
var logic = require('../../logic/lgc.url.js'),
    should = require('should');

describe('lgc.url', function () {
    it('url', function(){
        logic('/index').should.equal('/index');
    });

    it('url.js', function(){
        var use_min = logic.use_min;
        logic.use_min = false;
        logic.js('index').should.equal('/javascripts/index.js');
        logic.js('index.js').should.equal('/javascripts/index.js');
        logic.use_min = true;
        logic.js('index').should.equal('/javascripts/index.min.js');
        logic.js('index.js').should.equal('/javascripts/index.min.js');
        logic.use_min = use_min;
    });


    it('url.game.js', function(){
        var use_min = logic.use_min;
        logic.use_min = false;
        logic.js.game('index').should.equal('/javascripts/game/index.js');
        logic.js.game('index.js').should.equal('/javascripts/game/index.js');
        logic.use_min = true;
        logic.js.game('index').should.equal('/javascripts/game/index.min.js');
        logic.js.game('index.js').should.equal('/javascripts/game/index.min.js');
        logic.use_min = use_min;
    });

    it('url.css', function(){
        logic.css('index').should.equal('/stylesheets/index.css');
        logic.css('index.css').should.equal('/stylesheets/index.css');
    });

    it('url.css.game', function(){
        logic.css.game('index').should.equal('/stylesheets/game/index.css');
        logic.css.game('index.css').should.equal('/stylesheets/game/index.css');
    });

    it('url.img', function(){
        logic.img('photo.png').should.equal('/images/photo.png');
    });

    it('isPublic', function(){
        logic.isPublic('/javascripts/view.js').should.be.true;
        logic.isPublic('/stylesheets/view.js').should.be.true;
        logic.isPublic('/images/luck.png').should.be.true;
        logic.isPublic('/fav.ico').should.be.true;
        logic.isPublic('/login').should.be.false;
    });
});