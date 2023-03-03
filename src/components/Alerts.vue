<template>
  <div>
    <CAlert color="danger" :visible="showError" dismissible @close="closeError">
      {{ errorMsg }}
    </CAlert>
    <CAlert
      color="success"
      :visible="showSuccess"
      dismissible
      @close="closeSuccess"
    >
      {{ successMsg }}
    </CAlert>
  </div>
</template>

<script>
export default {
  name: 'Alerts',
  props: ['showError', 'showSuccess', 'errorMsg', 'successMsg'],
  methods: {
    closeError() {
      this.$emit('update:showError', false)
    },
    closeSuccess() {
      this.$emit('update:showSuccess', false)
    },
  },
}
</script>
