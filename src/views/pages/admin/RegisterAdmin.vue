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
      <CModalTitle>Konfirmasi Ubah Role</CModalTitle>
    </CModalHeader>
    <CModalBody v-if="userrole === 'Pengelola'"
      >Apakah anda yakin ingin menurunkan role dari user <b>{{ username }}</b
      >?</CModalBody
    ><CModalBody v-if="userrole === 'Mahasiswa'"
      >Apakah anda yakin ingin mempromosikan role dari user <b>{{ username }}</b
      >?</CModalBody
    >
    <CModalFooter class="justify-content-start">
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
        v-if="userrole === 'Mahasiswa'"
        color="danger"
        @click="Promote(userid)"
        title="Promosikan"
        :isSendingForm="isSendingForm"
      /><SubmitButton
        v-if="userrole === 'Pengelola'"
        color="danger"
        @click="Demote(userid)"
        title="Turunkan"
        :isSendingForm="isSendingForm"
      />
    </CModalFooter>
  </CModal>
  <CModal
    :visible="notifyModal"
    @close="
      () => {
        notifyModal = false
      }
    "
  >
    <CModalHeader>
      <CModalTitle>Kirim Notifikasi</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CForm>
        <CFormTextarea
          placeholder="Pesan Notifikasi"
          v-model.trim="notifMsg"
          label="Pesan"
        ></CFormTextarea>
      </CForm>
    </CModalBody>
    <CModalFooter class="justify-content-start">
      <CButton
        color="secondary"
        @click="
          () => {
            notifyModal = false
          }
        "
        >Batal</CButton
      >
      <SubmitButton
        color="primary"
        @click="Notify(userid)"
        title="Kirim Notifikasi"
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
        initialSortBy: { field: 'student_id', type: 'asc' },
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
            v-if="props.row.role === 'Mahasiswa'"
            class="me-2"
            color="success"
            size="sm"
            @click="
              () => {
                username = props.row.name
                userid = props.row.id
                userrole = props.row.role
                confirmModal = true
              }
            "
            ><i class="bi bi-arrow-up-square-fill"> Promosikan</i></CButton
          >
          <CButton
            v-if="props.row.role === 'Pengelola'"
            class="me-2"
            color="danger"
            size="sm"
            @click="
              () => {
                username = props.row.name
                userid = props.row.id
                userrole = props.row.role
                confirmModal = true
              }
            "
            ><i class="bi bi-arrow-down-square-fill"> Turunkan</i></CButton
          >
          <CButton
            v-if="props.row.role === 'Admin'"
            color="info"
            size="sm"
            class="me-2"
            ><i class="bi bi-emoji-sunglasses-fill"> Admin</i></CButton
          >
          <CButton
            color="warning"
            size="sm"
            @click="
              () => {
                userid = props.row.id
                notifyModal = true
              }
            "
            ><i class="bi bi-bell-fill"> Notify</i></CButton
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
  name: 'RegisterAdmin',
  components: { VueGoodTable, Alerts, SubmitButton },
  data() {
    return {
      username: '',
      userid: '',
      userrole: '',
      confirmModal: false,
      notifyModal: false,
      notifMsg: '',
      showError: false,
      errorMsg: '',
      showSuccess: false,
      successMsg: '',
      isLoaded: false,
      isSendingForm: false,
      rows: [],
      columns: [
        {
          label: 'Nama',
          field: 'name',
        },
        {
          label: 'NPM',
          field: 'student_id',
        },
        {
          label: 'Role',
          field: 'role',
        },
        {
          label: 'Tanggal Daftar',
          field: 'createdAt',
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
        .get(this.$store.state.backendUrl + 'user/get-all?isVerified=true', {
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
    Promote(id) {
      this.isSendingForm = true
      axios
        .patch(
          this.$store.state.backendUrl + 'user/add-admin/' + +id,
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
            this.successMsg = 'Berhasil menambahkan pengelola!'
            this.getUser()
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
    Demote(id) {
      this.isSendingForm = true
      axios
        .patch(
          this.$store.state.backendUrl + 'user/remove-admin/' + +id,
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
            this.successMsg = 'Berhasil menghapus pengelola!'
            this.getUser()
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
    Notify() {
      this.isSendingForm = true
      axios
        .post(
          this.$store.state.backendUrl + 'notification',
          { id: this.userid, content: this.notifMsg },
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
            this.notifyModal = false
            this.showSuccess = true
            this.successMsg = 'Berhasil mengirim notifikasi!'
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
