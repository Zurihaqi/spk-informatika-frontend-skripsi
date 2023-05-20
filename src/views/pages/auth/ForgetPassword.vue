<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="9" :lg="7" :xl="6">
          <CCard class="mx-4">
            <CCardBody class="p-4">
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
              <CForm @submit="onSubmit">
                <h1 class="text-center mb-4">Lupa Kata Sandi</h1>
                <p>
                  Masukan alamat email anda. Kami akan mengirimkan link untuk
                  mengatur ulang kata sandi ke email tersebut.
                </p>
                <CInputGroup class="mb-3">
                  <CInputGroupText><CIcon icon="cil-at" /></CInputGroupText>
                  <CFormInput
                    v-model.trim="form.email"
                    @input="setTouched('email')"
                    type="text"
                    placeholder="Email"
                    autocomplete="email"
                    feedback="Masukan email yang valid."
                    :invalid="v$.form.email.$error"
                  />
                </CInputGroup>
                <vue-recaptcha
                  class="d-flex justify-content-center mb-3"
                  v-show="showRecaptcha"
                  :sitekey="siteKey"
                  size="normal"
                  theme="light"
                  hl="id"
                  @verify="recaptchaVerified"
                  @expire="recaptchaExpired"
                  @fail="recaptchaFailed"
                  ref="vueRecaptcha"
                >
                </vue-recaptcha>
                <div class="d-grid gap-2">
                  <SubmitButton
                    :disabled="isSendingForm"
                    title="Kirim"
                    :isSendingForm="isSendingForm"
                  />
                  <CButton color="primary" @click="goBack()">Kembali</CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import axios from 'axios'
import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import SubmitButton from '@/components/SubmitButton.vue'
import vueRecaptcha from 'vue3-recaptcha2'

export default {
  name: 'ForgetPassword',
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      form: {
        email: '',
      },
      errorMgs: '',
      ShowError: false,
      successMsg: '',
      success: false,
      isSendingForm: false,
      showRecaptcha: true,
      siteKey: this.$store.state.siteKey,
      recaptchaTokenValid: false,
    }
  },
  validations() {
    return {
      form: {
        email: {
          required,
          email,
        },
      },
    }
  },
  methods: {
    async recaptchaVerified(token) {
      try {
        const response = await axios.post(
          this.$store.state.backendUrl + 'verify',
          { response_key: token },
          {
            headers: { 'Content-Type': 'application/json' },
          },
        )

        if (response.status === 201) {
          this.recaptchaTokenValid = true
        }
      } catch (error) {
        this.ShowError = true
        this.errorMgs =
          error.response !== undefined ? error.response.data.message : error
        this.isSendingForm = false
      }
    },
    recaptchaExpired() {
      this.recaptchaTokenValid = false
      this.$refs.vueRecaptcha.reset()
    },
    recaptchaFailed(error) {
      this.recaptchaTokenValid = false
      this.ShowError = true
      this.errorMgs =
        error.response !== undefined ? error.response.data.message : error
      this.isSendingForm = false
    },
    setTouched(theModel) {
      if (theModel == 'email' || theModel == 'all') {
        this.v$.form.email.$touch()
      }
    },
    async onSubmit(event) {
      event.preventDefault()
      this.setTouched('all')
      if (!this.v$.$invalid) {
        try {
          this.isSendingForm = true
          if (!this.recaptchaTokenValid) {
            throw 'Harap centang kotak reCAPTCHA.'
          }
          const response = await axios.post(
            this.$store.state.backendUrl + 'forgot-pass',
            this.form,
            {
              headers: { 'Content-Type': 'application/json' },
            },
          )

          if (response.status === 201) {
            this.success = true
            this.successMsg =
              'Berhasil mengirim, harap cek kotak masuk email anda.'
            this.isSendingForm = false
            this.v$.form.$reset()
            this.form = {}
          }
        } catch (error) {
          this.ShowError = true
          this.errorMgs =
            error.response !== undefined ? error.response.data.message : error
          this.isSendingForm = false
        }
      }
    },
    goBack() {
      this.$router.push('login')
    },
  },
  components: { SubmitButton, vueRecaptcha },
}
</script>
