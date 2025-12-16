<template>
    <div>
        <div id="clicaptcha-container">
            <div class="clicaptcha-imgbox">
                <img class="clicaptcha-img" :src="imgSrc" @click.prevent="record($event)" alt="验证码加载失败，请点击刷新按钮">
                <span v-for="item in xy" :key="item.id" class="step" :style="`left:${item.x - 13}px;top:${item.y - 13}px`">{{item.id}}</span>
            </div>
            <div class="clicaptcha-title" v-if="tip">
                {{tip}}
            </div>
            <div class="clicaptcha-title" v-else>
                请依次点击
                <span v-for="(item, index) in text" :key="index" :class="isTextItemClicked(index) ? 'clicaptcha-clicked' : ''">{{item}}</span>
            </div>
            <div class="clicaptcha-refresh-box">
                <div class="clicaptcha-refresh-line clicaptcha-refresh-line-l"></div>
                <a href="javascript:;" class="clicaptcha-refresh-btn" title="刷新" @click="reset"></a>
                <div class="clicaptcha-refresh-line clicaptcha-refresh-line-r"></div>
            </div>
        </div>
        <div id="clicaptcha-mask" @click="close"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from "axios";
import qs from "qs";

axios.defaults.withCredentials = true;

interface ClickPoint {
  id: number;
  x: number;
  y: number;
}

interface CaptchaResponse {
  correctTexts: string[];
  imageWidth: number;
  imageHeight: number;
  image: string;
}

interface ClicaptchaProps {
  src: string;
  success?: string;
  error?: string;
  callback?: () => void;
}

interface ClicaptchaEmits {
  (e: 'success'): void;
  (e: 'error'): void;
}

const props = withDefaults(defineProps<ClicaptchaProps>(), {
  success: '验证成功！',
  error: '未点中正确区域，请重试！',
  callback: () => {}
});

const emit = defineEmits<ClicaptchaEmits>();

const imgSrc = ref<string>('');
const tip = ref<string>('');
const xy = ref<ClickPoint[]>([]);
const text = ref<string[]>([]);

// 查找最低可用的选项编号
const findLowestAvailableId = (): number => {
  if (xy.value.length === 0) return 1;
  
  // 获取当前已使用的编号并排序
  const usedIds = xy.value.map(point => point.id).sort((a, b) => a - b);
  
  // 查找第一个缺失的编号
  for (let i = 0; i < usedIds.length; i++) {
    if (usedIds[i] !== i + 1) {
      return i + 1;
    }
  }
  
  // 如果没有缺失的编号，返回下一个编号
  return usedIds.length + 1;
};

// 检查指定索引的文本项是否已被点击
const isTextItemClicked = (index: number): boolean => {
  // 检查是否存在对应编号的点击点
  return xy.value.some(point => point.id === index + 1);
};

const loadImg = () => {
  axios.get<CaptchaResponse>(props.src + "?" + new Date().getTime())
    .then(response => {
      const data = response.data;
      // 设置图片源为base64数据URL
      imgSrc.value = "data:image/jpeg;base64," + data.image;
      
      // 从correctTexts中获取文字
      text.value = data.correctTexts;
      
      // 清空点击记录
      xy.value = [];
      
      // 清空提示
      tip.value = "";
    })
    .catch(error => {
      console.error("验证码加载失败:", error);
      tip.value = "验证码加载失败，请点击刷新按钮";
    });
};

const record = (event: MouseEvent) => {
  // 阻止事件冒泡
  event.stopPropagation();
  
  // 获取图片元素
  const imgElement = document.querySelector('.clicaptcha-img') as HTMLImageElement;
  if (!imgElement) return;
  
  // 获取相对于图片的坐标（使用getBoundingClientRect确保准确性）
  const rect = imgElement.getBoundingClientRect();
  const clickX = Math.round(event.clientX - rect.left);
  const clickY = Math.round(event.clientY - rect.top);
  
  // 添加调试日志
  console.log('点击坐标信息:');
  console.log('clientX/Y:', event.clientX, event.clientY);
  console.log('图片位置:', rect.left, rect.top);
  console.log('相对于图片的坐标:', clickX, clickY);
  console.log('当前已选点:', xy.value);
  
  // 检查是否点击了已存在的点
  const clickThreshold = 25; // 点击阈值，提高用户体验
  const newXY: ClickPoint[] = [];
  let found = false;
  
  // 遍历已选点，检查是否有接近当前点击位置的点
  for (const point of xy.value) {
    // 计算欧几里得距离
    const distance = Math.sqrt(Math.pow(clickX - point.x, 2) + Math.pow(clickY - point.y, 2));
    
    if (distance >= clickThreshold) {
      newXY.push(point); // 保留距离远的点
    } else {
      found = true; // 找到要删除的点
      console.log('删除点:', point);
    }
  }
  
  if (found) {
    // 删除已点击的点
    xy.value = newXY;
  } else if (xy.value.length < text.value.length) {
      // 添加新点，使用最低可用编号
      const newPoint: ClickPoint = {
        id: findLowestAvailableId(),
        x: clickX,
        y: clickY
      };
      
      // 将新点添加到数组并按id排序，确保数组始终按编号顺序排列
      xy.value = [...xy.value, newPoint].sort((a, b) => a.id - b.id);
      console.log('添加新点:', newPoint);
      console.log('当前xy数组:', xy.value);
    
    // 如果已完成所有点击，进行验证
    if (xy.value.length === text.value.length) {
      // 将点击点转换为后端需要的格式
      const coordinatesStr = xy.value.map(point => `${point.x},${point.y}`).join("-");
      const captchainfo = [
        coordinatesStr,
        imgElement.width,
        imgElement.height
      ].join(";")
      
      axios
        .post(
          props.src,
          qs.stringify({
            do: "check",
            info: captchainfo
          })
        )
        .then(cb => {
          console.log('后端验证结果:', cb.data);
          if (cb.data.data === 1) {
            tip.value = props.success;
            emit('success');
            setTimeout(() => {
              close();
              props.callback();
            }, 1500);
          } else {
            tip.value = props.error;
            emit('error');
            setTimeout(() => {
              reset();
            }, 1500);
          }
        });
    }
  }
};

const reset = () => {
  loadImg();
};

const close = () => {
  const container = document.getElementById('clicaptcha-container');
  const mask = document.getElementById('clicaptcha-mask');
  if (container) container.remove();
  if (mask) mask.remove();
};

// 导出接口以便在index.ts中使用
defineExpose({
  reset
});

onMounted(() => {
  loadImg();
});
</script>

<style lang="scss" scoped>
#clicaptcha-container {
    width: 350px;
    height: 290px;
    padding: 15px;
    border: 1px solid #b1b3b8;
    background-color: #f5f6f7;
    position: fixed;
    z-index: 10000;
    left: 50%;
    top: 50%;
    margin-left: -191px;
    margin-top: -161px;
    border-radius: 10px;
    box-shadow: 0 0 0 1px hsla(0, 0%, 100%, 0.3) inset,
        0 0.5em 1em rgba(0, 0, 0, 0.6);
    .clicaptcha-imgbox {
        position: relative;
        .clicaptcha-img {
            width: 350px;
            height: 200px;
            border: none;
        }
        .step {
            position: absolute;
            width: 20px;
            height: 20px;
            line-height: 20px;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            color: #f04848;
            border: 3px solid #f04848;
            background-color: #fff;
            border-radius: 30px;
            box-shadow: 0 0 10px #fff;
            -webkit-user-select: none;
            user-select: none;
            pointer-events: none; /* 允许点击事件穿透到图片 */
        }
    }
    .clicaptcha-title {
        font-family: "Microsoft YaHei";
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        text-align: center;
        color: #333;
        span {
            margin-left: 10px;
            font-size: 18px;
            font-weight: bold;
            color: #c00;
            &.clicaptcha-clicked {
                color: #069;
            }
        }
    }
    .clicaptcha-refresh-box {
        position: relative;
        margin-top: 10px;
    }
    .clicaptcha-refresh-line {
        position: absolute;
        top: 16px;
        width: 140px;
        height: 1px;
        background-color: #ccc;
    }
    .clicaptcha-refresh-line-l {
        left: 5px;
    }
    .clicaptcha-refresh-line-r {
        right: 5px;
    }
    .clicaptcha-refresh-btn {
        display: block;
        margin: 0 auto;
        width: 32px;
        height: 32px;
        background: url(../assets/refresh.png) no-repeat;
        &:hover {
            background-position: -32px 0;
        }
    }
}
#clicaptcha-mask {
    position: fixed;
    z-index: 9999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background-color: rgb(0, 0, 0);
}
</style>