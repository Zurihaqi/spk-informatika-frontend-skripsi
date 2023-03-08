<template>
  <CToaster placement="top-end">
    <CToast
      v-if="errorToast"
      @close="
        () => {
          this.$store.commit('Logout')
          this.$router.push('/login')
        }
      "
    >
      <CToastHeader closeButton>
        <span class="me-auto fw-bold">{{ toasts.title }}</span>
      </CToastHeader>
      <CToastBody>
        {{ toasts.content }}
      </CToastBody>
    </CToast>
  </CToaster>
  <CModal
    :visible="confirmLogout"
    @close="
      () => {
        confirmLogout = false
      }
    "
  >
    <CModalHeader>Konfirmasi Keluar</CModalHeader>
    <CModalBody>Apakah anda yakin ingin keluar?</CModalBody
    ><CModalFooter>
      <CButton
        color="secondary"
        @click="
          () => {
            confirmLogout = false
          }
        "
        >Batal</CButton
      ><CButton color="primary" @click="logout()">Keluar</CButton>
    </CModalFooter></CModal
  >
  <CModal :visible="showSuccess" alignment="center">
    <CModalBody class="bg-success text-white">
      <h5>{{ successMsg }}</h5>
    </CModalBody>
  </CModal>
  <CModal :visible="showError" alignment="center">
    <CModalBody class="bg-danger text-dark">
      <h5>{{ errorMsg }}</h5>
    </CModalBody>
  </CModal>
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
      ><SubmitButton
        title="Kirim"
        :isSendingForm="isSendingForm"
        @click="sendMessage"
      />
    </CModalFooter>
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
          <CNavLink
            @click="
              () => {
                confirmLogout = true
              }
            "
            class="btn"
          >
            Keluar
          </CNavLink>
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
import SubmitButton from '@/components/SubmitButton.vue'
import axios from 'axios'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default {
  name: 'AppHeader',
  components: {
    AppBreadcrumb,
    AppHeaderDropdownAccnt,
    SubmitButton,
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
      isSendingForm: false,
      errorToast: false,
      successSent: false,
      confirmLogout: false,
      toasts: {},
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
  beforeMount() {
    this.checkConnection()
  },
  methods: {
    checkConnection() {
      axios
        .get(this.$store.state.backendUrl + 'check-connection', {
          headers: {
            Authorization: `Bearer ${this.$cookies.get('token')}`,
            'Content-Type': 'application/json',
          },
        })
        .then()
        .catch((error) => {
          if (error) {
            this.errorToast = true
            this.toasts.title = 'Sesi anda habis.'
            this.toasts.content = 'Lakukan login ulang.'
          }
        })
    },
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
        this.isSendingForm = true
        axios
          .post(this.$store.state.backendUrl + 'user/message', this.form, {
            headers: {
              Authorization: `Bearer ${this.$cookies.get('token')}`,
              'Content-Type': 'application/json',
            },
          })
          .then((result) => {
            if (result.status === 201) {
              this.isSendingForm = false
              this.showSuccess = true
              this.successMsg =
                'Laporan terkirim! Terima kasih atas masukannya!'
              this.successSent = true
              this.showModal = false
            }
          })
          .catch((error) => {
            this.isSendingForm = false
            this.showError = true
            this.errorMsg =
              error.response !== undefined ? error.response.data.message : error
          })
      }
    },
    logout() {
      this.$store.commit('Logout')
      this.$router.push('/login')
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
