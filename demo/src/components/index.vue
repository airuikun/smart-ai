<template>
  <button @click="handleClick" >{{msg}}</button>
</template>

<script>
export default {
  name: 'hello',
  data() {
    return {
      msg: '这是一个vue组件',
    }
  },
  methods: {
    handleClick() {
      this.msg = this.msg + 1;
    }
  }
}
</script>
