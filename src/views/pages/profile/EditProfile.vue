<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardBody>
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
          <CForm class="row g-3 needs-validation" @submit="onSubmit">
            <CCol :md="4">
              <CFormLabel>Nama Lengkap</CFormLabel>
              <CFormInput
                v-model.trim="form.name"
                type="username"
                :placeholder="placeholder.username"
              />
            </CCol>
            <CCol :md="4">
              <CFormLabel>Email</CFormLabel>
              <CFormInput
                v-model.trim="form.email"
                type="text"
                :placeholder="placeholder.email"
                autocomplete="email"
              />
            </CCol>
            <CCol :md="4">
              <CFormLabel>Nomor Pokok Mahasiswa</CFormLabel>
              <CFormInput
                v-model.trim="form.student_id"
                type="text"
                :placeholder="placeholder.studentId"
              />
            </CCol>
            <CCol :md="4">
              <CFormInput
                type="file"
                id="formFile"
                label="Foto Profil"
                v-on:change="handleFileUpload"
              />
              <CProgress v-show="toggle" class="mt-3">
                <CProgressBar
                  color="info"
                  variant="striped"
                  animated
                  :value="uploadPercentage"
                />
              </CProgress>
            </CCol>
            <CCol :xs="12">
              <SubmitButton title="Simpan" :isSendingForm="isSendingForm" />
            </CCol>
          </CForm>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import axios from 'axios'
import SubmitButton from '@/components/SubmitButton.vue'

export default {
  name: 'EditProfile',
  components: { SubmitButton },
  data() {
    return {
      placeholder: {
        username: '',
        studentId: '',
        email: '',
      },
      form: {
        name: '',
        student_id: '',
        email: '',
      },
      file: '',
      toggle: false,
      uploadPercentage: 0,
      errorMgs: '',
      ShowError: false,
      successMsg: '',
      success: false,
      isSendingForm: false,
    }
  },
  beforeMount() {
    this.getUserData()
  },
  methods: {
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
          this.placeholder.username = userData.name
          this.placeholder.studentId = userData.student_id
          this.placeholder.email = userData.email
          return result
        })
        .catch((error) => {
          this.toasts.push({
            title: error.response.data.status,
            content: error.response.data.message,
          })
        })
    },
    handleFileUpload(event) {
      this.file = event.target.files[0]
    },
    onSubmit() {
      event.preventDefault()
      const obj = this.form
      Object.keys(obj).forEach(
        (k) => !obj[k] && obj[k] !== undefined && delete obj[k],
      )
      {
        if (this.file) this.form.profile_pic = this.file
        this.isSendingForm = true
        console.log(obj)
        axios
          .patch(this.$store.state.backendUrl + 'user', obj, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            onUploadProgress: function (progressEvent) {
              this.uploadPercentage = parseInt(
                Math.round((progressEvent.loaded / progressEvent.total) * 100),
              )
              this.toggle = true
            }.bind(this),
          })
          .then((response) => {
            if (response.status === 201) {
              this.success = true
              this.successMsg = 'Berhasil merubah data.'
              this.isSendingForm = false
              this.toggle = false
              this.reloadPage()
            }
          })
          .catch((error) => {
            console.log(error)
            this.ShowError = true
            this.errorMgs = error.response.data.message
            this.isSendingForm = false
            this.toggle = false
          })
      }
    },
    reloadPage() {
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    },
  },
}
</script>
