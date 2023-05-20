<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
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
      <CRow :xs="{ cols: 1, gutter: 2 }" :md="{ cols: 2 }">
        <CCol xs>
          <CCard class="h-100">
            <CCardBody class="card-body-login">
              <CForm @submit="onSubmit">
                <h1 class="text-center py-2">Masuk</h1>
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
                    placeholder="Kata sandi"
                    autocomplete="current-password"
                    feedback="Masukan kata sandi."
                    :invalid="v$.form.password.$error"
                  />
                </CInputGroup>
                <CRow class="my-3">
                  <SubmitButton
                    :disabled="isSendingForm || !isFormValid"
                    shape="rounded-pill"
                    title="Masuk"
                    :isSendingForm="isSendingForm"
                  />
                </CRow>
              </CForm>
              <p class="text-center">
                Belum punya akun?
                <router-link to="register">Daftar di sini.</router-link> Atau
                <router-link to="admin-register"
                  >daftar menjadi pengelola.</router-link
                ><br />
                <router-link to="forget-pass">Lupa Kata Sandi</router-link>
              </p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs>
          <CCard
            class="h-100 justify-content-center align-self-center"
            style="background-color: #2b4b82"
          >
            <CCarousel controls indicators>
              <CCarouselItem>
                <img class="img-fluid" :src="slides[0]" />
              </CCarouselItem>
              <CCarouselItem>
                <img class="img-fluid" :src="slides[1]" />
              </CCarouselItem>
              <CCarouselItem>
                <img class="img-fluid" :src="slides[2]" />
              </CCarouselItem>
              <CCarouselItem>
                <img class="img-fluid" :src="slides[3]" />
              </CCarouselItem>
            </CCarousel>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<style>
.card-body-login {
  margin: 0 auto;
  width: 300px;
}
</style>

<script>
import axios from 'axios'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import SubmitButton from '@/components/SubmitButton.vue'
import slide1 from '@/assets/images/1.png'
import slide2 from '@/assets/images/2.png'
import slide3 from '@/assets/images/3.png'
import slide4 from '@/assets/images/4.png'

export default {
  name: 'Login',
  setup() {
    return { v$: useVuelidate() }
  },
  computed: {
    isFormValid() {
      return !this.v$.$invalid
    },
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
      slides: [slide1, slide2, slide3, slide4],
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
      this.passwordFieldType =
        this.passwordFieldType === 'password' ? 'text' : 'password'
    },
    setTouched(theModel) {
      if (theModel == 'email' || theModel == 'all') {
        this.v$.form.email.$touch()
      }

      if (theModel == 'password' || theModel == 'all') {
        this.v$.form.password.$touch()
      }
    },
    async onSubmit(event) {
      event.preventDefault()
      this.setTouched('all')
      if (!this.v$.$invalid) {
        this.isSendingForm = true

        try {
          const { email, password } = this.form
          const response = await axios.post(
            this.$store.state.backendUrl + 'login',
            { email, password },
            {
              headers: { 'Content-Type': 'application/json' },
            },
          )

          if (response.status === 201) {
            this.$store.commit('saveLogin', {
              token: response.data.token,
            })
            this.$router.push('/').then(() => {
              this.$router.go()
            })
            this.isSendingForm = false
          }
        } catch (error) {
          this.ShowError = true
          this.errorMgs = error.response.data.message
        }

        this.isSendingForm = false
      }
    },
  },
}
</script>
