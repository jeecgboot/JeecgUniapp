<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
    disableScroll: true, // 微信禁止页面滚动
    'app-plus': {
      bounce: 'none', // 禁用 iOS 弹性效果
    },
  },
}
</route>

<template>
  <PageLayout navTitle="demo01测试" backRouteName="index"></PageLayout>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { onShow, onHide, onLoad, onReady } from '@dcloudio/uni-app'
import { useMessage, useToast } from 'wot-design-uni'
import { useRouter } from '@/plugin/uni-mini-router'
import { useUserStore } from '@/store/user'
import { http } from '@/utils/http'
import { useParamsStore } from '@/store/page-params'

defineOptions({
  name: 'demo01',
  options: {
    styleIsolation: '‌shared‌',
  },
})
const router = useRouter()
const paramsStore = useParamsStore()
const userStore = useUserStore()
const toast = useToast()
const message = useMessage()
</script>

<style lang="scss" scoped>
//
</style>
