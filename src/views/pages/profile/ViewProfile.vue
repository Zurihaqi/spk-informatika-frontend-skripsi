<!-- eslint-disable vue/valid-v-for -->
<template>
  <CModal
    alignment="center"
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
        @update:showError="updateAlerts('error')"
        @update:showSuccess="updateAlerts('success')"
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
    <CModalFooter class="justify-content-start">
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
        :disabled="isSendingForm"
        color="danger"
        :title="isSendingForm ? 'Menghapus' : 'Hapus'"
        :isSendingForm="isSendingForm"
        @click="deleteProfile"
      />
    </CModalFooter>
  </CModal>
  <div class="row gutters-sm">
    <div class="col-md-4 mb-3">
      <div class="card">
        <div class="card-body user-select-none">
          <div class="d-flex flex-column align-items-center text-center">
            <CImage
              :src="userdata.profilePic"
              alt="User Profile Picture"
              class="rounded-circle"
              width="150"
              height="150"
            />
            <div class="mt-3">
              <h4>{{ userdata.name }}</h4>
              <p class="text-secondary mb-1">{{ userdata.role }}</p>
              <p
                v-if="userdata.role !== 'Pengelola'"
                class="text-secondary font-size-sm"
              >
                {{ userdata.student_id }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-8">
      <div class="card mb-3">
        <CCardBody
          disabled
          v-show="!dateLoaded"
          class="justify-content-center text-center"
        >
          <Alerts
            :showError="showError"
            :showSuccess="showSuccess"
            :errorMsg="errorMsg"
            :successMsg="successMsg"
            @update:showError="updateError"
            @update:showSuccess="updateSuccess"
          />
          <CSpinner
            component="span"
            size="sm"
            variant="grow"
            aria-hidden="true"
          />
          Memuat...
        </CCardBody>
        <div class="card-body user-select-none" v-show="dateLoaded">
          <div class="row">
            <div class="col-sm-3">
              <h6 class="mb-0">Nama</h6>
            </div>
            <div class="col-sm-9 text-secondary">{{ userdata.name }}</div>
          </div>
          <hr />
          <div class="row">
            <div class="col-sm-3">
              <h6 class="mb-0">Email</h6>
            </div>
            <div class="col-sm-9 text-secondary">
              {{ showEmail ? userdata.email : '' }}
              <CButton size="sm" @click.prevent="showEmail = !showEmail">
                <i class="bi bi-eye-slash" v-show="!showEmail"> Tampilkan</i>
                <i class="bi bi-eye" v-show="showEmail"></i>
              </CButton>
            </div>
          </div>
          <hr v-if="shouldShowStudentID" />
          <div v-if="shouldShowStudentID" class="row">
            <div class="col-sm-3">
              <h6 class="mb-0">Nomor Pokok Mahasiswa</h6>
            </div>
            <div class="col-sm-9 text-secondary">{{ userdata.student_id }}</div>
          </div>
          <hr />
          <div class="row">
            <div class="col-sm-3">
              <h6 class="mb-0">Tanggal Dibuat</h6>
            </div>
            <div class="col-sm-9 text-secondary">
              {{ userdata.createdAt }}
            </div>
          </div>
          <hr />
          <div class="row">
            <div class="col-sm-3">
              <h6 class="mb-0">Terakhir Diperbarui</h6>
            </div>
            <div class="col-sm-9 text-secondary">
              {{ userdata.updatedAt }}
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
  computed: {
    shouldShowStudentID() {
      return this.userdata.role !== 'Pengelola'
    },
  },
  setup() {
    return {
      v$: useVuelidate(),
    }
  },
  data() {
    return {
      form: {
        password: '',
      },
      userdata: {
        profilePic: localStorage.getItem('profile_pic'),
        role: this.$store.state.role,
        student_id: this.$store.state.student_id,
        email: this.$store.state.email,
        name: this.$store.state.name,
        createdAt: localStorage.getItem('createdAt'),
        updatedAt: localStorage.getItem('updatedAt'),
      },
      errorMsg: '',
      showError: false,
      successMsg: '',
      showSuccess: false,
      visible: false,
      isLoaded: false,
      isSendingForm: false,
      showEmail: false,
      dateLoaded: false,
    }
  },
  beforeMount() {
    if (!this.userdata.createdAt || !this.userdata.updatedAt) {
      this.getUserData()
    } else {
      this.dateLoaded = true
    }
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
            this.isSendingForm = false
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
          if (result.status === 201) {
            const userData = result.data.data
            localStorage.setItem(
              'createdAt',
              new Date(userData.createdAt).toLocaleString(),
            )
            localStorage.setItem(
              'updatedAt',
              new Date(userData.updatedAt).toLocaleString(),
            )
            this.$router.go()
          }
        })
        .catch((error) => {
          this.showError = true
          this.errorMsg =
            error.response !== undefined ? error.response.data.message : error
        })
    },
    updateAlerts(type) {
      this.showSuccess = type === 'success'
      this.showError = type === 'error'
    },
  },
}
</script>
