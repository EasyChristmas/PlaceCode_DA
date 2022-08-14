﻿<link href="/css/erp_docs.css?v=@ViewBag.Version" rel="stylesheet" />


### 公司架构操作文档
>上方为公司架构展示(包括部门和包含的员工数量)，下方为相对应的员工信息

**1.公司架构**
- **新增**：先选中操作的部门，点击【新增按钮】，可以新增相对应部门的下一级部门，形成树结构，<b class="colred">新增的部门会默认排在结尾。</b>
- **编辑**：选中操作的部门，点击【编辑按钮】，可以修改部门的图标和名称。 
- **删除**：选中最后一层部门，点击【删除按钮】，可以删除选中的部门，<b class="colred">但如果不是树结构的最底层，则不能进行操作。</b>
<img src="/docs/oa/images/oa001.jpg" />


**2.员工信息**
- **新增**：先选中上面的部门，点击【新增按钮】，填写姓名、工号、角色就可以新增员工(姓名喝工号为必填项) 。
<img src="/docs/oa/images/oa002.jpg" />

- **编辑**：选中要编辑的员工，点击【编辑按钮】，<b class="colred">（或者双击头像）</b>，也会打开新窗口，展示会员的详情页，可以在详情页里面编辑该会员的信息。
- **绑定微信**：同上，先选中要编辑的员工，点击【绑定微信】，会打开新窗口展示微信页面，扫码绑定。
- **离职**：先选中要编辑的员工，点【离职按钮】，就成离职状态了。
<img src="/docs/oa/images/oa003.jpg" />

- **头像可拖动**：选中头像可以拖动到除本部门外的其他部门,离职员工是移动不了的。 
<img src="/docs/oa/images/oa004.jpg" />