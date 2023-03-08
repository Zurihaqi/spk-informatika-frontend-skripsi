<template>
  <CRow class="row">
    <CCol class="col-sm-6 mx-auto">
      <CCard>
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
import Alerts from '@/components/Alerts.vue'
import useVuelidate from '@vuelidate/core'
import { required, minLength, sameAs } from '@vuelidate/validators'

export default {
  name: 'ChangePassword',
  setup() {
    return { v$: useVuelidate() }
  },
  components: { SubmitButton, Alerts },
  data() {
    return {
      form: { oldPassword: '', password: '', confirmPassword: '' },
      showError: false,
      errorMsg: '',
      successMsg: '',
      showSuccess: false,
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
                Authorization: `Bearer ${this.$cookies.get('token')}`,
              },
            },
          )
          .then((response) => {
            if (response.status === 201) {
              this.showSuccess = true
              this.successMsg =
                'Berhasil merubah password. Lakukan login ulang.'
              this.isSendingForm = false
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
            this.isSendingForm = false
          })
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
