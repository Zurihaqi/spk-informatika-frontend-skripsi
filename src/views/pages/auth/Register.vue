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
                <h1 class="text-center mb-4">Daftar</h1>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-user" />
                  </CInputGroupText>
                  <CFormInput
                    v-model.trim="form.name"
                    @input="setTouched('name')"
                    type="text"
                    placeholder="Nama lengkap"
                    feedback="Masukan nama lengkap."
                    :invalid="v$.form.name.$error"
                  />
                </CInputGroup>
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
                <CInputGroup class="mb-3">
                  <CInputGroupText
                    ><CIcon icon="cil-education"
                  /></CInputGroupText>
                  <CFormInput
                    v-model.trim="form.student_id"
                    @input="setTouched('student_id')"
                    type="text"
                    placeholder="Nomor Pokok Mahasiswa"
                    feedback="Masukan nomor pokok mahasiswa yang valid."
                    :invalid="v$.form.student_id.$error"
                  />
                </CInputGroup>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-lock-locked" />
                  </CInputGroupText>
                  <CFormInput
                    v-model.trim="form.password"
                    @input="setTouched('password')"
                    type="password"
                    placeholder="Kata sandi"
                    autocomplete="new-password"
                    feedback="Kata sandi minimal 6 huruf."
                    :invalid="v$.form.password.$error"
                  />
                </CInputGroup>
                <CInputGroup class="mb-4">
                  <CInputGroupText>
                    <CIcon icon="cil-lock-locked" />
                  </CInputGroupText>
                  <CFormInput
                    v-model.trim="form.confirmPassword"
                    @input="setTouched('confirmPassword')"
                    type="password"
                    placeholder="Ulangi kata sandi"
                    autocomplete="new-password"
                    feedback="Kata sandi tidak sama."
                    :invalid="v$.form.confirmPassword.$error"
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
                  <SubmitButton title="Daftar" :isSendingForm="isSendingForm" />
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
import { required, email, minLength, sameAs } from '@vuelidate/validators'
import SubmitButton from '@/components/SubmitButton.vue'
import vueRecaptcha from 'vue3-recaptcha2'

export default {
  name: 'Register',
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        student_id: '',
        password: '',
        confirmPassword: '',
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
        student_id: {
          required,
        },
        password: {
          required,
          minLength: minLength(6),
        },
        name: {
          required,
        },
        confirmPassword: {
          required,
          sameAsPassword: sameAs(this.form.password),
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
      if (theModel == 'student_id' || theModel == 'all') {
        this.v$.form.student_id.$touch()
      }
      if (theModel == 'password' || theModel == 'all') {
        this.v$.form.password.$touch()
      }
      if (theModel == 'name' || theModel == 'all') {
        this.v$.form.name.$touch()
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
        try {
          if (!this.recaptchaTokenValid) {
            throw 'Harap centang kotak reCAPTCHA.'
          }
          axios
            .post(this.$store.state.backendUrl + 'register', this.form, {
              headers: { 'Content-Type': 'application/json' },
            })
            .then((response) => {
              if (response.status === 201) {
                this.success = true
                this.successMsg = 'Berhasil mendaftar.'
                this.isSendingForm = false
                this.v$.form.$reset()
                this.form = {}
              }
            })
            .catch((error) => {
              this.ShowError = true
              this.errorMgs =
                error.response !== undefined
                  ? error.response.data.message
                  : error
              this.isSendingForm = false
            })
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
