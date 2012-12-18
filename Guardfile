# A sample Guardfile
# More info at https://github.com/guard/guard#readme

# Add files and commands to this file, like the example:
#   watch(%r{file/path}) { `command(s)` }
#

# ターミナル上で、envを設定した上で監視を開始する
# export NODE_ENV=test
# bundle exec guard start

system("mocha --ui bdd --reporter spec test/*");
group :test do
  guard 'shell' do
    watch(%r{^(test/logic/mch\..*\.js)$})   { |m| system("mocha --ui bdd --reporter spec #{m[1]}") }
    watch(%r{^(test/agent/mch\..*\.js)$})   { |m| system("mocha --ui bdd --reporter spec #{m[1]}") }
    watch(%r{^(test/routes/mch\..*\.js)$})   { |m| system("mocha --ui bdd --reporter spec #{m[1]}") }
    watch(%r{^(test/models/mch\..*\.js)$})   { |m| system("mocha --ui bdd --reporter spec #{m[1]}") }
    watch(%r{^(test/util/mch\..*\.js)$})   { |m| system("mocha --ui bdd --reporter spec #{m[1]}") }
    watch(%r{^(test/views/mch\..*\.js)$})   { |m| system("mocha --ui bdd --reporter spec #{m[1]}") }
    watch(%r{^(test/locales/index\.js)$})   { |m| system("mocha --ui bdd --reporter spec #{m[1]}") }
  end
end

group :code do
  guard 'shell' do
    watch(%r{^logic/lgc\.(.*)\.js$})   { |m| system("mocha --ui bdd --reporter spec test/logic/mch.lgc.#{m[1]}.js") }
    watch(%r{^agent/agn\.(.*)\.js$})   { |m| system("mocha --ui bdd --reporter spec test/agent/mch.agn.#{m[1]}.js") }
    watch(%r{^routes/(.*)\.js$})   { |m| system("mocha --ui bdd --reporter spec test/routes/mch.#{m[1]}.js") }
    watch(%r{^db/models/mdl\.(.*)\.js$})   { |m| system("mocha --ui bdd --reporter spec test/models/mch\.mdl\.#{m[1]}.js") }
    watch(%r{^util/utl\.(.*)\.js$})   { |m| system("mocha --ui bdd --reporter spec test/util/mch.utl.#{m[1]}.js") }
    watch(%r{^(validation/vld\.client\.js)$})   { |m| system("mocha --ui bdd --reporter spec test/validation/*") }
  end
end
