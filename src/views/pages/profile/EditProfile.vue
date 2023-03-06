<template>
  <CRow class="row">
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardBody>
          <Alerts
            :showError="showError"
            :showSuccess="showSuccess"
            :errorMsg="errorMsg"
            :successMsg="successMsg"
            @update:showError="updateError"
            @update:showSuccess="updateSuccess"
          />
          <CForm class="row g-3 needs-validation" @submit="onSubmit">
            <CCol :md="6">
              <CFormLabel>Nama Lengkap</CFormLabel>
              <CFormInput
                v-model.trim="form.name"
                type="username"
                :placeholder="placeholder.username"
              />
            </CCol>
            <CCol :md="6">
              <CFormLabel>Email</CFormLabel>
              <CFormInput
                v-model.trim="form.email"
                type="text"
                :placeholder="placeholder.email"
                autocomplete="email"
              />
            </CCol>
            <CCol :md="6">
              <CFormLabel>Nomor Pokok Mahasiswa</CFormLabel>
              <CFormInput
                v-model.trim="form.student_id"
                type="text"
                :placeholder="placeholder.studentId"
              />
            </CCol>
            <CCol :md="6">
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
import Alerts from '@/components/Alerts.vue'

export default {
  name: 'EditProfile',
  components: { SubmitButton, Alerts },
  data() {
    return {
      placeholder: {
        username: localStorage.getItem('username'),
        studentId: localStorage.getItem('student_id'),
        email: localStorage.getItem('email'),
      },
      form: {
        name: '',
        student_id: '',
        email: '',
      },
      file: '',
      toggle: false,
      uploadPercentage: 0,
      errorMsg: '',
      showError: false,
      successMsg: '',
      showSuccess: false,
      isSendingForm: false,
    }
  },
  methods: {
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
              const result = response.data.data
              localStorage.setItem('profile_pic', result.profile_pic)
              localStorage.setItem('username', result.name)
              localStorage.setItem('email', result.email)
              result.student_id
                ? localStorage.setItem('student_id', result.student_id)
                : localStorage.setItem('student_id', '')

              this.showSuccess = true
              this.successMsg = 'Berhasil merubah data.'
              this.isSendingForm = false
              this.toggle = false
              this.reloadPage()
            }
          })
          .catch((error) => {
            this.showError = true
            this.errorMsg = error.response.data.message
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
    updateError(value) {
      this.showError = value
    },
    updateSuccess(value) {
      this.showSuccess = value
    },
  },
}
</script>
