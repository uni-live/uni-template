<template>
  <view class="content">
    <view class="text-area">
      <button hover-class="button-hover" @click="handleClick">测试</button>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { getDemoList } from '@/api';

  async function handleClick() {
    const data = await getDemoList();

    console.log('================>>>', data);
  }
</script>

<style>
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .logo {
    height: 200rpx;
    width: 200rpx;
    margin-top: 200rpx;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 50rpx;
  }

  .text-area {
    display: flex;
    justify-content: center;
  }

  .title {
    font-size: 36rpx;
    color: #8f8f94;
  }
</style>
