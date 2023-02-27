<template>
  <!-- eslint-disable -->
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CAlert color="danger" :visible="ShowError" dismissible @close="() => { ShowError = false }">
                  {{ errorMgs }}
                </CAlert>
                <CForm @submit="onSubmit">
                  <h1>Masuk</h1>
                  <p class="text-medium-emphasis">
                    Masuk menggunakan email atau nomor pokok mahasiswa.
                  </p>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput v-model.trim="form.email" @input="setTouched('email')" type="text" placeholder="Email/NPM" 
                      autocomplete="email" feedback="Masukan email atau npm." :invalid="v$.form.email.$error" />
                  </CInputGroup>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput v-model.trim="form.password" @input="setTouched('password')" :type="passwordFieldType"
                    placeholder="Kata sandi" autocomplete="current-password" feedback="Masukan kata sandi."
                    :invalid="v$.form.password.$error" />    
                  </CInputGroup>
                  <div class="form-check form-switch mb-3">
                    <CFormCheck type="checkbox" @click="togglePassword" /> Tampilkan kata sandi 
                  </div>
                  <CRow>
                    <CCol :xs="6">
                      <SubmitButton title="Masuk" :isSendingForm="isSendingForm" />
                    </CCol>
                    <CCol :xs="6" class="text-right">
                      <CButton color="link" class="px-0">
                        Lupa kata sandi
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard class="text-white bg-primary py-5">
              <CCardBody class="text-center">
                <div>
                  <h2>Daftar</h2>
                  <p>
                    Belum memiliki akun? Daftar di sini.
                  </p>
                  <CButton color="light" variant="outline" class="mt-3" @click="Register">
                    Daftar
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
/* eslint-disable */
import axios from 'axios'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import SubmitButton from '@/components/SubmitButton.vue'
import jwt_decode from "jwt-decode";

export default {
  name: 'Login',
  setup() {
    return { v$: useVuelidate() }
  },
  components: { SubmitButton },
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      passwordFieldType: 'password',
      errorMgs: '', // to show error message
      ShowError: false, // flag to toggle errorMgs
      isSendingForm: false,
    }
  },
  validations() {
    return {
      form: {
        email: {
          required,
        },
        password: {
          required,
        },
      },
    }
  },
  methods: {
    togglePassword() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password'
    },
    Register() {
      this.$router.push('/register')
    },
    setTouched(theModel) {
      if (theModel == 'email' || theModel == 'all') { this.v$.form.email.$touch() }

      if (theModel == 'password' || theModel == 'all') { this.v$.form.password.$touch() }
    },
    onSubmit(event) {
      event.preventDefault()
      this.setTouched('all');
      if (!this.v$.$invalid) {
        this.isSendingForm = true;
        axios.post(
          this.$store.state.backendUrl + 'login', this.form,
          {
            headers: { "Content-Type": "application/json", }
          })
          .then((response) => {
            const decoded = jwt_decode(response.data.token)
            localStorage.setItem('role', decoded.role)
            
            this.$store.commit('saveLogin',
              {
                "token": response.data.token,
              });
            this.$router.push('/').then(() => { this.$router.go() })
            this.isSendingForm = false;

          })
          .catch((error) => {
            // login failed
            console.log(error);
            this.ShowError = true;
            this.errorMgs = error.response.data.message;
            this.isSendingForm = false;
          });
        }
    },
  },
}
</script>