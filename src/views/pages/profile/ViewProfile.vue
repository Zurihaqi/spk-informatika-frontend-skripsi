<!-- eslint-disable vue/valid-v-for -->
<template>
  <CModal
    :visible="visible"
    @close="
      () => {
        visible = false
      }
    "
  >
    <CModalHeader>
      <CModalTitle>Konfirmasi Hapus Akun</CModalTitle>
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
      <div class="mb-3">Masukan kata sandi untuk menghapus akun.</div>
      <CFormInput
        type="password"
        placeholder="Kata sandi"
        v-model.trim="form.password"
        @input="setTouched('password')"
        feedback="Masukan kata sandi."
        :invalid="v$.form.password.$error"
      />
    </CModalBody>
    <CModalFooter>
      <CButton
        color="secondary"
        @click="
          () => {
            visible = false
          }
        "
      >
        Batal
      </CButton>
      <SubmitButton
        color="danger"
        title="Hapus"
        :isSendingForm="isSendingForm"
        @click="deleteProfile"
      />
    </CModalFooter>
  </CModal>
  <div class="row gutters-sm">
    <div class="col-md-4 mb-3">
      <div class="card">
        <div class="card-body">
          <div class="d-flex flex-column align-items-center text-center">
            <img
              :src="profilePic"
              alt="Admin"
              class="rounded-circle"
              width="150"
            />
            <div class="mt-3">
              <h4>{{ username }}</h4>
              <p class="text-secondary mb-1">{{ role }}</p>
              <p class="text-secondary font-size-sm">{{ studentId }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-8">
      <div class="card mb-3">
        <CCardBody
          disabled
          v-if="!isLoaded"
          class="justify-content-center text-center"
        >
          <CSpinner
            component="span"
            size="sm"
            variant="grow"
            aria-hidden="true"
          />
          Memuat...
        </CCardBody>
        <div class="card-body" v-if="isLoaded">
          <div class="row">
            <div class="col-sm-3">
              <h6 class="mb-0">Nama</h6>
            </div>
            <div class="col-sm-9 text-secondary">{{ username }}</div>
          </div>
          <hr />
          <div class="row">
            <div class="col-sm-3">
              <h6 class="mb-0">Email</h6>
            </div>
            <div class="col-sm-9 text-secondary">{{ email }}</div>
          </div>
          <hr />
          <div class="row">
            <div class="col-sm-3">
              <h6 class="mb-0">Nomor Pokok Mahasiswa</h6>
            </div>
            <div class="col-sm-9 text-secondary">{{ studentId }}</div>
          </div>
          <hr />
          <div class="row">
            <div class="col-sm-3">
              <h6 class="mb-0">Tanggal Dibuat</h6>
            </div>
            <div class="col-sm-9 text-secondary">{{ createdAt }}</div>
          </div>
          <hr />
          <div class="row">
            <div class="col-sm-3">
              <h6 class="mb-0">Terakhir Diperbarui</h6>
            </div>
            <div class="col-sm-9 text-secondary">
              {{ updatedAt }}
            </div>
          </div>
          <hr />
          <div class="d-flex flex-row justify-content-start gap-3">
            <a class="btn btn-primary" @click="editProfile">Ubah Data</a>
            <a
              class="btn btn-danger"
              @click="
                () => {
                  visible = true
                }
              "
              >Hapus Akun</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import Alerts from '@/components/Alerts.vue'
import SubmitButton from '@/components/SubmitButton.vue'

export default {
  name: 'ViewProfile',
  components: {
    Alerts,
    SubmitButton,
  },
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      form: {
        password: '',
      },
      profilePic: this.$cookies.get('profile_pic'),
      role: this.$cookies.get('role'),
      studentId: this.$cookies.get('student_id'),
      email: this.$cookies.get('email'),
      username: this.$cookies.get('username'),
      updatedAt: '',
      createdAt: '',
      errorMsg: '',
      showError: false,
      successMsg: '',
      showSuccess: false,
      visible: false,
      isLoaded: false,
      isSendingForm: false,
    }
  },
  beforeMount() {
    this.getUserData()
  },
  validations() {
    return {
      form: {
        password: {
          required,
        },
      },
    }
  },
  methods: {
    setTouched(theModel) {
      if (theModel == 'password' || theModel == 'all') {
        this.v$.form.password.$touch()
      }
    },
    deleteProfile() {
      this.setTouched('all')
      if (!this.v$.$invalid) {
        this.isSendingForm = true
        axios
          .post(this.$store.state.backendUrl + 'user/delete', this.form, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.$cookies.get('token')}`,
            },
          })
          .then((result) => {
            if (result.status === 201) {
              this.isSendingForm = false
              this.successMsg = 'Berhasil menghapus akun.'
              this.showSuccess = true
              setTimeout(() => {
                this.$store.commit('Logout')
                this.$router.push('/login')
              }, 1000)
            }
          })
          .catch((error) => {
            this.showError = true
            this.errorMsg =
              error.response !== undefined ? error.response.data.message : error
          })
      }
    },
    editProfile() {
      this.$router.push('/profile/edit')
    },
    getUserData() {
      axios
        .get(this.$store.state.backendUrl + 'user', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.$cookies.get('token')}`,
          },
        })
        .then((result) => {
          const userData = result.data.data
          this.updatedAt = new Date(userData.updatedAt).toLocaleString('en-GB')
          this.createdAt = new Date(userData.createdAt).toLocaleString('en-GB')
          this.isLoaded = true
        })
        .catch((error) => {
          this.showError = true
          this.errorMsg =
            error.response !== undefined ? error.response.data.message : error
        })
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
