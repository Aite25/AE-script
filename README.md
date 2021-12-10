# 散装大狸猫Tools
AE scripts for simple works

使用方法：
把文件放入
`AE安装目录\Support Files\Scripts\ScriptUI Panels`

在主菜单的window即可找到这几个脚本

    ※本大狸猫Tools适用于 英文 && 2021版本 的AE，虽然中文版也能运行但部分脚本功能会不齐全

各脚本功能：

**CompKeys Output：**
 - 把关键帧转化为字符串输出

**inOuts：**
 - 图层长度调整相关，按左到右、上到下的顺序介绍
 - 一起移动选择图层*2
 - 将图层出点或入点对齐关键帧*3
 - 若选择图层时间内含时间轴，将其截断*2
 - 若时间线在选择图层外，扩展图层长度至合成长度边缘*3

**KeyframeEase：**
 - 调节关键帧曲线，没有调整关键帧所在时间点速度的功能（默认为0），仅快速调整用。鼠标滚轮移动滑块可以很快地调整曲线
 - 调整图层之间的时间间距
 - 烘焙选择关键帧时间点的表达式的值
 - 反转图层选择顺序
 - 创建ID滑块，以最后一个选择的图层为控制层

**Marker Baker：**
 - 图层、合成标记与关键帧之间的转换

**null：**
 - 创建空对象
 - 创建不可见形状层
 - 链绑父级
 - 可设置引导图层、每个图层创建一个空对象、设置父级为新建图层

**Position Offset：**
 - 简单的批量移动k帧
 - 自动打上极坐标移动表达式

**Property Trancer2：**
 - 找到当前选择的属性的路径（限选择一个属性）。
 - 找到选择图层内这个路径的属性
 - 找到形状层内相对路径（限一个图层里选择两个属性），由于形状层内选择属性的顺序会变成固定，所以再按一次会反转选择的两个属性打表达式的位置。
 - 按属性找到对应的位置，选择、应用、增加特定形状组或者效果。

**Renamer：**
 - 批量递增序号重命名，文本框内数字是从哪个序号开始
 - 根据名字、正则搜索图层，普通搜索使用的是indexOf，正则搜索则是真的正则，开关正则开关会自动补上`^原文字.*(\d+)*$`
 - 反转图层的选择顺序
 - 提取图层名与标签
 - 可以对形状层的组、图层效果等能命名的属性重命名
