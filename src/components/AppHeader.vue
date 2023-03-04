<template>
  <CModal
    :visible="showModal"
    @close="
      () => {
        showModal = false
      }
    "
    ><CModalHeader>
      <CModalTitle> Kritik dan Saran </CModalTitle>
    </CModalHeader>
    <CModalBody>
      <Alerts
        :showError="showError"
        :showSuccess="showSuccess"
        :errorMsg="errorMsg"
        :successMsg="successMsg"
        @update:showError="updateError"
        @update:showSuccess="updateSuccess"
      />
      <CForm>
        <CFormInput
          label="Judul"
          class="mb-3"
          v-model.trim="form.title"
        ></CFormInput>
        <CFormTextarea
          label="Pesan"
          v-model.trim="form.message"
        ></CFormTextarea>
      </CForm>
    </CModalBody>
    <CModalFooter class="justify-content-start"
      ><CButton color="primary" @click="sendMessage"
        >Kirim</CButton
      ></CModalFooter
    >
  </CModal>
  <CHeader position="sticky" class="mb-4">
    <CContainer fluid>
      <CHeaderToggler class="ps-1" @click="$store.commit('toggleSidebar')">
        <CIcon icon="cil-menu" size="lg" />
      </CHeaderToggler>
      <CHeaderBrand v-if="!isMobile()" class="user-select-none mx-auto"
        >SPK Peminatan Informatika</CHeaderBrand
      >
      <CHeaderNav>
        <CNavItem>
          <CNavLink
            class="btn"
            @click="
              () => {
                showModal = true
              }
            "
          >
            Kritik dan Saran
          </CNavLink>
        </CNavItem>
        <div class="vr"></div>
        <CNavItem>
          <CNavLink @click="logout()" class="btn"> Keluar </CNavLink>
        </CNavItem>
        <AppHeaderDropdownAccnt />
      </CHeaderNav>
    </CContainer>
    <CHeaderDivider />
    <CContainer fluid>
      <AppBreadcrumb />
    </CContainer>
  </CHeader>
</template>

<script>
import AppBreadcrumb from './AppBreadcrumb'
import AppHeaderDropdownAccnt from './AppHeaderDropdownAccnt'
import Alerts from '@/components/Alerts.vue'
import axios from 'axios'

export default {
  name: 'AppHeader',
  components: {
    AppBreadcrumb,
    AppHeaderDropdownAccnt,
    Alerts,
  },
  data() {
    return {
      showModal: false,
      showError: false,
      showSuccess: false,
      errorMsg: '',
      successMsg: '',
      form: {
        title: '',
        message: '',
      },
    }
  },
  methods: {
    sendMessage() {
      axios
        .post(this.$store.state.backendUrl + 'user/message', this.form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        })
        .then((result) => {
          if (result) {
            this.showSuccess = true
            this.successMsg = 'Terima kasih telah memberikan masukan!'
            this.form = {}
          }
        })
        .catch((error) => {
          this.showError = true
          this.errorMsg = error.response.data.message
          this.form = {}
        })
    },
    logout() {
      axios
        .post(
          this.$store.state.backendUrl + 'logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          },
        )
        .then((result) => {
          if (result) {
            this.$store.commit('Logout')
            this.$router.push('/login')
          }
        })
        .catch((error) => {
          this.toasts.push({
            title: error.response.data.status,
            content: error.response.data.message,
          })
          this.$store.commit('Logout')
          this.$router.push('/login')
        })
    },
    isMobile() {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        )
      ) {
        return true
      } else {
        return false
      }
    },
    updateError(value) {
      this.showError = value
    },
    updateSuccess(value) {
      this.showSuccess = value
    },
  },
}
</script>
