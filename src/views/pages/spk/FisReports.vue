<template>
  <CCard>
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
        <CRow>
          <CCol>
            <p>Data persebaran rekomendasi peminatan mahasiswa:</p>
            <CRow class="d-flex justify-content-center">
              <CChart
                v-show="data.datasets[0].data.length !== 0"
                type="bar"
                :data="data"
                class="mb-2"
              />
              <CChart
                v-show="pieData.datasets[0].data.length !== 0"
                type="pie"
                :data="pieData"
                class="w-75 mb-2"
              />
            </CRow>
            <hr v-if="isMobile()" />
          </CCol>
          <div v-if="!isMobile()" class="vr"></div>
          <CCol>
            <p>Data rata-rata nilai mata kuliah (skala 0 hingga 4.00):</p>
            <b>Data Science</b>
            <CChart
              v-show="dataSciGrades.datasets.length !== 0"
              type="bar"
              :data="dataSciGrades"
              class="mb-2"
            />
            <br />
            <b>Software Development</b>
            <CChart
              v-show="softDevGrades.datasets.length !== 0"
              type="bar"
              :data="softDevGrades"
              class="mb-2"
            />
            <br />
            <b>Infrastruktur dan Keamanan Jaringan</b>
            <CChart
              v-show="networkingGrades.datasets.length !== 0"
              type="bar"
              :data="networkingGrades"
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
        labels: ['Jumlah Rekomendasi Peminatan'],
        datasets: [
          {
            label: 'Data Science',
            backgroundColor: '#3B2BD4',
            data: [],
          },
          {
            label: 'Software Development',
            backgroundColor: '#D43B2B',
            data: [],
          },
          {
            label: 'Jaringan',
            backgroundColor: '#2BD43B',
            data: [],
          },
        ],
      },
      pieData: {
        labels: ['Data Science(%)', 'Software Development(%)', 'Jaringan(%)'],
        datasets: [
          {
            backgroundColor: ['#3B2BD4', '#D43B2B', '#2BD43B'],
            data: [],
          },
        ],
      },
      dataSciGrades: {
        labels: ['Nilai rata-rata mata kuliah peminatan Data Science'],
        datasets: [],
      },
      softDevGrades: {
        labels: ['Nilai rata-rata mata kuliah peminatan Software Development'],
        datasets: [],
      },
      networkingGrades: {
        labels: ['Nilai rata-rata mata kuliah peminatan Jaringan'],
        datasets: [],
      },
    }
  },
  async beforeMount() {
    await this.getRecommendations()
    await this.getGrades()
  },
  methods: {
    async getRecommendations() {
      axios
        .get(this.$store.state.backendUrl + 'recommendation/all', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.$cookies.get('token')}`,
          },
        })
        .then((result) => {
          if (result.status === 201) {
            const recsData = result.data.data

            const newestTimestamps = {}
            const newestCrispOutputs = []

            recsData.forEach((entry) => {
              // eslint-disable-next-line no-unused-vars
              const { user_id, crispOutput, createdAt } = entry
              if (
                !(user_id in newestTimestamps) ||
                createdAt > newestTimestamps[user_id]
              ) {
                newestTimestamps[user_id] = createdAt
              }
            })

            recsData.forEach((entry) => {
              const { user_id, crispOutput, createdAt } = entry
              if (createdAt === newestTimestamps[user_id]) {
                newestCrispOutputs.push({
                  user_id,
                  crispOutput,
                })
              }
            })

            const datasets = {
              softDev: [],
              dataSci: [],
              networking: [],
            }

            newestCrispOutputs.forEach(({ crispOutput }) => {
              const highestValue = Math.max(...crispOutput)
              const [dataSci, softDev, networking] = crispOutput

              datasets.softDev.push(
                dataSci === highestValue ? highestValue : null,
              )
              datasets.dataSci.push(
                softDev === highestValue ? highestValue : null,
              )
              datasets.networking.push(
                networking === highestValue ? highestValue : null,
              )
            })

            this.data.datasets[0].data.push(
              datasets.dataSci.filter((value) => value !== null).length,
            )
            this.data.datasets[1].data.push(
              datasets.softDev.filter((value) => value !== null).length,
            )
            this.data.datasets[2].data.push(
              datasets.networking.filter((value) => value !== null).length,
            )

            const percentageArray = []

            const combinedDataset = [
              ...datasets.softDev,
              ...datasets.dataSci,
              ...datasets.networking,
            ]
            const totalCombined = combinedDataset.filter(
              (value) => value !== null,
            ).length

            const softDevPercentage = Math.round(
              (datasets.softDev.filter((value) => value !== null).length /
                totalCombined) *
                100,
            )
            const dataSciPercentage = Math.round(
              (datasets.dataSci.filter((value) => value !== null).length /
                totalCombined) *
                100,
            )
            const networkingPercentage = Math.round(
              (datasets.networking.filter((value) => value !== null).length /
                totalCombined) *
                100,
            )

            percentageArray.push(dataSciPercentage)
            percentageArray.push(softDevPercentage)
            percentageArray.push(networkingPercentage)

            this.pieData.datasets[0].data = percentageArray

            this.isLoaded = true
          }
        })
    },
    async getGrades() {
      axios
        .get(this.$store.state.backendUrl + 'grade/all', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.$cookies.get('token')}`,
          },
        })
        .then((result) => {
          if (result.status === 201) {
            const data = result.data.data

            const courseGrades = {}
            data.forEach((entry) => {
              const {
                course_id,
                numbered_grade,
                Course: { course_name, spec_id },
              } = entry
              if (!(course_id in courseGrades)) {
                courseGrades[course_id] = {
                  course_id,
                  course_name,
                  spec_id,
                  total_grades: 0,
                  count: 0,
                }
              }
              courseGrades[course_id].total_grades += numbered_grade
              courseGrades[course_id].count++
            })

            const averageGrades = Object.values(courseGrades).map(
              ({ course_id, course_name, spec_id, total_grades, count }) => ({
                course_id,
                course_name,
                spec_id,
                average_numbered_grades: total_grades / count,
              }),
            )

            const sortedData = {
              software_development: [],
              data_science: [],
              networking: [],
            }
            averageGrades.forEach((entry) => {
              const { spec_id, course_name, average_numbered_grades } = entry
              const dataset = {
                label: course_name,
                backgroundColor: getBackgroundColor(spec_id),
                data: [average_numbered_grades],
              }
              switch (spec_id) {
                case 1:
                  sortedData.software_development.push(dataset)
                  break
                case 2:
                  sortedData.data_science.push(dataset)
                  break
                case 3:
                  sortedData.networking.push(dataset)
                  break
                default:
                  break
              }
            })

            this.dataSciGrades.datasets = sortedData.data_science
            this.softDevGrades.datasets = sortedData.software_development
            this.networkingGrades.datasets = sortedData.networking
            console.log(this.dataSciGrades)
            console.log(this.data)
          }
          function getBackgroundColor(spec_id) {
            const randomShade = Math.random()
            switch (spec_id) {
              case 1:
                return generateShade('ff0000', randomShade)
              case 2:
                return generateShade('0000ff', randomShade)
              case 3:
                return generateShade('00ff00', randomShade)
              default:
                return '#000000'
            }
          }

          console.log(getBackgroundColor(1))

          function generateShade(color, shade) {
            const minBrightness = 0.5
            const red =
              color === 'ff0000'
                ? Math.floor(
                    (shade * (1 - minBrightness) + minBrightness) * 256,
                  )
                : 0
            const green =
              color === '00ff00'
                ? Math.floor(
                    (shade * (1 - minBrightness) + minBrightness) * 256,
                  )
                : 0
            const blue =
              color === '0000ff'
                ? Math.floor(
                    (shade * (1 - minBrightness) + minBrightness) * 256,
                  )
                : 0
            const hex = `#${red.toString(16).padStart(2, '0')}${green
              .toString(16)
              .padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`
            return hex
          }
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
