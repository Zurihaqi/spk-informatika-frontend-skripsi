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
      <CButton
        v-if="userrole === 'Mahasiswa'"
        color="danger"
        @click="Promote(userid)"
        >Promosikan</CButton
      ><CButton
        v-if="userrole === 'Pengelola'"
        color="danger"
        @click="Demote(userid)"
        >Turunkan</CButton
      >
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
            ><i class="bi bi-arrow-up-square-fill"></i
          ></CButton>
          <CButton
            v-if="props.row.role === 'Pengelola'"
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
            ><i class="bi bi-arrow-down-square-fill"></i
          ></CButton>
          <CButton v-if="props.row.role === 'Admin'" color="info" size="sm"
            ><i class="bi bi-emoji-sunglasses-fill"></i
          ></CButton>
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

export default {
  name: 'RegisterAdmin',
  components: { VueGoodTable, Alerts },
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
      rows: [],
      columns: [
        {
          label: 'Nama',
          field: 'name',
        },
        {
          label: 'Email',
          field: 'email',
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
        .get(this.$store.state.backendUrl + 'user/get-all', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.$cookies.get('token')}`,
          },
        })
        .then((result) => {
          if (result.status === 201) {
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
            this.confirmModal = false
            this.showSuccess = true
            this.successMsg = 'Berhasil menambahkan pengelola!'
            setTimeout(() => {
              this.$router.go()
            }, 1000)
          }
        })
        .catch((error) => {
          this.confirmModal = false
          this.showError = true
          this.errorMsg =
            error.response !== undefined ? error.response.data.message : error
        })
    },
    Demote(id) {
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
            this.confirmModal = false
            this.showSuccess = true
            this.successMsg = 'Berhasil menghapus pengelola!'
            setTimeout(() => {
              this.$router.go()
            }, 1000)
          }
        })
        .catch((error) => {
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
