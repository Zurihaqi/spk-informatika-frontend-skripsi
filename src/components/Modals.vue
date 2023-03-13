<template>
  <CModal :visible="showModal" @close="closeModal">
    <CModalHeader>{{ ModalHeader }}</CModalHeader>
    <CModalBody>{{ ModalBody }}</CModalBody
    >{{ ModalFooter }}<CModalFooter> </CModalFooter
  ></CModal>
</template>

<script>
export default {
  name: 'Modals',
  props: ['showModal', 'ModalHeader', 'ModalBody', 'ModalFooter'],
  methods: {
    closeModal() {
      this.$emit('update:showModal', false)
    },
  },
}
</script>
