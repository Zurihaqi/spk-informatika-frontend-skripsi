<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer v-if="validOtp">
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
                <h1 class="text-center mb-4">Reset Kata Sandi</h1>
                <CInputGroup class="mb-3">
                  <CInputGroupText @click="togglePassword()" class="clickable">
                    <i
                      class="bi bi-eye-slash-fill"
                      v-if="passwordFieldType === 'password'"
                    ></i>
                    <i
                      class="bi bi-eye"
                      v-if="passwordFieldType === 'text'"
                    ></i>
                  </CInputGroupText>
                  <CFormInput
                    v-model.trim="form.password"
                    @input="setTouched('password')"
                    :type="passwordFieldType"
                    placeholder="Kata Sandi Baru"
                    autocomplete="password"
                    feedback="Kata sandi minimal 6 huruf."
                    :invalid="v$.form.password.$error"
                  />
                </CInputGroup>
                <CInputGroup class="mb-3">
                  <CInputGroupText
                    ><CIcon icon="cil-lock-locked"
                  /></CInputGroupText>
                  <CFormInput
                    v-model.trim="form.confirmPassword"
                    @input="setTouched('confirmPassword')"
                    type="password"
                    placeholder="Konfirmasi Kata Sandi Baru"
                    autocomplete="password"
                    feedback="Kata sandi tidak sama."
                    :invalid="v$.form.confirmPassword.$error"
                  />
                </CInputGroup>
                <div class="d-grid gap-2">
                  <SubmitButton
                    :disabled="isSendingForm"
                    title="Simpan"
                    :isSendingForm="isSendingForm"
                  />
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
    <CContainer v-else>
      <CRow class="justify-content-center">
        <CCol :md="9" :lg="7" :xl="6">
          <CCard class="mx-4 text-center">
            <CCardBody> <h4>Link ini sudah tidak berlaku.</h4> </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import axios from 'axios'
import useVuelidate from '@vuelidate/core'
import { required, minLength, sameAs } from '@vuelidate/validators'
import SubmitButton from '@/components/SubmitButton.vue'

export default {
  name: 'ResetPassword',
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      form: {
        password: '',
        confirmPassword: '',
      },
      passwordFieldType: 'password',
      errorMgs: '',
      ShowError: false,
      successMsg: '',
      success: false,
      isSendingForm: false,
      validOtp: false,
    }
  },
  validations() {
    return {
      form: {
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
  beforeMount() {
    this.validateOtp()
  },
  methods: {
    setTouched(theModel) {
      if (theModel == 'password' || theModel == 'all') {
        this.v$.form.password.$touch()
      }
      if (theModel == 'confirmPassword' || theModel == 'all') {
        this.v$.form.confirmPassword.$touch()
      }
    },
    async onSubmit(event) {
      event.preventDefault()
      this.setTouched('all')
      if (!this.v$.$invalid) {
        this.isSendingForm = true
        try {
          const token = this.$route.params.token
          const userId = this.$route.params.userid

          const response = await axios.post(
            this.$store.state.backendUrl + 'forgot-pass/validate',
            { password: this.form.password, otp: token, user_id: userId },
            {
              headers: { 'Content-Type': 'application/json' },
            },
          )

          if (response.status === 201) {
            let time = 5

            const countdown = (remainingTime) => {
              if (remainingTime === 0) {
                this.$router.push({ path: '/login' })
              } else {
                this.successMsg = `Berhasil mengubah kata sandi.\nAnda akan diarahkan ke halaman login dalam ${remainingTime}.`
                setTimeout(() => {
                  countdown(remainingTime - 1)
                }, 1000)
              }
            }
            countdown(time)
            this.success = true
            this.isSendingForm = false
          }
        } catch (error) {
          this.ShowError = true
          this.errorMgs =
            error.response !== undefined ? error.response.data.message : error
          this.isSendingForm = false
        }
      }
    },
    validateOtp() {
      const token = this.$route.params.token
      const userId = this.$route.params.userid

      axios
        .post(
          this.$store.state.backendUrl + 'forgot-pass/validate?beforeLoad=true',
          { otp: token, user_id: userId },
          {
            headers: { 'Content-Type': 'application/json' },
          },
        )
        .then((result) => {
          if (result.status === 201) {
            this.validOtp = true
          }
        })
        .catch((error) => {
          if (error) {
            this.validOtp = false
          }
        })
    },
    togglePassword() {
      this.passwordFieldType =
        this.passwordFieldType === 'password' ? 'text' : 'password'
    },
  },
  components: { SubmitButton },
}
</script>
