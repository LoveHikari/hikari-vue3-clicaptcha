# hikari-vue3-clicaptcha

Vue 3 + TypeScript 实现的点击验证码组件，支持按顺序点击验证，提供良好的用户体验和稳定的编号系统。

## 功能特性

- ✅ Vue 3 Composition API + TypeScript
- ✅ 按顺序点击验证
- ✅ 点击区域容错处理
- ✅ 稳定的编号系统（删除后重新添加保持正确编号）
- ✅ 响应式设计
- ✅ 支持自定义提示文字
- ✅ 错误自动重试机制

## 安装

```bash
npm install hikari-vue3-clicaptcha --save
```

## 基本使用

### 1. 全局引入

```javascript
import { createApp } from 'vue';
import App from './App.vue';
import Clicaptcha from 'hikari-vue3-clicaptcha';

const app = createApp(App);
app.use(Clicaptcha);
app.mount('#app');
```

### 2. 组件内引入

```javascript
import Clicaptcha from 'vue-clicaptcha';
```

### 3. 使用示例

```javascript
import Clicaptcha from 'vue-clicaptcha';

// 调用验证码
const captcha = Clicaptcha({
  src: 'https://your-api-url/captcha',
  success: '验证成功！',
  error: '验证失败，请重试！',
  callback: () => {
    console.log('验证码验证成功');
    // 执行后续操作
  }
});

// 监听事件
captcha.$on('success', () => {
  console.log('验证成功');
});

captcha.$on('error', () => {
  console.log('验证失败');
});
```

## API 说明

### 参数

| 参数名 | 类型 | 必填 | 描述 | 默认值 |
|--------|------|------|------|--------|
| src | string | 是 | 验证码API接口地址 | - |
| success | string | 否 | 验证成功提示文字 | '验证成功！' |
| error | string | 否 | 验证失败提示文字 | '未点中正确区域，请重试！' |
| callback | function | 否 | 验证成功回调函数 | () => {} |

### 事件

| 事件名 | 描述 |
|--------|------|
| success | 验证成功时触发 |
| error | 验证失败时触发 |

### 方法

| 方法名 | 描述 |
|--------|------|
| reset | 重置验证码 |
| close | 关闭验证码 |

## 后端接口要求

### 1. 获取验证码接口（GET）

请求地址：`{src}?{timestamp}`

响应格式：

```json
{
  "correctTexts": ["荷", "花"],
  "imageWidth": 350,
  "imageHeight": 200,
  "image": "base64编码的图片数据"
}
```

### 2. 验证验证码接口（POST）

请求地址：`{src}`

请求参数：

```
do=check&info={coordinates};{width};{height}
```

参数说明：
- `coordinates`: 点击坐标，格式为 `x1,y1-x2,y2`
- `width`: 图片宽度
- `height`: 图片高度

响应格式：

```json
{
  "data": 1  // 1表示验证成功，其他值表示验证失败
}
```

## 组件结构

```
├── src/
│   ├── components/
│   │   ├── Clicaptcha.vue      # 验证码组件
│   │   └── index.ts            # 组件入口
│   ├── assets/
│   │   └── refresh.png         # 刷新按钮图标
│   └── App.vue                 # 示例应用
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

##  3. 后端环境参考

移步至 [hikari_clicaptcha_server](https://github.com/LoveHikari/hikari_clicaptcha_server) 项目

## 浏览器兼容性

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 开发和构建

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 类型检查
npx vue-tsc -b
```

## 许可证

Apache-2.0 License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v1.0.0
- 初始版本
- Vue 3 + TypeScript 实现
- 支持按顺序点击验证
- 稳定的编号系统
- 响应式设计

## 联系我们

如有问题或建议，请通过以下方式联系我们：

- GitHub: [hikari-vue3-clicaptcha](https://github.com/LoveHikari/hikari-vue3-clicaptcha)
- Email: xmh.yxw@gmail.com