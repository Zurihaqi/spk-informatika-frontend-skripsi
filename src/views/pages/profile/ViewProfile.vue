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
      <CAlert
        color="danger"
        :visible="modalError"
        dismissible
        @close="
          () => {
            modalError = false
          }
        "
      >
        {{ errorMgs }}
      </CAlert>
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
      <CButton color="danger" @click="deleteProfile">Hapus</CButton>
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
        <div class="card-body">
          <CAlert
            color="danger"
            :visible="ShowError"
            dismissible
            @close="
              () => {
                ShowError = false
              }
            "
          >
            {{ errorMgs }}
          </CAlert>
          <CAlert
            color="success"
            :visible="success"
            dismissible
            @close="
              () => {
                success = false
              }
            "
          >
            {{ successMsg }}
          </CAlert>
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
import placeholder from '@/assets/images/avatars/placeholder.png'

export default {
  name: 'ViewProfile',
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      form: {
        password: '',
      },
      profilePic: '',
      role: '',
      studentId: '',
      email: '',
      username: '',
      updatedAt: '',
      createdAt: '',
      errorMgs: '',
      ShowError: false,
      successMsg: '',
      success: false,
      visible: false,
      modalError: false,
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
        axios
          .post(this.$store.state.backendUrl + 'user/delete', this.form, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          .then((result) => {
            if (result.status === 201) {
              this.visible = false
              this.successMsg = 'Berhasil menghapus akun.'
              this.success = true
              setTimeout(() => {
                location.reload()
              }, 1000)
            }
          })
          .catch((error) => {
            console.log(error)
            if (!this.visible) {
              this.ShowError = true
              this.errorMgs = error.response.data.message
            }
            this.modalError = true
            this.errorMgs = error.response.data.message
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
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((result) => {
          const userData = result.data.data
          this.username = userData.name
          this.role = userData.role === 'ADMIN' ? 'Admin' : 'Mahasiswa'
          this.profilePic = userData.profile_pic
            ? userData.profile_pic
            : placeholder
          this.studentId = userData.student_id
          this.email = userData.email
          this.updatedAt = new Date(userData.updatedAt).toLocaleString('en-GB')
          this.createdAt = new Date(userData.createdAt).toLocaleString('en-GB')
          return result
        })
        .catch((error) => {
          console.log(error)
          this.ShowError = true
          this.errorMgs = error.response.data.message
        })
    },
  },
}
</script>
