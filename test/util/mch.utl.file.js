/*
 * utl.file.jsのテスト
 */

var should = require('should'),
    fs = require('fs'),
    util = require('../../util/utl.file.js');


describe('utl.file.js', function(){

    it('eachLine', function(done){
        var file = __dirname + "/../mock/file/utl.file.readLines.txt";
        util.eachLine(file, function(line, isLast){
            should.exist(line);
            should.not.exist(line.match(/\n/));
            if(isLast){
                done();

            }

        });
    });


    it('readLines', function(done){
        var file = __dirname + "/../mock/file/utl.file.readLines.txt";
        var lineCount = 0;
        util.readLines(file, 2, 3, function(line, isLast){
            lineCount++;
            if(isLast){
                lineCount.should.equal(3);
                done();
            }
        });
    });

    it('readLines (start too big)', function(done){
        var file = __dirname + "/../mock/file/utl.file.readLines.txt";
        util.readLines(file, 20000000, 3, function(line, isLast){
            isLast.should.be.true;
            line.should.equal('');
            done();
        });
    });

    it('readLines (no end)', function(done){
        var file = __dirname + "/../mock/file/utl.file.readLines.txt";
        var lineCount = 0;
        util.readLines(file, 8, function(line, isLast){
            lineCount++;
            if(isLast){
                lineCount.should.equal(5);
                done();
            }
        });
    });

    it('readLines (end too big)', function(done){
        var file = __dirname + "/../mock/file/utl.file.readLines.txt";
        var lineCount = 0;
        util.readLines(file, 8, 9999999999, function(line, isLast){
            lineCount++;
            if(isLast){
                lineCount.should.equal(5);
                done();
            }
        });
    });
});
