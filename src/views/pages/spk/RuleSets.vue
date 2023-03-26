<template>
  <Alerts
    :showError="showError"
    :showSuccess="showSuccess"
    :errorMsg="errorMsg"
    :successMsg="successMsg"
    @update:showError="updateError"
    @update:showSuccess="updateSuccess"
  />
  <CModal
    :visible="confirmDelete"
    @close="
      () => {
        confirmDelete = false
      }
    "
  >
    <CModalHeader
      ><CModalTitle>Konfirmasi Hapus Rule</CModalTitle></CModalHeader
    >
    <CModalBody
      >Apakah anda yakin ingin menghapus rule dengan id <b>{{ id }}</b
      >?</CModalBody
    >
    <CModalFooter class="justify-content-start"
      ><CButton
        color="secondary"
        @click="
          () => {
            confirmDelete = false
          }
        "
        >Batal</CButton
      ><SubmitButton
        :isSendingForm="isSendingForm"
        title="Hapus"
        color="danger"
        @click="deleteRule()"
      ></SubmitButton
    ></CModalFooter>
  </CModal>
  <CModal
    :visible="addRuleModal"
    @close="
      () => {
        addRuleModal = false
      }
    "
  >
    <CModalHeader><CModalTitle>Tambah Rule</CModalTitle></CModalHeader>
    <CModalBody v-if="+spec_id === 1">
      <CForm>
        <CCol v-for="(course, index) in softDevCourseName" :key="index" xs>
          Nilai
          <CFormLabel>{{ course }}</CFormLabel>
          <CFormSelect
            class="mb-3"
            :options="options"
            v-model="form.condition[index]"
            @input="setTouched('condition')"
            feedback="Pilih kondisi."
            :invalid="v$.form.condition.$error"
          ></CFormSelect>
        </CCol>
        <CCol xs>
          <CFormLabel>Koneksi</CFormLabel>
          <CFormSelect
            class="mb-3"
            :options="options2"
            v-model="form.connection"
            @input="setTouched('connection')"
            feedback="Pilih koneksi."
            :invalid="v$.form.connection.$error"
          ></CFormSelect>
        </CCol>
        <CCol xs>
          <CFormLabel>Konklusi</CFormLabel>
          <CFormSelect
            class="mb-3"
            :options="options3"
            v-model="form.conclusion"
            @input="setTouched('conclusion')"
            feedback="Pilih konklusi."
            :invalid="v$.form.conclusion.$error"
          ></CFormSelect>
        </CCol>
      </CForm>
    </CModalBody>
    <CModalBody v-if="+spec_id === 2">
      <CForm>
        <CCol v-for="(course, index) in dataSciCourseName" :key="index" xs>
          Nilai
          <CFormLabel>{{ course }}</CFormLabel>
          <CFormSelect
            class="mb-3"
            :options="options"
            v-model="form.condition[index]"
            @input="setTouched('condition')"
            feedback="Pilih kondisi."
            :invalid="v$.form.condition.$error"
          ></CFormSelect>
        </CCol>
        <CCol xs>
          <CFormLabel>Koneksi</CFormLabel>
          <CFormSelect
            class="mb-3"
            :options="options2"
            v-model="form.connection"
            @input="setTouched('connection')"
            feedback="Pilih koneksi."
            :invalid="v$.form.connection.$error"
          ></CFormSelect>
        </CCol>
        <CCol xs>
          <CFormLabel>Konklusi</CFormLabel>
          <CFormSelect
            class="mb-3"
            :options="options3"
            v-model="form.conclusion"
            @input="setTouched('conclusion')"
            feedback="Pilih konklusi."
            :invalid="v$.form.conclusion.$error"
          ></CFormSelect>
        </CCol>
      </CForm>
    </CModalBody>
    <CModalBody v-if="+spec_id === 3">
      <CForm>
        <CCol v-for="(course, index) in networkingCourseName" :key="index" xs>
          Nilai
          <CFormLabel>{{ course }}</CFormLabel>
          <CFormSelect
            class="mb-3"
            :options="options"
            v-model="form.condition[index]"
            @input="setTouched('condition')"
            feedback="Pilih kondisi."
            :invalid="v$.form.condition.$error"
          ></CFormSelect>
        </CCol>
        <CCol xs>
          <CFormLabel>Koneksi</CFormLabel>
          <CFormSelect
            class="mb-3"
            :options="options2"
            v-model="form.connection"
            @input="setTouched('connection')"
            feedback="Pilih koneksi."
            :invalid="v$.form.connection.$error"
          ></CFormSelect>
        </CCol>
        <CCol xs>
          <CFormLabel>Konklusi</CFormLabel>
          <CFormSelect
            class="mb-3"
            :options="options3"
            v-model="form.conclusion"
            @input="setTouched('conclusion')"
            feedback="Pilih konklusi."
            :invalid="v$.form.conclusion.$error"
          ></CFormSelect>
        </CCol>
      </CForm>
    </CModalBody>
    <CModalFooter class="justify-content-start"
      ><CButton
        color="secondary"
        @click="
          () => {
            addRuleModal = false
          }
        "
        >Batal</CButton
      ><SubmitButton
        :isSendingForm="isSendingForm"
        title="Simpan"
        color="primary"
        @click="addRule"
      ></SubmitButton
    ></CModalFooter>
  </CModal>
  <CCard class="mb-3 bg-warning user-select-none">
    <CCardBody>
      <b>
        Catatan: Fuzzy rule sangat berperan penting terhadap perhitungan
        peminatan, ubah dengan hati-hati.
      </b>
    </CCardBody>
  </CCard>
  <CCard class="mb-3">
    <CCardHeader>
      <h6 class="text-center">Software Development</h6>
    </CCardHeader>
    <CCardBody
      disabled
      v-if="!isLoaded"
      class="justify-content-center text-center"
    >
      <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
      Memuat...
    </CCardBody>
    <CCardBody class="scrollable user-select-none" v-if="isLoaded">
      <CRow v-for="(item, i) in softDevCombined" :key="i">
        <CCol xs="auto">{{ item.id }}</CCol>
        <CCol>
          <p>
            <b>IF </b>
            <span v-html="item.rule"></span>
          </p>
        </CCol>
        <CCol xs="auto">
          <CButton
            @click="
              () => {
                confirmDelete = true
                passId(item.id)
              }
            "
          >
            <CIcon icon="cil-trash" />
          </CButton>
        </CCol>
        <hr />
      </CRow>
    </CCardBody>
    <CCardFooter v-if="isLoaded"
      ><CButton
        color="primary"
        size="sm"
        @click="
          () => {
            passSpecId(1)
            addRuleModal = true
          }
        "
        >Tambah</CButton
      ></CCardFooter
    >
  </CCard>
  <CCard class="mb-3">
    <CCardHeader><h6 class="text-center">Data Science</h6></CCardHeader>
    <CCardBody
      disabled
      v-if="!isLoaded"
      class="justify-content-center text-center"
    >
      <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
      Memuat...
    </CCardBody>
    <CCardBody class="scrollable user-select-none" v-if="isLoaded">
      <CRow v-for="(item, i) in dataSciCombined" :key="i">
        <CCol xs="auto">{{ item.id }}</CCol>
        <CCol>
          <p>
            <b>IF </b>
            <span v-html="item.rule"></span>
          </p>
        </CCol>
        <CCol xs="auto">
          <CButton
            @click="
              () => {
                confirmDelete = true
                passId(item.id)
              }
            "
          >
            <CIcon icon="cil-trash" />
          </CButton>
        </CCol>
        <hr />
      </CRow>
    </CCardBody>
    <CCardFooter v-if="isLoaded"
      ><CButton
        color="primary"
        size="sm"
        @click="
          () => {
            passSpecId(2)
            addRuleModal = true
          }
        "
        >Tambah</CButton
      ></CCardFooter
    >
  </CCard>
  <CCard class="mb-3">
    <CCardHeader
      ><h6 class="text-center">
        Infrastruktur dan Keamanan Jaringan
      </h6></CCardHeader
    >
    <CCardBody
      disabled
      v-if="!isLoaded"
      class="justify-content-center text-center"
    >
      <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
      Memuat...
    </CCardBody>
    <CCardBody class="scrollable user-select-none" v-if="isLoaded">
      <CRow v-for="(item, i) in networkingCombined" :key="i">
        <CCol xs="auto">{{ item.id }}</CCol>
        <CCol>
          <p>
            <b>IF </b>
            <span v-html="item.rule"></span>
          </p>
        </CCol>
        <CCol xs="auto">
          <CButton
            @click="
              () => {
                confirmDelete = true
                passId(item.id)
              }
            "
          >
            <CIcon icon="cil-trash" />
          </CButton>
        </CCol>
        <hr />
      </CRow>
    </CCardBody>
    <CCardFooter v-if="isLoaded"
      ><CButton
        color="primary"
        size="sm"
        @click="
          () => {
            passSpecId(3)
            addRuleModal = true
          }
        "
        >Tambah</CButton
      ></CCardFooter
    >
  </CCard>
</template>

<script>
import axios from 'axios'
import Alerts from '@/components/Alerts.vue'
import SubmitButton from '@/components/SubmitButton.vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default {
  name: 'RuleSets',
  setup() {
    return { v$: useVuelidate() }
  },
  components: { Alerts, SubmitButton },
  data() {
    return {
      options: [
        {
          label: 'Pilih',
          value: undefined,
          selected: true,
          disabled: true,
          hidden: true,
        },
        { label: 'Rendah', value: 'rendah' },
        { label: 'Sedang', value: 'sedang' },
        { label: 'Tinggi', value: 'tinggi' },
      ],
      options2: [
        {
          label: 'Pilih',
          value: undefined,
          selected: true,
          disabled: true,
          hidden: true,
        },
        { label: 'and', value: 'and' },
        { label: 'or', value: 'or' },
      ],
      options3: [
        {
          label: 'Pilih',
          value: undefined,
          selected: true,
          disabled: true,
          hidden: true,
        },
        { label: 'disarankan', value: 'disarankan' },
        { label: 'tidak-disarankan', value: 'tidak-disarankan' },
      ],
      showError: false,
      showSuccess: false,
      errorMsg: '',
      successMsg: '',
      softDevCombined: [],
      dataSciCombined: [],
      networkingCombined: [],
      softDevCourseName: [],
      dataSciCourseName: [],
      networkingCourseName: [],
      isLoaded: false,
      confirmDelete: false,
      addRuleModal: false,
      id: '',
      spec_id: '',
      form: {
        condition: [],
        conclusion: '',
        connection: '',
      },
      isSendingForm: false,
    }
  },
  validations() {
    return {
      form: {
        condition: {
          required,
        },
        connection: {
          required,
        },
        conclusion: {
          required,
        },
      },
    }
  },
  beforeMount() {
    this.getData()
  },
  methods: {
    setTouched(theModel) {
      if (theModel == 'condition' || theModel == 'all') {
        this.v$.form.condition.$touch()
      }

      if (theModel == 'connection' || theModel == 'all') {
        this.v$.form.connection.$touch()
      }

      if (theModel == 'conclusion' || theModel == 'all') {
        this.v$.form.conclusion.$touch()
      }
    },
    passId(index) {
      this.id = index
    },
    passSpecId(spec) {
      this.spec_id = spec
    },
    async getData() {
      try {
        const endpoints = [
          this.$store.state.backendUrl + 'rule',
          this.$store.state.backendUrl + 'course',
        ]
        await Promise.all(
          endpoints.map((endpoint) =>
            axios.get(endpoint, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.$cookies.get('token')}`,
              },
            }),
          ),
        )
          .then((results) => {
            if (results[0].status === 201 && results[1].status === 201) {
              const rules = results[0].data.data
              const courses = results[1].data.data

              let softDevCourses = []
              let dataSciCourses = []
              let networkingCourses = []
              let softDevRules = []
              let dataSciRules = []
              let networkingRules = []

              rules.forEach((e) => {
                if (e.spec_id === 1) {
                  softDevRules.push(e)
                }
                if (e.spec_id === 2) {
                  dataSciRules.push(e)
                }
                if (e.spec_id === 3) {
                  networkingRules.push(e)
                }
              })

              courses.forEach((e) => {
                if (e.spec_id === 1) {
                  softDevCourses.push(e.course_name)
                  this.softDevCourseName.push(e.course_name)
                }
                if (e.spec_id === 2) {
                  dataSciCourses.push(e.course_name)
                  this.dataSciCourseName.push(e.course_name)
                }
                if (e.spec_id === 3) {
                  networkingCourses.push(e.course_name)
                  this.networkingCourseName.push(e.course_name)
                }
              })

              for (let i = 0; i < softDevRules.length; i++) {
                const { id, condition, connection, conclusion } =
                  softDevRules[i]
                const result = []

                for (let j = 0; j < softDevCourses.length; j++) {
                  if (condition[j]) {
                    result.push(
                      `${softDevCourses[j]} <u>${
                        condition[j] ? condition[j] : 'Kosong'
                      }</u>`,
                    )
                    if (j < softDevCourses.length - 1) {
                      result.push(`<b>${connection.toUpperCase()}</b>`)
                    }
                  }
                }
                result.push(
                  `<b>THEN</b> Software Development <u>${conclusion[0]}</u>`,
                )
                this.softDevCombined.push({
                  spec_id: 1,
                  id: id,
                  rule: result.join(' '),
                })
              }

              for (let i = 0; i < dataSciRules.length; i++) {
                const { id, condition, connection, conclusion } =
                  dataSciRules[i]
                const result = []

                for (let j = 0; j < dataSciCourses.length; j++) {
                  if (condition[j]) {
                    result.push(
                      `${dataSciCourses[j]} <u>${
                        condition[j] ? condition[j] : 'Kosong'
                      }</u>`,
                    )
                    if (j < dataSciCourses.length - 1) {
                      result.push(`<b>${connection.toUpperCase()}</b>`)
                    }
                  }
                }
                result.push(`<b>THEN</b> Data Science <u>${conclusion[0]}</u>`)
                this.dataSciCombined.push({
                  spec_id: 2,
                  id: id,
                  rule: result.join(' '),
                })
              }

              for (let i = 0; i < networkingRules.length; i++) {
                const { id, condition, connection, conclusion } =
                  networkingRules[i]
                const result = []

                for (let j = 0; j < networkingCourses.length; j++) {
                  if (condition[j]) {
                    result.push(
                      `${networkingCourses[j]} <u>${
                        condition[j] ? condition[j] : 'Kosong'
                      }</u>`,
                    )
                    if (j < networkingCourses.length - 1) {
                      result.push(`<b>${connection.toUpperCase()}</b>`)
                    }
                  }
                }
                result.push(
                  `<b>THEN</b> Infrastruktur dan Keamanan Jaringan <u>${conclusion[0]}</u>`,
                )
                this.networkingCombined.push({
                  spec_id: 3,
                  id: id,
                  rule: result.join(' '),
                })
              }
              this.isLoaded = true
            }
          })
          .catch((error) => {
            this.showError = true
            this.errorMsg =
              error.response !== undefined ? error.response.data.message : error
          })
      } catch (error) {
        this.showError = true
        this.errorMsg =
          error.response !== undefined ? error.response.data.message : error
      }
    },
    deleteRule() {
      this.isSendingForm = true
      axios
        .delete(this.$store.state.backendUrl + `rule/${+this.id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.$cookies.get('token')}`,
          },
        })
        .then((result) => {
          if (result.status === 201) {
            this.isSendingForm = false
            this.confirmDelete = false
            this.showSuccess = true
            this.successMsg = 'Berhasil menghapus rule.'
            this.toTop()
            this.reloadPage()
          }
        })
        .catch((error) => {
          this.isSendingForm = false
          this.confirmDelete = false
          this.showError = true
          this.errorMsg =
            error.response !== undefined ? error.response.data.message : error
          this.toTop()
        })
    },
    addRule() {
      this.setTouched('all')
      if (!this.v$.$invalid) {
        this.isSendingForm = true
        let dataToSend = {
          condition: undefined,
          connection: '',
          conclusion: '',
        }
        const mapped = Array.from(this.form.condition, (item) =>
          typeof item === 'undefined' || item === 'Kosong' ? null : item,
        )

        dataToSend.condition = mapped
        dataToSend.connection = this.form.connection
        dataToSend.conclusion = this.form.conclusion
        dataToSend.spec_id = +this.spec_id

        axios
          .post(this.$store.state.backendUrl + `rule`, dataToSend, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.$cookies.get('token')}`,
            },
          })
          .then((result) => {
            if (result.status === 201) {
              this.isSendingForm = false
              this.addRuleModal = false
              this.showSuccess = true
              this.successMsg = 'Berhasil menambahkan rule.'
              this.toTop()
              this.reloadPage()
            }
          })
          .catch((error) => {
            this.isSendingForm = false
            this.addRuleModal = false
            this.showError = true
            this.errorMsg =
              error.response !== undefined ? error.response.data.message : error
            this.toTop()
          })
      }
    },
    updateError(value) {
      this.showError = value
    },
    updateSuccess(value) {
      this.showSuccess = value
    },
    toTop: function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
    reloadPage() {
      setTimeout(() => {
        this.$router.go()
      }, 1000)
    },
  },
}
</script>
