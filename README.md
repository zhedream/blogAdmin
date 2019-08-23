# blogAdmin

## 基本的页面
1. 新增模块 `blogAdmin/` ng g ng-alain:module test
2. 添加页面 `test/`  ng g c hello

## markdown 编辑器
1. ADD editor.md
    1. npm i -D jquery editor.md
    2. npm audit fix ( 提示 run `npm audit fix` to fix them)
2. 配置使用
    1. cp node_modules/editor.md/ src/assets/ -r
    2. 配置 angular.json
    3. 修复  ./src/assets/editor.md/css/editormd.css:3084   `.../fonts/editormd-logo.eot?#iefix-5y8q6h`  to `../fonts/editormd-logo.eot?#iefix-5y8q6h`
3. MD 指令
4. 测试demo editor

## 测试模块
1. hello
2. editor
3. apollo

## ADD apollo
1. ng add apollo-angular
2. 

# License

The MIT License (see the [LICENSE](https://github.com/ng-alain/ng-alain/blob/master/LICENSE) file for the full text)
