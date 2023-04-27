<template>
  <CModal
    :visible="confirmModal"
    @close="
      () => {
        confirmModal = false
      }
    "
  >
    <CModalHeader>
      <CModalTitle v-if="action === 'approve'"
        >Konfirmasi Persetujuan Pengelola Baru</CModalTitle
      >
      <CModalTitle v-if="action === 'decline'"
        >Konfirmasi Penolakan Pengelola Baru</CModalTitle
      >
    </CModalHeader>
    <CModalBody v-if="action === 'approve'"
      >Apakah anda yakin ingin menyetujui {{ userrole }} dengan nama
      <b>{{ username }}</b
      >?</CModalBody
    >
    <CModalBody v-if="action === 'decline'"
      >Apakah anda yakin ingin menolak {{ userrole }} dengan nama
      <b>{{ username }}</b
      >?</CModalBody
    >
    <CModalFooter class="justify-content-start" v-if="action === 'approve'">
      <CButton
        color="secondary"
        @click="
          () => {
            confirmModal = false
          }
        "
        >Batal</CButton
      >
      <SubmitButton
        color="success"
        @click="Approve(userid)"
        title="Setujui"
        :isSendingForm="isSendingForm"
      />
    </CModalFooter>
    <CModalFooter class="justify-content-start" v-if="action === 'decline'">
      <CButton
        color="secondary"
        @click="
          () => {
            confirmModal = false
          }
        "
        >Batal</CButton
      >
      <SubmitButton
        color="danger"
        @click="Disapprove(userid)"
        title="Tolak"
        :isSendingForm="isSendingForm"
      />
    </CModalFooter>
  </CModal>
  <div class="mb-4">
    <Alerts
      :showError="showError"
      :showSuccess="showSuccess"
      :errorMsg="errorMsg"
      :successMsg="successMsg"
      @update:showError="updateError"
      @update:showSuccess="updateSuccess"
    />
    <CCardBody
      disabled
      v-if="!isLoaded"
      class="justify-content-center text-center"
    >
      <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
      Memuat...
    </CCardBody>
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
        initialSortBy: { field: 'createdAt', type: 'asc' },
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
    >
      <template #table-row="props">
        <span v-if="props.column.field === 'action'">
          <CButton
            class="me-2"
            color="success"
            size="sm"
            @click="
              () => {
                username = props.row.name
                userid = props.row.id
                userrole = props.row.role
                action = 'approve'
                confirmModal = true
              }
            "
            ><i class="bi bi-check2-square"> Setujui</i></CButton
          >
          <CButton
            color="danger"
            size="sm"
            @click="
              () => {
                username = props.row.name
                userid = props.row.id
                userrole = props.row.role
                action = 'decline'
                confirmModal = true
              }
            "
            ><i class="bi bi-x-square-fill"> Tolak</i></CButton
          >
        </span>
        <span v-else>
          {{ props.formattedRow[props.column.field] }}
        </span>
      </template>
    </vue-good-table>
  </div>
</template>

<script>
import 'vue-good-table-next/dist/vue-good-table-next.css'
import { VueGoodTable } from 'vue-good-table-next'
import Alerts from '@/components/Alerts.vue'
import axios from 'axios'
import SubmitButton from '@/components/SubmitButton.vue'

export default {
  name: 'ApproveAdmin',
  components: { VueGoodTable, Alerts, SubmitButton },
  data() {
    return {
      username: '',
      userid: '',
      userrole: '',
      confirmModal: false,
      showError: false,
      errorMsg: '',
      showSuccess: false,
      successMsg: '',
      isLoaded: false,
      isSendingForm: false,
      action: '',
      rows: [],
      columns: [
        {
          label: 'Nama',
          field: 'name',
        },
        {
          label: 'Tanggal Daftar',
          field: 'createdAt',
        },
        {
          label: 'Role',
          field: 'role',
        },
        {
          label: 'Aksi',
          field: 'action',
        },
        {
          label: 'id',
          field: 'id',
          hidden: true,
        },
      ],
    }
  },
  beforeMount() {
    this.getUser()
  },
  methods: {
    getUser() {
      axios
        .get(this.$store.state.backendUrl + 'user/get-all?isVerified=false', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.$cookies.get('token')}`,
          },
        })
        .then((result) => {
          if (result.status === 201) {
            const options = {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }
            for (let i = 0; i < result.data.result.length; i++) {
              result.data.result[i].createdAt = new Date(
                result.data.result[i].createdAt,
              ).toLocaleDateString('id-ID', options)
            }
            this.rows = result.data.result
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
    Approve(id) {
      this.isSendingForm = true
      axios
        .patch(
          this.$store.state.backendUrl + 'user/approve-admin/' + +id,
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
            this.isSendingForm = false
            this.confirmModal = false
            this.showSuccess = true
            this.successMsg = 'Berhasil menyetujui pengelola!'
            setTimeout(() => {
              this.$router.go()
            }, 1000)
          }
        })
        .catch((error) => {
          this.isSendingForm = false
          this.confirmModal = false
          this.showError = true
          this.errorMsg =
            error.response !== undefined ? error.response.data.message : error
        })
    },
    Disapprove(id) {
      this.isSendingForm = true
      axios
        .patch(
          this.$store.state.backendUrl +
            'user/approve-admin/' +
            +id +
            '?declined=true',
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
            this.isSendingForm = false
            this.confirmModal = false
            this.showSuccess = true
            this.successMsg = 'Berhasil menolak pengelola!'
            setTimeout(() => {
              this.$router.go()
            }, 1000)
          }
        })
        .catch((error) => {
          this.isSendingForm = false
          this.confirmModal = false
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
