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
          </CCol>
          <CCol class="d-flex flex-column align-items-center">
            <CChart
              v-show="pieData.datasets[0].data.length !== 0"
              type="pie"
              :data="pieData"
              class="w-75"
            />
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
            <br />
            <b>Software Development</b>
            <CChart
              v-show="softDevGrades.datasets.length !== 0"
              type="bar"
              :data="softDevGrades"
              :options="barChartOptions"
              class="mb-2"
            />
            <br />
            <b>Infrastruktur dan Keamanan Jaringan</b>
            <CChart
              v-show="networkingGrades.datasets.length !== 0"
              type="bar"
              :data="networkingGrades"
              :options="barChartOptions"
              class="mb-2"
            />
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
            label: 'Persebaran Rekomendasi Peminatan',
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
        legend: {
          display: true,
        },
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
            this.data.datasets[0].data = data.recs_stats.result
            this.pieData.datasets[0].data = data.recs_stats.percentageResult

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
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        )
      ) {
        return true
      } else {
        return false
      }
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
