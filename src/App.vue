<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import Clicaptcha from './components/Clicaptcha.vue'
import { ref } from 'vue'

const showCaptcha = ref(false)
const captchaSrc = ref('http://localhost:5100/WeatherForecast/Text') // 替换为实际的验证码API地址
const captchaResult = ref('')

const handleCaptchaSuccess = () => {
  captchaResult.value = '验证码验证成功！'
  showCaptcha.value = false
}

const handleCaptchaError = () => {
  captchaResult.value = '验证码验证失败，请重试！'
}

const openCaptcha = () => {
  showCaptcha.value = true
  captchaResult.value = ''
}
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
  
  <div style="margin-top: 20px; text-align: center;">
    <button @click="openCaptcha" style="padding: 10px 20px; font-size: 16px;">
      显示验证码
    </button>
    <div v-if="captchaResult" style="margin-top: 10px; font-weight: bold;">
      {{ captchaResult }}
    </div>
    
    <Clicaptcha 
      v-if="showCaptcha" 
      :src="captchaSrc" 
      @success="handleCaptchaSuccess" 
      @error="handleCaptchaError"
    />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
