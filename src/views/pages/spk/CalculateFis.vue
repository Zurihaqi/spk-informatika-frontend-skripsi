<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <CModal
    alignment="center"
    :visible="showDetail"
    @close="
      () => {
        showDetail = false
      }
    "
  >
    <CModalHeader>
      <CModalTitle>Rincian Rekomendasi</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <b>Nilai Keluaran Crisp</b><br />Software Development:
      <b>{{ crispOutputs[0] }}</b>
      <br />Data Science: <b>{{ crispOutputs[1] }}</b> <br />Infratruktur dan
      Keamanan Jaringan: <b>{{ crispOutputs[2] }}</b> <br /><br /><b
        >Rumus Perhitungan Persentase</b
      ><br />Crisp Output / Σ Crisp Output * 100<br /><br />Software
      Development:<br />{{ crispOutputs[0] }} /
      {{ crispOutputs.reduce((a, b) => +a + +b, 0).toFixed(2) }} * 100 =
      <b>~{{ calculationResult.datasets[0].data[0] }}%</b><br />Data Science:<br />{{
        crispOutputs[1]
      }}
      / {{ crispOutputs.reduce((a, b) => +a + +b, 0).toFixed(2) }} * 100 =
      <b>~{{ calculationResult.datasets[0].data[1] }}%</b><br />Infratruktur dan
      Keamanan Jaringan:<br />{{ crispOutputs[2] }} /
      {{ crispOutputs.reduce((a, b) => +a + +b, 0).toFixed(2) }} * 100 =
      <b>~{{ calculationResult.datasets[0].data[2] }}%</b>
    </CModalBody>
  </CModal>
  <template>
    <NewForm
      id="printMe"
      :name="username"
      :student_id="student_id"
      :spec="chosenSpec"
    />
  </template>
  <CModal
    :visible="chooseSpec"
    @close="() => (chooseSpec = false)"
    alignment="center"
  >
    <CModalBody
      >Anda memiliki {{ recommended.spec.length }} rekomendasi peminatan. Pilih
      salah satu:<br /><CFormSelect
        v-model="chosenSpec"
        class="mt-3"
        @input="setTouched('chosenSpec')"
        feedback="Pilih peminatan."
        :invalid="v$.chosenSpec.$error"
      >
        <option value="undefined" selected disabled hidden>Pilih</option>
        <option v-for="(item, index) in recommended.spec" v-bind:key="index">
          {{ item }}
        </option>
      </CFormSelect></CModalBody
    ><CModalFooter class="justify-content-start"
      ><CButton color="secondary" @click="() => (chooseSpec = false)"
        >Batal</CButton
      ><CButton color="success" @click="print()">Cetak</CButton></CModalFooter
    >
  </CModal>
  <CCol xs>
    <CCard class="col-md-6 mx-auto mb-3">
      <CCardHeader>
        <h6>Hitung Rekomendasi Peminatan</h6>
      </CCardHeader>
      <CCardBody class="text-center">
        <Alerts
          :showError="showError"
          :showSuccess="showSuccess"
          :errorMsg="errorMsg"
          :successMsg="successMsg"
          @update:showError="updateError"
          @update:showSuccess="updateSuccess"
        />
        <SubmitButton
          v-if="!showResult"
          :disabled="isSendingForm"
          :isSendingForm="isSendingForm"
          @click="calculateFIS"
          :title="isSendingForm ? 'Menghitung' : 'Hitung'"
        /><CCollapse :visible="showResult">
          <CRow>
            <h6 class="mb-4">Rekomendasi Peminatan Untuk {{ username }}</h6>
            <CCol class="text-start"
              ><p>
                Data Science:
                <b>{{ calculationResult.datasets[0].data[1] }}%</b
                ><br />Software Development:
                <b>{{ calculationResult.datasets[0].data[0] }}%</b
                ><br />Infrastruktur dan Keamanan Jaringan:
                <b>{{ calculationResult.datasets[0].data[2] }}%</b>
              </p>
            </CCol>
            <CCol style="width: 120px">
              <CChart
                type="pie"
                v-show="calculationResult.datasets[0].data.length !== 0"
                :data="calculationResult"
              />
            </CCol>
          </CRow>
          <div class="text-start">
            <h6>Kesimpulan:</h6>
            <p>
              {{ conclusion }}
            </p>
          </div>
          <hr />
          <CButton
            color="primary"
            class="me-3"
            @click="
              () => {
                showDetail ? (showDetail = false) : (showDetail = true)
              }
            "
            >Rincian</CButton
          >
          <CButton
            color="success"
            @click="
              () => {
                recommended.spec.length === 1 ? print() : (chooseSpec = true)
              }
            "
            >Ajukan Peminatan</CButton
          >
        </CCollapse>
      </CCardBody>
    </CCard>
  </CCol>
</template>

<script>
import { CChart } from '@coreui/vue-chartjs'
import Alerts from '@/components/Alerts.vue'
import SubmitButton from '@/components/SubmitButton.vue'
import axios from 'axios'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import NewForm from '@/views/pages/specForm/NewForm.vue'

export default {
  name: 'CalculateFis',
  setup() {
    return { v$: useVuelidate() }
  },
  components: { CChart, Alerts, SubmitButton, NewForm },
  data() {
    return {
      calculationResult: {
        labels: ['Software Development(%)', 'Data Science(%)', 'Jaringan(%)'],
        datasets: [
          {
            backgroundColor: ['#41B883', '#E46651', '#00D8FF'],
            data: [],
          },
        ],
      },
      username: this.$store.state.name,
      student_id: this.$store.state.student_id,
      showResult: false,
      showError: false,
      showSuccess: false,
      errorMsg: '',
      successMsg: '',
      isSendingForm: false,
      recommended: {
        spec: [],
        percentage: '',
      },
      crispOutputs: [],
      conclusion: '',
      showDetail: false,
      chosenSpec: '',
      chooseSpec: false,
      isPageHidden: true,
    }
  },
  validations() {
    return {
      chosenSpec: {
        required,
      },
    }
  },
  methods: {
    setTouched(theModel) {
      if (theModel == 'chosenSpec' || theModel == 'all') {
        this.v$.chosenSpec.$touch()
      }
    },
    print() {
      this.setTouched('all')
      if (!this.v$.$invalid) {
        this.$htmlToPaper('printMe')
      }
    },
    calculateFIS() {
      this.isSendingForm = true
      axios
        .post(
          this.$store.state.backendUrl + 'fis/?spec=all',
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.$cookies.get('token')}`,
            },
          },
        )
        .then((result) => {
          if (result.status === 201) {
            const data = result.data.result

            this.crispOutputs.push(
              data.software_development,
              data.data_science,
              data.networking,
            )

            this.calculationResult.datasets[0].data.push(
              +data.softDevPercentage,
              +data.dataSciPercentage,
              +data.networkingPercentage,
            )
            const arr = this.calculationResult.datasets[0].data
            const m = Math.max(...arr)
            const maxes = arr.reduce(
              // eslint-disable-next-line no-unused-vars
              (p, c, i, a) => (c == m ? p.concat(i) : p),
              [],
            )

            maxes.length === 3
              ? this.recommended.spec.push(
                  'Data Science',
                  'Software Development',
                  'Infrastruktur dan Keamanan Jaringan',
                )
              : maxes[0] === 0 && maxes.length == 1
              ? this.recommended.spec.push('Software Development')
              : maxes[0] === 1 && maxes.length == 1
              ? this.recommended.spec.push('Data Science')
              : maxes[0] === 2 && maxes.length == 1
              ? this.recommended.spec.push(
                  'Infrastruktur dan Keamanan Jaringan',
                )
              : maxes.length === 2 && maxes[0] === 0 && maxes[1] === 1
              ? this.recommended.spec.push(
                  'Software Development',
                  'Data Science',
                )
              : maxes.length === 2 && maxes[0] === 1 && maxes[1] === 2
              ? this.recommended.spec.push(
                  'Data Science',
                  'Infrastruktur dan Keamanan Jaringan',
                )
              : maxes.length === 2 && maxes[0] === 0 && maxes[1] === 2
              ? this.recommended.spec.push(
                  'Software Development',
                  'Infrastruktur dan Keamanan Jaringan',
                )
              : []
            if (maxes.length === 3) {
              this.conclusion = `Berdasarkan hasil perhitungan, ketiga peminatan memiliki persentase yang sama. Oleh karena itu, sistem pendukung keputusan tidak dapat memberikan rekomendasi khusus.`
            }
            if (maxes.length === 2) {
              this.conclusion = `Peminatan yang disarankan: ${this.recommended.spec[0]} atau ${this.recommended.spec[1]}.`
            }
            if (maxes.length === 1) {
              this.chosenSpec = this.recommended.spec[0]
              this.conclusion = `Peminatan yang disarankan: ${this.recommended.spec[0]}.`
            }

            this.isSendingForm = false
            this.showResult = true
          }
        })
        .catch((error) => {
          this.errorMsg =
            error.response !== undefined ? error.response.data.message : error
          this.isSendingForm = false
          this.showError = true
        })
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
