/*
 *  test of utl.xml.js
 */

var should = require('should'),
    util = require('../../util').xml;

describe('utl.xml.js', function(){
    it('xml2Obj', function(done){
        var json = util.xml2Obj('<html><body>my body</body></html>');
        json.should.have.property('html');
        json.html.should.have.property('body', 'my body');
        done();
    });

    it('xml2Json', function(done){
        var json = util.xml2Json('<html><body>my body</body></html>');
        json.should.equal('{"html":{"body":"my body"}}');
        done();
    });
    it('xml2Json', function(done){
        var json = util.xml2Json('<projects>' +
                '<project><id>1</id></project>' +
                '<project><id>2</id></project>' +
            '</projects> ');
        json.should.equal('{"projects":{"project":[{"id":"1"},{"id":"2"}]}}');
        done();
    });
});