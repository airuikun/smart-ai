<template>
  <div>
    <h1>这是第二个组件哈哈哈 {{niubi}}</h1>
    <button @click="handleClick">click me</button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        niubi: 'niubibibi'
      }
    },
    methods: {
      handleClick() {
        this.niubi = this.niubi + 'me';
      }
    }
  }
</script>
