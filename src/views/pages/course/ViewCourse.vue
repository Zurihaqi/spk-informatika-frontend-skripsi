<template>
  <CModal
    alignment="center"
    :visible="deleteModal"
    @close="
      () => {
        deleteModal = false
        getCourseData()
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
        Apakah anda yakin ingin menghapus <b>{{ selectedRow.course_name }}</b
        >?
      </div>
    </CModalBody>
    <CModalFooter class="justify-content-start">
      <CButton
        color="secondary"
        @click="
          () => {
            deleteModal = false
            getCourseData()
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
        @click="deleteCourse"
      ></SubmitButton>
    </CModalFooter> </CModal
  ><CModal
    alignment="center"
    :visible="editModal"
    @close="
      () => {
        editModal = false
        getCourseData()
        resetInput()
      }
    "
  >
    <CModalHeader>
      <CModalTitle>Ubah Data Mata Kuliah</CModalTitle>
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
        <CFormLabel>Nama Mata Kuliah</CFormLabel>
        <CFormInput
          v-model.trim="form.course_name"
          type="text"
          :placeholder="selectedRow.course_name"
          class="mb-3"
        />
        <CFormLabel>Kode Mata Kuliah</CFormLabel>
        <CFormInput
          v-model.trim="form.course_code"
          type="text"
          :placeholder="selectedRow.course_code"
          class="mb-3"
        />
        <CFormLabel>SKS</CFormLabel>
        <CFormInput
          v-model.trim="form.credit"
          type="text"
          :placeholder="selectedRow.credit"
          class="mb-3"
        />
        <CFormLabel>Semester</CFormLabel>
        <CFormInput
          v-model.trim="form.semester"
          type="text"
          :placeholder="selectedRow.semester"
          class="mb-3"
        />
      </div>
    </CModalBody>
    <CModalFooter class="justify-content-start">
      <CButton
        color="secondary"
        @click="
          () => {
            editModal = false
            getCourseData()
            resetInput()
          }
        "
      >
        Batal
      </CButton>
      <SubmitButton
        :disabled="isSendingForm"
        :isSendingForm="isSendingForm"
        :title="isSendingForm ? 'Menyimpan' : 'Simpan'"
        color="primary"
        @click="editCourse"
      ></SubmitButton>
    </CModalFooter>
  </CModal>
  <CModal
    alignment="center"
    :visible="addModal"
    @close="
      () => {
        addModal = false
        getCourseData()
        resetInput()
      }
    "
  >
    <CModalHeader>
      <CModalTitle>Tambah Mata Kuliah</CModalTitle>
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
        <CFormLabel>Nama Mata Kuliah</CFormLabel>
        <CFormInput
          v-model.trim="form.course_name"
          type="text"
          @input="setTouched('course_name')"
          feedback="Masukan nama mata kuliah."
          :invalid="v$.form.course_name.$error"
        />
        <CFormLabel class="mt-3">Kode Mata Kuliah</CFormLabel>
        <CFormInput
          v-model.trim="form.course_code"
          type="text"
          @input="setTouched('course_code')"
          feedback="Masukan kode mata kuliah."
          :invalid="v$.form.course_code.$error"
        />
        <CFormLabel class="mt-3">SKS</CFormLabel>
        <CFormInput
          v-model.trim="form.credit"
          type="text"
          @input="setTouched('credit')"
          feedback="Masukan sks."
          :invalid="v$.form.credit.$error"
        />
        <CFormLabel class="mt-3">Semester</CFormLabel>
        <CFormInput
          v-model.trim="form.semester"
          type="text"
          @input="setTouched('semester')"
          feedback="Masukan semester."
          :invalid="v$.form.semester.$error"
        />
      </div>
    </CModalBody>
    <CModalFooter class="justify-content-start">
      <CButton
        color="secondary"
        @click="
          () => {
            addModal = false
            getCourseData()
            resetInput()
          }
        "
      >
        Batal
      </CButton>
      <SubmitButton
        :disabled="isSendingForm"
        :isSendingForm="isSendingForm"
        :title="isSendingForm ? 'Menyimpan' : 'Simpan'"
        color="primary"
        @click="addCourse"
      ></SubmitButton>
    </CModalFooter>
  </CModal>
  <div class="mb-4">
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
        initialSortBy: { field: 'semester', type: 'asc' },
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
      <template #table-actions>
        <CButton
          v-if="role === 'Pengelola' || role === 'Admin'"
          color="primary"
          class="me-3"
          size="sm"
          @click="
            () => {
              addModal = true
            }
          "
          >Tambah Data</CButton
        >
      </template>
      <template #table-row="props">
        <span v-if="props.column.field === 'action'">
          <CButton
            color="primary"
            size="sm"
            class="me-2"
            @click="
              () => {
                editModal = true
              }
            "
            >Ubah</CButton
          >
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
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import 'vue-good-table-next/dist/vue-good-table-next.css'
import { VueGoodTable } from 'vue-good-table-next'
import Alerts from '@/components/Alerts.vue'
import SubmitButton from '@/components/SubmitButton.vue'
import axios from 'axios'

export default {
  name: 'ViewCourse',
  setup() {
    return { v$: useVuelidate() }
  },
  components: {
    VueGoodTable,
    Alerts,
    SubmitButton,
  },
  data() {
    return {
      form: {
        course_code: '',
        course_name: '',
        credit: '',
        semester: '',
      },
      columns: [
        {
          label: this.isMobile() ? 'Kode Matkul' : 'Kode Mata Kuliah',
          field: 'course_code',
          type: 'number',
        },
        {
          label: this.isMobile() ? 'Nama Matkul' : 'Nama Mata Kuliah',
          field: 'course_name',
        },
        {
          label: 'SKS',
          field: 'credit',
          type: 'number',
        },
        {
          label: 'Semester',
          field: 'semester',
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
      deleteModal: false,
      editModal: false,
      addModal: false,
      showError: false,
      errorMsg: '',
      showSuccess: false,
      successMsg: '',
      selectedRow: '',
      isSendingForm: false,
      isLoaded: false,
    }
  },
  validations() {
    return {
      form: {
        course_name: {
          required,
        },
        course_code: {
          required,
        },
        credit: {
          required,
        },
        semester: {
          required,
        },
      },
    }
  },
  beforeMount() {
    if (this.role === 'Pengelola' || this.role === 'Admin') {
      this.columns[4].hidden = false
    }
    this.getCourseData()
  },
  methods: {
    setTouched(theModel) {
      this.isSendingForm = false
      if (theModel == 'course_name' || theModel == 'all') {
        this.v$.form.course_name.$touch()
      }

      if (theModel == 'course_code' || theModel == 'all') {
        this.v$.form.course_code.$touch()
      }

      if (theModel == 'credit' || theModel == 'all') {
        this.v$.form.credit.$touch()
      }

      if (theModel == 'semester' || theModel == 'all') {
        this.v$.form.semester.$touch()
      }
    },
    onRowClick(params) {
      this.selectedRow = params.row
    },
    getCourseData() {
      axios
        .get(this.$store.state.backendUrl + 'course', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.$cookies.get('token')}`,
          },
        })
        .then((result) => {
          this.rows = result.data.data
          this.isLoaded = true
        })
        .catch((error) => {
          this.isSendingForm = false
          this.showError = true
          this.errorMsg =
            error.response !== undefined ? error.response.data.message : error
        })
    },
    deleteCourse() {
      this.isSendingForm = true
      axios
        .delete(
          this.$store.state.backendUrl + `course/${this.selectedRow.id}`,
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
            this.showSuccess = true
            this.successMsg = 'Berhasil menghapus data!'
            setTimeout(() => {
              this.getCourseData()
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
    editCourse() {
      this.isSendingForm = true
      const obj = this.form
      Object.keys(obj).forEach(
        (k) => !obj[k] && obj[k] !== undefined && delete obj[k],
      )
      axios
        .patch(
          this.$store.state.backendUrl + `course/${this.selectedRow.id}`,
          obj,
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
            this.showSuccess = true
            this.successMsg = 'Berhasil merubah data!'
            this.resetInput()
            setTimeout(() => {
              this.getCourseData()
              this.editModal = false
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
    addCourse() {
      this.setTouched('all')
      if (!this.v$.$invalid) {
        this.isSendingForm = true
        const obj = this.form
        Object.keys(obj).forEach(
          (k) => !obj[k] && obj[k] !== undefined && delete obj[k],
        )
        axios
          .post(this.$store.state.backendUrl + `course`, obj, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.$cookies.get('token')}`,
            },
          })
          .then((result) => {
            if (result.status === 201) {
              this.isSendingForm = false
              this.showSuccess = true
              this.successMsg = 'Berhasil menambahkan data!'
              this.v$.form.$reset()
              this.resetInput()
              setTimeout(() => {
                this.getCourseData()
                this.addModal = false
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
      }
    },
    resetInput() {
      this.form = {}
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
