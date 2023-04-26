<template>
  <div class="mb-4">
    <CCardBody
      disabled
      v-if="!isLoaded"
      class="justify-content-center text-center"
    >
      <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
      Memuat...
    </CCardBody>
    <Alerts
      :showError="showError"
      :showSuccess="showSuccess"
      :errorMsg="errorMsg"
      :successMsg="successMsg"
      @update:showError="updateError"
      @update:showSuccess="updateSuccess"
    />
    <vue-good-table
      v-if="isLoaded"
      :columns="columns"
      :rows="rows"
      :search-options="{
        enabled: true,
        placeholder: 'Cari data dalam tabel',
      }"
      :sort-options="{
        enabled: true,
        initialSortBy: { field: 'createdAt', type: 'dsc' },
      }"
      :pagination-options="{
        enabled: true,
        mode: 'records',
        nextLabel: 'Selanjutnya',
        prevLabel: 'Kembali',
        rowsPerPageLabel: 'Data per halaman',
        perPageDropdownEnabled: false,
      }"
      :fixed-header="!isMobile()"
      compactMode
      max-height="350px"
    >
      <template #emptystate> Tidak ada data. </template>
    </vue-good-table>
    <CCard class="mt-3"
      ><CCardBody>
        <b>Hanya menyimpan 3 riwayat rekomendasi terakhir.</b>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import 'vue-good-table-next/dist/vue-good-table-next.css'
import { VueGoodTable } from 'vue-good-table-next'
import axios from 'axios'
import Alerts from '@/components/Alerts.vue'

export default {
  name: 'CalculationHistory',
  components: { VueGoodTable, Alerts },
  data() {
    return {
      columns: [
        {
          label: 'Software Development',
          field: 'softDev',
        },
        {
          label: 'Data Science',
          field: 'dataSci',
        },
        {
          label: 'Jaringan',
          field: 'networking',
        },
        {
          label: 'Tanggal Dihitung',
          field: 'createdAt',
        },
        {
          label: 'Id',
          field: 'id',
          hidden: true,
        },
      ],
      rows: [],
      isLoaded: false,
      showError: false,
      showSuccess: false,
      errorMsg: '',
      successMsg: '',
    }
  },
  beforeMount() {
    this.getRecommendationHistory()
  },
  methods: {
    getRecommendationHistory() {
      axios
        .get(this.$store.state.backendUrl + 'recommendation', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.$cookies.get('token')}`,
          },
        })
        .then((result) => {
          const options = {
            dateStyle: 'full',
            timeStyle: 'medium',
          }
          for (let i = 0; i < result.data.data.length; i++) {
            result.data.data[i].softDev = [
              result.data.data[i].crispOutput[0],
              result.data.data[i].percentage[0] + '%',
            ]
            result.data.data[i].dataSci = [
              result.data.data[i].crispOutput[1],
              result.data.data[i].percentage[1] + '%',
            ]
            result.data.data[i].networking = [
              result.data.data[i].crispOutput[2],
              result.data.data[i].percentage[2] + '%',
            ]
            result.data.data[i].createdAt = new Date(
              result.data.data[i].createdAt,
            ).toLocaleString('id-ID', options)
          }
          this.rows = result.data.data
          console.log(this.rows)
          this.isLoaded = true
        })
        .catch((error) => {
          this.showError = true
          this.errorMsg =
            error.response !== undefined ? error.response.data.message : error
        })
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
    updateError(value) {
      this.showError = value
    },
    updateSuccess(value) {
      this.showSuccess = value
    },
  },
}
</script>
