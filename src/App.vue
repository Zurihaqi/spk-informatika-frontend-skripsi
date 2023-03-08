<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',
  mounted() {
    this.$store.commit('initialiseStore')
  },
}
</script>
<style lang="scss">
@import 'styles/style';
</style>
