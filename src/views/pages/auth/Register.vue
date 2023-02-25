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
                <h1>Daftar</h1>
                <p class="text-medium-emphasis">
                  Daftar untuk menggunakan SPK Peminatan Informatika.
                </p>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-user" />
                  </CInputGroupText>
                  <CFormInput
                    v-model.trim="form.name"
                    @input="setTouched('name')"
                    type="text"
                    placeholder="Nama lengkap"
                    autocomplete="username"
                    feedback="Masukkan nama lengkap."
                    :invalid="v$.form.name.$error"
                  />
                </CInputGroup>
                <CInputGroup class="mb-3">
                  <CInputGroupText>@</CInputGroupText>
                  <CFormInput
                    v-model.trim="form.email"
                    @input="setTouched('email')"
                    type="text"
                    placeholder="Email"
                    autocomplete="email"
                    feedback="Masukkan email yang valid."
                    :invalid="v$.form.email.$error"
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
        password: '',
        confirmPassword: '',
      },
      errorMgs: '',
      ShowError: false,
      successMsg: '',
      success: false,
      isSendingForm: false,
    }
  },
  validations() {
    return {
      form: {
        email: {
          required,
          email,
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
    setTouched(theModel) {
      if (theModel == 'email' || theModel == 'all') {
        this.v$.form.email.$touch()
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
        axios
          .post(this.$store.state.backendUrl + 'register', this.form, {
            headers: { 'Content-Type': 'application/json' },
          })
          .then((response) => {
            if (response.status === 201) {
              this.success = true
              this.successMsg = 'Berhasil mendaftar.'
              this.isSendingForm = false
              setTimeout(() => {
                this.goBack()
              }, 1000)
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
    goBack() {
      this.$router.push('login')
    },
  },
  components: { SubmitButton },
}
</script>
