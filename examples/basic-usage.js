// 基本使用示例
import Clicaptcha from '../dist/hikari-vue3-clicaptcha';

// 调用验证码
const captcha = Clicaptcha({
  src: 'https://your-api-url/captcha',
  success: '验证成功！',
  error: '验证失败，请重试！',
  callback: () => {
    console.log('验证码验证成功');
    // 执行后续操作，如提交表单
  }
});

// 监听成功事件
captcha.$on('success', () => {
  console.log('验证成功事件触发');
});

// 监听失败事件
captcha.$on('error', () => {
  console.log('验证失败事件触发');
});

// 手动重置验证码
// captcha.reset();

// 手动关闭验证码
// captcha.close();