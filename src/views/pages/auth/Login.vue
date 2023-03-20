<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCardGroup class="w-80">
          <CCard>
            <CCardBody class="mx-auto">
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
              <CForm @submit="onSubmit">
                <h1 class="text-center py-4">Masuk</h1>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-user" />
                  </CInputGroupText>
                  <CFormInput
                    v-model.trim="form.email"
                    @input="setTouched('email')"
                    type="text"
                    placeholder="Email/NPM"
                    autocomplete="email"
                    feedback="Masukan email atau npm."
                    :invalid="v$.form.email.$error"
                  />
                </CInputGroup>
                <CInputGroup class="mb-3 clickable">
                  <CInputGroupText @click="togglePassword()">
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
                    placeholder="Kata sandi"
                    autocomplete="current-password"
                    feedback="Masukan kata sandi."
                    :invalid="v$.form.password.$error"
                  />
                </CInputGroup>
                <CRow class="my-3">
                  <SubmitButton
                    shape="rounded-pill"
                    title="Masuk"
                    :isSendingForm="isSendingForm"
                  />
                </CRow>
              </CForm>
              <p class="text-center mt-2">
                Belum punya akun?
                <router-link to="register">Daftar di sini.</router-link>
              </p>
            </CCardBody>
          </CCard>
          <CCard>
            <CCarousel controls indicators>
              <CCarouselItem>
                <img class="img-fluid" :src="logoBG" />
              </CCarouselItem>
              <CCarouselItem>
                <img class="img-fluid" :src="logoBG" />
              </CCarouselItem>
            </CCarousel>
          </CCard>
        </CCardGroup>
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
import logo from '@/assets/logo-trimmed.png'
import logoBG from '@/assets/logoBG.png'

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
      errorMgs: '',
      ShowError: false,
      isSendingForm: false,
      icon: 'bi bi-eye-slash',
      logo: logo,
      logoBG: logoBG,
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
    setTouched(theModel) {
      if (theModel == 'email' || theModel == 'all') { this.v$.form.email.$touch() }

      if (theModel == 'password' || theModel == 'all') { this.v$.form.password.$touch() }
    },
    onSubmit(event) {
      event.preventDefault()
      this.setTouched('all')
      if (!this.v$.$invalid) {
        this.isSendingForm = true
        axios.post(
          this.$store.state.backendUrl + 'login', this.form,
          {
            headers: { "Content-Type": "application/json", }
          })
          .then((response) => {
            if(response.status === 201){
              this.$store.commit('saveLogin',
                {
                  "token": response.data.token,
                });
                this.$router.push('/').then(() => {this.$router.go()})
                this.isSendingForm = false;
            }
          })
          .catch((error) => {
            this.ShowError = true;
            this.errorMgs = error.response !== undefined ? error.response.data.message : error
            this.isSendingForm = false;
          });
        }
    },
  },
}
</script>