# sweepMines
### 项目地址
[Demo here](https://wangwenyue.github.io/sweepMines/)

### 原生javascript编写的扫雷程序

![](pic/demo.gif)

#### 实现的功能

* 用计时器的方式，实现游戏计时功能
* 用ES6的新特性，创建Class的方式，实现选择游戏难度功能
* 用事件监听的方式，监测并标记地雷（插旗子标记地雷，标记之后不能点击）
* 用递归搜索的方式，自动连锁打开雷区
* 显示剩余地雷数目（总的雷数减去插旗的数量）

#### Update

* 新增Electron版本
- 使用指南：
- cd SweepMines_Electron    进入文件夹
- yarn install              安装依赖
- yarn run mac              生成SweepMines.app 可在macOS环境下运行
