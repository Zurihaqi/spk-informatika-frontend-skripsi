<template>
  <CCard class="mb-4">
    <CCardHeader> <h6>Laporan SPK</h6> </CCardHeader>
    <CCardBody
      disabled
      v-if="!isLoaded"
      class="justify-content-center text-center"
    >
      <Alerts
        :showError="showError"
        :showSuccess="showSuccess"
        :errorMsg="errorMsg"
        :successMsg="successMsg"
        @update:showError="updateAlerts('error')"
        @update:showSuccess="updateAlerts('success')"
      />
      <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
      Memuat...
    </CCardBody>
    <CCardBody v-if="isLoaded">
      <Alerts
        :showError="showError"
        :showSuccess="showSuccess"
        :errorMsg="errorMsg"
        :successMsg="successMsg"
        @update:showError="updateAlerts('error')"
        @update:showSuccess="updateAlerts('success')"
      />
      <div class="container">
        <div class="rounded bg-info text-center text-white">
          <p>Data persebaran rekomendasi peminatan mahasiswa:</p>
        </div>
        <CRow>
          <CCol style="min-height: 100%">
            <CChart
              v-show="data.datasets[0].data.length !== 0"
              type="bar"
              :data="data"
              class="mb-2"
            />
            <p v-show="!data.datasets[0].data.length" class="text-center">
              Tidak ada data
            </p>
          </CCol>
          <CCol class="d-flex flex-column align-items-center">
            <CChart
              v-show="pieData.datasets[0].data.length !== 0"
              type="pie"
              :data="pieData"
              class="w-75"
            />
            <p v-show="!pieData.datasets[0].data.length" class="text-center">
              Tidak ada data
            </p>
          </CCol>
        </CRow>
        <hr />
        <CRow>
          <CCol class="mw-100">
            <div class="rounded bg-info text-center text-white mb-4">
              <p>Data rata-rata nilai mata kuliah (skala 0 hingga 4.00):</p>
            </div>
            <b>Data Science</b>
            <CChart
              v-show="dataSciGrades.datasets.length !== 0"
              type="bar"
              :data="dataSciGrades"
              :options="barChartOptions"
              class="mb-2"
            />
            <p v-show="!dataSciGrades.datasets.length" class="text-center">
              Tidak ada data
            </p>
            <br />
            <b>Software Development</b>
            <CChart
              v-show="softDevGrades.datasets.length !== 0"
              type="bar"
              :data="softDevGrades"
              :options="barChartOptions"
              class="mb-2"
            />
            <p v-show="!softDevGrades.datasets.length" class="text-center">
              Tidak ada data
            </p>
            <br />
            <b>Infrastruktur dan Keamanan Jaringan</b>
            <CChart
              v-show="networkingGrades.datasets.length !== 0"
              type="bar"
              :data="networkingGrades"
              :options="barChartOptions"
              class="mb-2"
            />
            <p v-show="!networkingGrades.datasets.length" class="text-center">
              Tidak ada data
            </p>
          </CCol>
        </CRow>
      </div>
    </CCardBody>
  </CCard>
</template>

<script>
import axios from 'axios'
import Alerts from '@/components/Alerts.vue'
import { CChart } from '@coreui/vue-chartjs'

export default {
  name: 'FisReports',
  components: { Alerts, CChart },
  data() {
    return {
      isLoaded: false,
      showError: false,
      showSuccess: false,
      successMsg: '',
      errorMsg: '',
      data: {
        labels: ['Data Science', 'Software Development', 'Jaringan'],
        datasets: [
          {
            label: 'Jumlah Mahasiswa',
            backgroundColor: ['#41B883', '#E46651', '#00D8FF'],
            data: [],
          },
        ],
      },
      pieData: {
        labels: ['Data Science(%)', 'Software Development(%)', 'Jaringan(%)'],
        datasets: [
          {
            backgroundColor: ['#41B883', '#E46651', '#00D8FF'],
            data: [],
          },
        ],
      },
      dataSciGrades: {
        labels: [],
        datasets: [
          {
            label: 'Rata-rata nilai Data Science',
            backgroundColor: [],
            data: [],
          },
        ],
      },
      softDevGrades: {
        labels: [],
        datasets: [
          {
            label: 'Rata-rata nilai Software Development',
            backgroundColor: [],
            data: [],
          },
        ],
      },
      networkingGrades: {
        labels: [],
        datasets: [
          {
            label: 'Rata-rata nilai Jaringan',
            backgroundColor: [],
            data: [],
          },
        ],
      },
      barChartOptions: {
        responsive: true, // Enable responsiveness
        maintainAspectRatio: true, // Allow the chart to adjust its size
        indexAxis: 'x',
        plugins: { legend: { display: false } },
        scales: {
          x: {
            display: true,
            ticks: {
              font: {
                size: this.isMobile() ? 5 : 12,
              },
            },
          },
        },
      },
    }
  },
  beforeMount() {
    this.getStats()
  },
  methods: {
    getStats() {
      axios
        .get(this.$store.state.backendUrl + 'stat', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.$cookies.get('token')}`,
          },
        })
        .then((result) => {
          if (result.status === 201) {
            const data = result.data
            this.data.datasets[0].data = data.recs_stats.result.filter(
              (value) => value !== 0 && value !== '' && value !== null,
            )
            this.pieData.datasets[0].data =
              data.recs_stats.percentageResult.filter(
                (value) => value !== 0 && value !== '' && value !== null,
              )

            this.softDevGrades = data.grade_stats.softDevGrades
            this.dataSciGrades = data.grade_stats.dataSciGrades
            this.networkingGrades = data.grade_stats.networkingGrades

            this.isLoaded = true
          }
        })
        .catch((error) => {
          this.isSendingForm = false
          this.showError = true
          this.errorMsg =
            error.response !== undefined ? error.response.data.message : error
        })
    },
    updateAlerts(type) {
      this.showSuccess = type === 'success'
      this.showError = type === 'error'
    },
    isMobile() {
      const viewportWidth = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0,
      )

      const mobileWidthThreshold = 768

      return viewportWidth < mobileWidthThreshold
    },
  },
}
</script>

<style>
.static-col {
  display: block;
  width: 50%;
}
</style>
