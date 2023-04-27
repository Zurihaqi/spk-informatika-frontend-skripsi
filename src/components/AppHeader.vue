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
    alignment="center"
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
    alignment="center"
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
    <CContainer fluid class="d-flex">
      <CHeaderToggler class="ps-1" @click="$store.commit('toggleSidebar')">
        <CIcon icon="cil-menu" size="lg" />
      </CHeaderToggler>
      <CHeaderNav class="d-md-flex me-auto">
        <CDropdown variant="nav-item" class="mt-1 position-relative">
          <CDropdownToggle placement="bottom-end" class="py-0" :caret="false">
            <CIcon icon="cil-bell" size="lg" />
            <CBadge
              color="danger"
              shape="rounded-circle"
              position="top-end"
              class="border border-light"
              v-show="notification.length !== 0"
            >
              <span style="font-size: 0.9em">{{ notification.length }}</span>
            </CBadge>
          </CDropdownToggle>
          <CDropdownMenu class="pt-0">
            <CDropdownHeader>Notifikasi</CDropdownHeader>
            <CContainer>
              <h6
                v-if="notification.length === 0"
                class="text-muted"
                style="font-size: 0.9em"
              >
                Tidak ada notifikasi baru.
              </h6>
              <h6
                v-for="(item, index) in notification"
                :key="index"
                style="font-size: 0.9em"
              >
                {{ item }}
              </h6>
            </CContainer>
            <CDropdownItem
              v-if="notification.length !== 0"
              style="font-size: 0.9em"
              class="btn"
              @click="clearNotif()"
              ><CIcon icon="cil-trash" />Bersihkan notifikasi</CDropdownItem
            >
          </CDropdownMenu>
        </CDropdown>
      </CHeaderNav>
      <CHeaderNav>
        <CNavItem>
          <CNavLink
            class="clickable"
            @click="
              () => {
                showModal = true
              }
            "
          >
            <a> Laporkan Masalah </a>
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
            class="clickable"
          >
            <a> Keluar </a>
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
      notification: [],
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
    this.getNotification()
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
    checkConnection() {
      const connection = this.$cookies.get('token')
      const role = this.$store.state.role
      if (!connection || !role) {
        this.toasts.title = 'Sesi telah habis'
        this.toasts.content = 'Lakukan login ulang.'
        this.errorToast = true
      }
    },
    getNotification() {
      axios
        .get(this.$store.state.backendUrl + 'notification', {
          headers: {
            Authorization: `Bearer ${this.$cookies.get('token')}`,
            'Content-Type': 'application/json',
          },
        })
        .then((result) => {
          const data = result.data.data
          data.forEach((item) => {
            this.notification.push(item.content)
          })
        })
        .catch((error) => {
          this.errorToast = true
          this.toasts.title = 'Error'
          this.toasts.content =
            error.response !== undefined ? error.response.data.message : error
        })
    },
    clearNotif() {
      this.notification = []
      axios
        .delete(this.$store.state.backendUrl + 'notification', {
          headers: {
            Authorization: `Bearer ${this.$cookies.get('token')}`,
            'Content-Type': 'application/json',
          },
        })
        .then((result) => {
          if (result.status === 201) {
            this.notification = []
          }
        })
        .catch((error) => {
          this.errorToast = true
          this.toasts.title = 'Error'
          this.toasts.content =
            error.response !== undefined ? error.response.data.message : error
        })
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
