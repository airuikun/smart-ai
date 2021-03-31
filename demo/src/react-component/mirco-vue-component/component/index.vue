<template>
  <div id="vue">
    <h1>Hello from {{ding}}</h1>
    <button @click="handleClick">dingge</button>
    <Component1 />
  </div>
</template>

<script>
  import Component1 from './component1.vue';
  export default {
    data() {
      return {
        ding: 'ding ge'
      }
    },
    components: {
      Component1,
    },
    methods: {
      handleClick() {
        this.ding = this.ding + 1;
      }
    }
  }
</script>
