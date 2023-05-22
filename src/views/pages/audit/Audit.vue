<template>
  <CModal
    alignment="center"
    :visible="deleteModal"
    @close="
      () => {
        deleteModal = false
        getData()
      }
    "
  >
    <CModalHeader>
      <CModalTitle>Konfirmasi Hapus Data</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <Alerts
        :showError="showError"
        :showSuccess="showSuccess"
        :errorMsg="errorMsg"
        :successMsg="successMsg"
        @update:showError="updateError"
        @update:showSuccess="updateSuccess"
      />
      <div class="mb-3">
        Apakah anda yakin ingin menghapus riwayat
        <b>{{ selectedRow.activity }}</b
        >?
      </div>
    </CModalBody>
    <CModalFooter class="justify-content-start">
      <CButton
        color="secondary"
        @click="
          () => {
            deleteModal = false
            getData()
          }
        "
      >
        Batal
      </CButton>
      <SubmitButton
        :disabled="isSendingForm"
        :isSendingForm="isSendingForm"
        :title="isSendingForm ? 'Menghapus' : 'Hapus'"
        color="danger"
        @click="deleteLog"
      ></SubmitButton>
    </CModalFooter>
  </CModal>
  <div class="mb-4">
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
        @update:showError="updateError"
        @update:showSuccess="updateSuccess"
      />
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
        perPageDropdownEnabled: !isMobile(),
      }"
      :fixed-header="!isMobile()"
      compactMode
      max-height="350px"
      v-on:row-click="onRowClick"
    >
      <template #emptystate> Tidak ada data. </template>
      <template #table-row="props">
        <span v-if="props.column.field === 'action'">
          <CButton
            color="danger"
            size="sm"
            @click="
              () => {
                deleteModal = true
              }
            "
            >Hapus</CButton
          ></span
        >
        <span v-else>
          {{ props.formattedRow[props.column.field] }}
        </span>
      </template>
    </vue-good-table>
  </div>
</template>

<script>
import axios from 'axios'
import 'vue-good-table-next/dist/vue-good-table-next.css'
import { VueGoodTable } from 'vue-good-table-next'
import Alerts from '@/components/Alerts.vue'
import SubmitButton from '@/components/SubmitButton.vue'

export default {
  name: 'Audit',
  components: { VueGoodTable, Alerts, SubmitButton },
  data() {
    return {
      columns: [
        {
          label: 'Pengelola',
          field: 'user',
        },
        {
          label: 'Aktivitas',
          field: 'activity',
        },
        {
          label: 'Waktu',
          field: 'createdAt',
        },
        {
          label: 'Aksi',
          field: 'action',
          hidden: true,
        },
        {
          label: 'Id',
          field: 'id',
          hidden: true,
        },
      ],
      rows: [],
      role: this.$store.state.role,
      isLoaded: false,
      showError: false,
      showSuccess: false,
      errorMsg: '',
      successMsg: '',
      selectedRow: '',
      deleteModal: false,
    }
  },
  beforeMount() {
    if (this.role === 'Admin') {
      this.columns[3].hidden = false
    }
    this.getData()
  },
  methods: {
    getData() {
      axios
        .get(this.$store.state.backendUrl + 'audit', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.$cookies.get('token')}`,
          },
        })
        .then((result) => {
          if (result.status === 201) {
            const data = result.data.data
            let structuredData = []

            data.forEach((e) => {
              structuredData.push({
                id: e.id,
                user: e.User.name,
                activity: e.action,
                createdAt: new Date(e.createdAt).toLocaleString(undefined, {
                  hour12: false,
                }),
              })
            })

            this.rows = structuredData

            if (this.rows.length !== 0) {
              structuredData = []
              this.isLoaded = true
            }
          }
        })
        .catch((error) => {
          this.showError = true
          this.errorMsg =
            error.response !== undefined ? error.response.data.message : error
        })
    },
    deleteLog() {
      this.isSendingForm = true
      axios
        .delete(this.$store.state.backendUrl + `audit/${this.selectedRow.id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.$cookies.get('token')}`,
          },
        })
        .then((result) => {
          if (result.status === 201) {
            this.isSendingForm = false
            this.showSuccess = true
            this.successMsg = 'Berhasil menghapus data!'
            setTimeout(() => {
              this.getData()
              this.deleteModal = false
              this.showSuccess = false
            }, 1000)
          }
        })
        .catch((error) => {
          this.isSendingForm = false
          this.showError = true
          this.errorMsg =
            error.response !== undefined ? error.response.data.message : error
        })
    },
    onRowClick(params) {
      this.selectedRow = params.row
    },
    isMobile() {
      const viewportWidth = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0,
      )

      const mobileWidthThreshold = 768

      return viewportWidth < mobileWidthThreshold
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
