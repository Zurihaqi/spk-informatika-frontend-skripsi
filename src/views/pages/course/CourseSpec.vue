<template>
  <CModal
    :visible="editModal"
    @close="
      () => {
        showResults = false
        editModal = false
      }
    "
  >
    <CModalHeader>
      <CModalTitle> Ubah Relasi Peminatan {{ modalTitle }} </CModalTitle>
    </CModalHeader>
    <CModalBody
      ><CFormInput
        class="mb-3"
        type="text"
        label="Mata Kuliah Sebelumnya"
        :value="
          modalTitle === 'Software Development'
            ? selectedRow.soft_dev
            : modalTitle === 'Data Science'
            ? selectedRow.data_science
            : modalTitle === 'Jaringan'
            ? selectedRow.networking
            : false
        "
        disabled
      />
      <CFormInput
        class="mb-3"
        type="text"
        label="Mata Kuliah Baru"
        placeholder="Cari..."
        @input="setTouched('searchTerm')"
        v-model="searchTerm"
        feedback="Masukan mata kuliah baru"
        :invalid="v$.searchTerm.$error"
      />
      <ul v-if="showResults && searchCourse.length !== 0" class="list-group">
        <li class="list-group-item disabled">
          Menampilkan {{ searchCourse.length }} dari
          {{ allCourse.length }} hasil
        </li>
        <li
          v-for="course in searchCourse"
          :key="course.name"
          class="list-group-item clickable list-group-item-action"
          @click="onResultSelected(course.name, course.id)"
        >
          {{ course.name }}
        </li>
      </ul>
    </CModalBody>
    <CModalFooter class="justify-content-start">
      <CButton
        color="secondary"
        @click="
          () => {
            showResults = false
            editModal = false
          }
        "
        >Batal</CButton
      >
      <SubmitButton
        title="Ubah"
        :isSendingForm="isSendingForm"
        color="warning"
        @click="editCourse()"
      />
    </CModalFooter>
  </CModal>
  <CCard class="mb-3">
    <CCardHeader>
      <h6 class="text-center">Software Development</h6>
    </CCardHeader>
    <CCardBody
      disabled
      v-if="!isLoaded"
      class="justify-content-center text-center"
    >
      <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
      Memuat...
    </CCardBody>
    <CCardBody v-if="isLoaded">
      <Alerts
        :showError="showError"
        :showSuccess="showSuccess"
        :errorMsg="errorMsg"
        :successMsg="successMsg"
        @update:showError="updateError"
        @update:showSuccess="updateSuccess"
      />
      <VueGoodTable
        :columns="columns1"
        :rows="rows1"
        :sort-options="{ enabled: false }"
        styleClass="vgt-table condensed bordered"
        v-on:row-click="onRowClick"
      >
        <template #table-row="props">
          <span v-if="props.column.field === 'action'" class="text-center">
            <div>
              <CButton
                color="warning"
                size="sm"
                @click="
                  () => {
                    modalTitle = 'Software Development'
                    editModal = true
                  }
                "
                >Ubah</CButton
              >
            </div>
          </span>
          <span v-else>
            {{ props.formattedRow[props.column.field] }}
          </span>
        </template>
      </VueGoodTable>
    </CCardBody>
  </CCard>
  <CCard class="mb-3">
    <CCardHeader>
      <h6 class="text-center">Data Science</h6>
    </CCardHeader>
    <CCardBody
      disabled
      v-if="!isLoaded"
      class="justify-content-center text-center"
    >
      <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
      Memuat...
    </CCardBody>
    <CCardBody v-if="isLoaded">
      <Alerts
        :showError="showError"
        :showSuccess="showSuccess"
        :errorMsg="errorMsg"
        :successMsg="successMsg"
        @update:showError="updateError"
        @update:showSuccess="updateSuccess"
      />
      <VueGoodTable
        :columns="columns2"
        :rows="rows2"
        :sort-options="{ enabled: false }"
        styleClass="vgt-table condensed bordered"
        v-on:row-click="onRowClick"
        ><template #table-row="props">
          <span v-if="props.column.field === 'action'" class="text-center">
            <div>
              <CButton
                color="warning"
                size="sm"
                @click="
                  () => {
                    modalTitle = 'Data Science'
                    editModal = true
                  }
                "
                >Ubah</CButton
              >
            </div>
          </span>
          <span v-else>
            {{ props.formattedRow[props.column.field] }}
          </span>
        </template>
      </VueGoodTable>
    </CCardBody>
  </CCard>
  <CCard class="mb-4">
    <CCardHeader>
      <h6 class="text-center">Infrastruktur dan Keamanan Jaringan</h6>
    </CCardHeader>
    <CCardBody
      disabled
      v-if="!isLoaded"
      class="justify-content-center text-center"
    >
      <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
      Memuat...
    </CCardBody>
    <CCardBody v-if="isLoaded">
      <Alerts
        :showError="showError"
        :showSuccess="showSuccess"
        :errorMsg="errorMsg"
        :successMsg="successMsg"
        @update:showError="updateError"
        @update:showSuccess="updateSuccess"
      />
      <VueGoodTable
        :columns="columns3"
        :rows="rows3"
        :sort-options="{ enabled: false }"
        styleClass="vgt-table condensed bordered"
        v-on:row-click="onRowClick"
        ><template #table-row="props">
          <span v-if="props.column.field === 'action'" class="text-center">
            <div>
              <CButton
                color="warning"
                size="sm"
                @click="
                  () => {
                    modalTitle = 'Jaringan'
                    editModal = true
                  }
                "
                >Ubah</CButton
              >
            </div>
          </span>
          <span v-else>
            {{ props.formattedRow[props.column.field] }}
          </span>
        </template></VueGoodTable
      >
    </CCardBody>
  </CCard>
</template>

<script>
import 'vue-good-table-next/dist/vue-good-table-next.css'
import { VueGoodTable } from 'vue-good-table-next'
import axios from 'axios'
import Alerts from '@/components/Alerts.vue'
import { ref, computed } from 'vue'
import SubmitButton from '@/components/SubmitButton.vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default {
  name: 'CourseSpec',
  setup() {
    let allCourse = ref([])
    let searchTerm = ref('')
    const searchCourse = computed(() => {
      if (searchTerm.value === '') {
        return []
      }

      let matches = 0

      return allCourse.value.filter((course) => {
        if (
          course.name.toLowerCase().includes(searchTerm.value.toLowerCase()) &&
          matches < 5
        ) {
          matches++
          return course
        }
      })
    })

    return {
      searchTerm,
      searchCourse,
      allCourse,
      v$: useVuelidate(),
    }
  },
  components: {
    VueGoodTable,
    Alerts,
    SubmitButton,
  },
  data() {
    return {
      columns1: [
        {
          label: 'Mata Kuliah',
          field: 'soft_dev',
        },
        {
          label: 'Aksi',
          field: 'action',
          hidden: true,
          width: '100px',
        },
        {
          label: 'Id',
          field: 'id',
          hidden: true,
        },
        {
          label: 'spec_id',
          field: 'spec_id',
          hidden: true,
        },
      ],
      columns2: [
        {
          label: 'Mata Kuliah',
          field: 'data_science',
        },
        {
          label: 'Aksi',
          field: 'action',
          hidden: true,
          width: '100px',
        },
        {
          label: 'Id',
          field: 'id',
          hidden: true,
        },
        {
          label: 'spec_id',
          field: 'spec_id',
          hidden: true,
        },
      ],
      columns3: [
        {
          label: 'Mata Kuliah',
          field: 'networking',
        },
        {
          label: 'Aksi',
          field: 'action',
          hidden: true,
          width: '100px',
        },
        {
          label: 'Id',
          field: 'id',
          hidden: true,
        },
        {
          label: 'spec_id',
          field: 'spec_id',
          hidden: true,
        },
      ],
      rows1: [],
      rows2: [],
      rows3: [],
      isLoaded: false,
      showSuccess: false,
      successMsg: '',
      showError: false,
      errorMsg: '',
      editModal: false,
      modalTitle: '',
      selectedRow: '',
      selectedCourse: '',
      showResults: false,
    }
  },
  validations() {
    return {
      searchTerm: {
        required,
      },
    }
  },
  beforeMount() {
    if (
      this.$store.state.role === 'Pengelola' ||
      this.$store.state.role === 'Admin'
    ) {
      this.columns1[1].hidden = false
      this.columns2[1].hidden = false
      this.columns3[1].hidden = false
    }
    this.getCourseData()
  },
  methods: {
    onRowClick(params) {
      this.selectedRow = params.row
    },
    setTouched(theModel) {
      if (theModel == 'searchTerm' || theModel == 'all') {
        this.v$.searchTerm.$touch()
      }
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
          const data = result.data.data
          data.forEach((e) => {
            if (e.spec_id === 1) {
              return this.rows1.push({
                spec_id: e.spec_id,
                id: e.id,
                soft_dev: e.course_name,
                course_code: e.course_code,
              })
            }
            if (e.spec_id === 2) {
              return this.rows2.push({
                spec_id: e.spec_id,
                id: e.id,
                data_science: e.course_name,
                course_code: e.course_code,
              })
            }
            if (e.spec_id === 3) {
              return this.rows3.push({
                spec_id: e.spec_id,
                id: e.id,
                networking: e.course_name,
                course_code: e.course_code,
              })
            }
            this.allCourse.push({ name: e.course_name, id: e.id })
          })
          this.isLoaded = true
        })
        .catch((error) => {
          this.showError = true
          this.errorMsg =
            error.response !== undefined ? error.response.data.message : error
        })
    },
    async editCourse() {
      try {
        this.setTouched('all')
        if (!this.v$.$invalid) {
          const requests = [
            axios.patch(
              this.$store.state.backendUrl + 'course/' + this.selectedRow.id,
              { spec_id: '0' },
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${this.$cookies.get('token')}`,
                },
              },
            ),
            axios.patch(
              this.$store.state.backendUrl + 'course/' + this.selectedCourse,
              { spec_id: +this.selectedRow.spec_id },
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${this.$cookies.get('token')}`,
                },
              },
            ),
          ]

          const result = await Promise.all(requests)
          if (result) {
            this.showSuccess = true
            this.successMsg = 'Berhasil merubah data!'
            this.editModal = false
            setTimeout(() => {
              this.$router.go()
            }, 1000)
          }
        }
      } catch (error) {
        this.editModal = false
        this.showError = true
        this.errorMsg =
          error.response !== undefined ? error.response.data.message : error
      }
    },
    onResultSelected(name, id) {
      this.searchTerm = name
      this.selectedCourse = id
      this.showResults = false
    },
    updateError(value) {
      this.showError = value
    },
    updateSuccess(value) {
      this.showSuccess = value
    },
  },
  watch: {
    searchTerm() {
      this.showResults = true
    },
  },
}
</script>
