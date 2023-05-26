<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center text-center">
        <CCol :md="4">
          <div class="my-div">
            <h1 class="float-start display-3 me-4">404</h1>
            <h4 class="pt-3">Not Found.</h4>
            <p class="text-medium-emphasis float-start">
              Halaman tidak ditemukan.
            </p>
          </div>
          <CButton color="info" @click="goBack"
            >Kembali ke halaman utama</CButton
          >
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<style>
.my-div {
  max-width: 200px; /* Set the desired maximum width */
  margin: 0 auto; /* Optional: To horizontally center the div within its container */
}
</style>

<script>
export default {
  name: 'Page404',
  methods: {
    goBack() {
      this.$router.push('/')
    },
  },
}
</script>
