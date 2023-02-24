<!-- eslint-disable vue/valid-v-for -->
<template>
  <CToaster placement="top-end">
    <CToast v-for="toast in toasts">
      <CToastHeader closeButton>
        <span class="me-auto fw-bold">{{ toast.title }}</span>
      </CToastHeader>
      <CToastBody>
        {{ toast.content }}
      </CToastBody>
    </CToast>
  </CToaster>
  <CSpinner
    class="d-flex flex-column align-items-center text-center"
    v-if="!isLoaded"
  />
  <div class="row gutters-sm" v-if="isLoaded">
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
          <div class="row">
            <div class="col-sm-12">
              <a class="btn btn-primary" @click="editProfile">Ubah</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import placeholder from '@/assets/images/avatars/placeholder.png'

export default {
  name: 'ViewProfile',
  components: {},
  data() {
    return {
      isLoaded: false,
      toasts: [],
      profilePic: '',
      role: '',
      studentId: '',
      email: '',
      username: '',
      updatedAt: '',
      createdAt: '',
      errorMgs: '',
      ShowError: false,
    }
  },
  beforeMount() {
    this.getUserData()
  },
  methods: {
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
          this.role = userData.role
          this.profilePic = userData.profile_pic
            ? userData.profile_pic
            : placeholder
          this.studentId = userData.student_id
          this.email = userData.email
          this.updatedAt = new Date(userData.updatedAt).toLocaleString('en-GB')
          this.createdAt = new Date(userData.createdAt).toLocaleString('en-GB')
          this.isLoaded = true
          return result
        })
        .catch((error) => {
          this.toasts.push({
            title: error.response.data.status,
            content: error.response.data.message,
          })
        })
    },
  },
}
</script>
