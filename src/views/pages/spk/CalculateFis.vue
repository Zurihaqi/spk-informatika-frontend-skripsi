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
    <div>
      <vue3-html2pdf
        :show-layout="true"
        :float-layout="true"
        :enable-download="true"
        :preview-modal="true"
        filename="form-peminatan"
        :pdf-quality="2"
        pdf-format="a4"
        pdf-orientation="portrait"
        pdf-content-width="800px"
        :manual-pagination="false"
        :paginate-elements-by-height="1400"
        ref="printMe"
      >
        <template v-slot:pdf-content>
          <NewForm
            :name="username"
            :student_id="student_id"
            :spec="chosenSpec"
          />
        </template>
      </vue3-html2pdf>
    </div>
  </template>
  <CModal
    :visible="chooseSpec"
    @close="() => (chooseSpec = false)"
    alignment="center"
  >
    <CModalBody
      >Anda memiliki {{ recommended.spec.length }} rekomendasi peminatan. Pilih
      salah satu:<br /><CFormSelect v-model="chosenSpec" class="mt-3">
        <option value="undefined">Pilih</option>
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
  <CCard class="col-sm-6 mx-auto mb-3">
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
        :isSendingForm="isSendingForm"
        @click="calculateFIS"
        title="Hitung"
      /><CCollapse :visible="showResult">
        <hr />
        <CRow>
          <h6 class="mb-4">Rekomendasi Peminatan Untuk {{ username }}</h6>
          <CCol class="text-start"
            ><p>
              Data Science:
              <b>{{ calculationResult.datasets[0].data[1] }}%</b><br />Software
              Development: <b>{{ calculationResult.datasets[0].data[0] }}%</b
              ><br />Infrastruktur dan Keamanan Jaringan:
              <b>{{ calculationResult.datasets[0].data[2] }}%</b>
            </p>
          </CCol>
          <CCol>
            <CChart
              type="pie"
              v-if="calculationResult.datasets[0].data.length !== 0"
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
          >Cetak Hasil</CButton
        >
      </CCollapse>
    </CCardBody>
  </CCard>
</template>

<script>
import { CChart } from '@coreui/vue-chartjs'
import Alerts from '@/components/Alerts.vue'
import SubmitButton from '@/components/SubmitButton.vue'
import axios from 'axios'
import NewForm from '@/views/pages/specForm/NewForm.vue'
import Vue3Html2pdf from 'vue3-html2pdf'

export default {
  name: 'CalculateFis',
  components: { CChart, Alerts, SubmitButton, NewForm, Vue3Html2pdf },
  data() {
    return {
      calculationResult: {
        labels: ['Software Development', 'Data Science', 'Jaringan'],
        datasets: [
          {
            backgroundColor: ['#41B883', '#E46651', '#00D8FF'],
            data: [],
          },
        ],
      },
      username: localStorage.getItem('name'),
      student_id: localStorage.getItem('student_id'),
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
    }
  },
  methods: {
    print() {
      this.$refs.printMe.generatePdf()
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
              data.software_development.toFixed(2),
              data.data_science.toFixed(2),
              data.networking.toFixed(2),
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
