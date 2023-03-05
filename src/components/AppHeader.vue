<template>
  <CModal
    :visible="showModal"
    @close="
      () => {
        showModal = false
        form = {}
      }
    "
    ><CModalHeader>
      <CModalTitle> Laporkan Masalah </CModalTitle>
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
          placeholder="Judul"
          label="Judul"
          v-model.trim="form.title"
          @input="setTouched('title')"
          :invalid="v$.form.title.$error"
          feedback="Masukan judul pesan."
        ></CFormInput>
        <div class="mb-3"></div>
        <CFormTextarea
          placeholder="Rincian masalah"
          label="Pesan"
          v-model.trim="form.message"
          @input="setTouched('message')"
          :invalid="v$.form.message.$error"
          feedback="Masukan pesan."
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
            Laporkan Masalah
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
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default {
  name: 'AppHeader',
  components: {
    AppBreadcrumb,
    AppHeaderDropdownAccnt,
    Alerts,
  },
  setup() {
    return { v$: useVuelidate() }
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
  validations() {
    return {
      form: {
        title: {
          required,
        },
        message: {
          required,
        },
      },
    }
  },
  methods: {
    setTouched(theModel) {
      if (theModel == 'title' || theModel == 'all') {
        this.v$.form.title.$touch()
      }
      if (theModel == 'message' || theModel == 'all') {
        this.v$.form.message.$touch()
      }
    },
    sendMessage() {
      this.setTouched('all')
      if (!this.v$.$invalid) {
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
              this.successMsg =
                'Laporan diterima! Terima kasih atas laporannya.'
            }
          })
          .catch((error) => {
            this.showError = true
            this.errorMsg = error.response.data.message
          })
      }
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
