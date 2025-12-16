import { createApp } from 'vue';
import Clicaptcha from './Clicaptcha.vue';

// 定义Clicaptcha组件的选项类型
interface ClicaptchaOptions {
  src: string;
  success?: string;
  error?: string;
  callback?: () => void;
}

const ClicaptchaPlugin = (options: ClicaptchaOptions) => {
  // 创建一个临时容器
  const container = document.createElement('div');
  document.body.appendChild(container);

  // 创建应用实例
  const app = createApp(Clicaptcha, options as any);
  
  // 挂载组件
  const instance = app.mount(container);

  // 返回组件实例
  return instance;
};

export default ClicaptchaPlugin;
export type { ClicaptchaOptions };
