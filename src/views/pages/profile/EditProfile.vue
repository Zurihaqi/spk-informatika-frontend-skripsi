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
                type="name"
                :placeholder="placeholder.name"
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
                :placeholder="placeholder.student_id"
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
import placeholder from '@/assets/images/placeholder.png'
import CryptoJS from 'crypto-js'

export default {
  name: 'EditProfile',
  components: { SubmitButton, Alerts },
  data() {
    return {
      placeholder: {
        name: this.$store.state.name,
        student_id: this.$store.state.student_id,
        email: this.$store.state.email,
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
              Authorization: `Bearer ${this.$cookies.get('token')}`,
            },
            onUploadProgress: function (progressEvent) {
              if (obj.profile_pic) {
                this.toggle = true
                this.uploadPercentage = parseInt(
                  Math.round(
                    (progressEvent.loaded / progressEvent.total) * 100,
                  ),
                )
              }
            }.bind(this),
          })
          .then((response) => {
            if (response.status === 201) {
              const data = response.data.data
              const encryptedName = CryptoJS.AES.encrypt(
                data.name,
                process.env.VUE_APP_AES_SECRET,
              ).toString()
              const encryptedEmail = CryptoJS.AES.encrypt(
                data.email,
                process.env.VUE_APP_AES_SECRET,
              ).toString()
              const encryptedStudentId = CryptoJS.AES.encrypt(
                data.student_id,
                process.env.VUE_APP_AES_SECRET,
              ).toString()
              localStorage.setItem('name', encryptedName)
              localStorage.setItem('email', encryptedEmail)
              localStorage.setItem(
                'student_id',
                data.student_id ? encryptedStudentId : '',
              )
              localStorage.setItem(
                'profile_pic',
                data.profile_pic ? data.profile_pic : placeholder,
              )
              localStorage.setItem(
                'updatedAt',
                new Date(data.updatedAt).toLocaleString('en-GB'),
              )

              this.showSuccess = true
              this.successMsg = 'Berhasil merubah data.'
              this.isSendingForm = false
              this.toggle = false
              this.reloadPage()
            }
          })
          .catch((error) => {
            this.showError = true
            if (error.response.status === 413) {
              this.errorMsg =
                'Ukuran gambar terlalu besar. Ukuran maksimal adalah 5MB.'
              this.isSendingForm = false
              this.toggle = false
            } else {
              this.errorMsg =
                error.response !== undefined
                  ? error.response.data.message
                  : error
              this.isSendingForm = false
              this.toggle = false
            }
          })
      }
    },
    reloadPage() {
      setTimeout(() => {
        this.$router.go()
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
