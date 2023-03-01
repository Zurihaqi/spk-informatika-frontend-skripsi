<template>
  <CRow class="row">
    <CCol class="col-sm-6 mx-auto">
      <CCard>
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
            <CRow>
              <CCol class="mt-3">
                <CFormLabel>Kata Sandi Lama</CFormLabel>
                <CFormInput
                  v-model.trim="form.oldPassword"
                  @input="setTouched('oldPassword')"
                  :type="passwordFieldType"
                  autocomplete="password"
                  feedback="Masukan kata sandi lama."
                  :invalid="v$.form.oldPassword.$error"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol class="mt-3">
                <CFormLabel>Kata Sandi Baru</CFormLabel>
                <CFormInput
                  v-model.trim="form.password"
                  @input="setTouched('password')"
                  :type="passwordFieldType"
                  autocomplete="new-password"
                  feedback="Kata sandi minimal 6 huruf."
                  :invalid="v$.form.password.$error"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol class="mt-3">
                <CFormLabel>Konfirmasi Kata Sandi Baru</CFormLabel>
                <CFormInput
                  v-model.trim="form.confirmPassword"
                  @input="setTouched('confirmPassword')"
                  :type="passwordFieldType"
                  autocomplete="new-password"
                  feedback="Kata sandi tidak sama."
                  :invalid="v$.form.confirmPassword.$error"
                />
              </CCol>
            </CRow>
            <CRow class="mt-3">
              <CCol>
                <SubmitButton title="Simpan" :isSendingForm="isSendingForm" />
              </CCol>
              <CCol class="form-check form-switch text-right">
                <CFormCheck type="checkbox" @click="togglePassword" />
                Tampilkan kata sandi
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import axios from 'axios'
import SubmitButton from '@/components/SubmitButton.vue'
import useVuelidate from '@vuelidate/core'
import { required, minLength, sameAs } from '@vuelidate/validators'

export default {
  name: 'ChangePassword',
  setup() {
    return { v$: useVuelidate() }
  },
  components: { SubmitButton },
  data() {
    return {
      form: { oldPassword: '', password: '', confirmPassword: '' },
      ShowError: false,
      successMsg: '',
      success: false,
      isSendingForm: false,
      passwordFieldType: 'password',
    }
  },
  validations() {
    return {
      form: {
        oldPassword: {
          required,
        },
        password: {
          required,
          minLength: minLength(6),
        },
        confirmPassword: {
          required,
          sameAsPassword: sameAs(this.form.password),
        },
      },
    }
  },
  methods: {
    togglePassword() {
      this.passwordFieldType =
        this.passwordFieldType === 'password' ? 'text' : 'password'
    },
    setTouched(theModel) {
      if (theModel == 'oldPassword' || theModel == 'all') {
        this.v$.form.oldPassword.$touch()
      }

      if (theModel == 'password' || theModel == 'all') {
        this.v$.form.password.$touch()
      }

      if (theModel == 'confirmPassword' || theModel == 'all') {
        this.v$.form.confirmPassword.$touch()
      }
    },
    onSubmit(event) {
      event.preventDefault()
      this.setTouched('all')
      if (!this.v$.$invalid) {
        this.isSendingForm = true
        axios
          .patch(
            this.$store.state.backendUrl + 'user/update-password',
            this.form,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            },
          )
          .then((response) => {
            if (response.status === 201) {
              this.success = true
              this.successMsg =
                'Berhasil merubah password. Lakukan login ulang.'
              this.isSendingForm = false
              this.backToLogin()
            }
          })
          .catch((error) => {
            console.log(error)
            this.ShowError = true
            this.errorMgs = error.response.data.message
            this.isSendingForm = false
          })
      }
    },
    backToLogin() {
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    },
  },
}
</script>
