# blogAdmin

## 基本的页面
1. 新增模块 `blogAdmin/` ng g ng-alain:module test
2. 添加页面 `test/`  ng g c hello
3. 添加路由 routes-routing.module.ts

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

## 文章模块 article
1. index 文章列表
2. add 新增文章
3. edit 编辑文章
4. article 服务 生成服务指令:  ng g s article

## 检查代码
https://www.jianshu.com/p/dc55ddd6c5c2
git commit  时 检查代码

## 测试
https://blog.csdn.net/wf19930209/article/details/80413904
ng test

# License

The MIT License (see the [LICENSE](https://github.com/ng-alain/ng-alain/blob/master/LICENSE) file for the full text)
