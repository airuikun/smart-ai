<template>
  <button class="ding-button" @click="handleClick" >{{msg}}</button>
</template>

<script>
export default {
  name: 'hello',
  data() {
    return {
      msg: '这是一个vue组件, 点击会+1',
    }
  },
  methods: {
    handleClick() {
      this.msg = this.msg + 1;
    }
  }
}
</script>

<style lang='css' >
  .ding-button {
    width: 100px;
    height: 100px;
    background-color: greenyellow;
  }
</style> 
