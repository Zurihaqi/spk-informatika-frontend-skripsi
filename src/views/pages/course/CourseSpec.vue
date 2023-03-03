<template>
  <CCard class="mb-3">
    <CCardHeader>
      <h6 class="text-center">Software Development</h6>
    </CCardHeader>
    <CCardBody>
      <vue-good-table
        :columns="columns1"
        :rows="rows1"
        :sort-options="{ enabled: false }"
        styleClass="vgt-table condensed bordered"
      />
    </CCardBody>
  </CCard>
  <CCard class="mb-3">
    <CCardHeader>
      <h6 class="text-center">Data Science</h6>
    </CCardHeader>
    <CCardBody>
      <vue-good-table
        :columns="columns2"
        :rows="rows2"
        :sort-options="{ enabled: false }"
        styleClass="vgt-table condensed bordered"
      />
    </CCardBody>
  </CCard>
  <CCard class="mb-4">
    <CCardHeader>
      <h6 class="text-center">Infrastruktur dan Keamanan Jaringan</h6>
    </CCardHeader>
    <CCardBody>
      <vue-good-table
        :columns="columns3"
        :rows="rows3"
        :sort-options="{ enabled: false }"
        styleClass="vgt-table condensed bordered"
      />
    </CCardBody>
  </CCard>
</template>

<script>
import 'vue-good-table-next/dist/vue-good-table-next.css'
import { VueGoodTable } from 'vue-good-table-next'
import axios from 'axios'

export default {
  name: 'CourseSpec',
  components: {
    VueGoodTable,
  },
  data() {
    return {
      columns1: [
        {
          label: 'Mata Kuliah',
          field: 'soft_dev',
        },
        {
          label: 'Kode Mata Kuliah',
          field: 'course_code',
          width: '200px',
        },
      ],
      columns2: [
        {
          label: 'Mata Kuliah',
          field: 'data_science',
        },
        {
          label: 'Kode Mata Kuliah',
          field: 'course_code',
          width: '200px',
        },
      ],
      columns3: [
        {
          label: 'Mata Kuliah',
          field: 'networking',
        },
        {
          label: 'Kode Mata Kuliah',
          field: 'course_code',
          width: '200px',
        },
      ],
      rows1: [],
      rows2: [],
      rows3: [],
    }
  },
  beforeMount() {
    this.getCourseData()
  },
  methods: {
    getCourseData() {
      axios
        .get(this.$store.state.backendUrl + 'course', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((result) => {
          const data = result.data.data
          data.forEach((e) => {
            if (e.spec_id === 1) {
              return this.rows1.push({
                soft_dev: e.course_name,
                course_code: e.course_code,
              })
            }
            if (e.spec_id === 2) {
              return this.rows2.push({
                data_science: e.course_name,
                course_code: e.course_code,
              })
            }
            if (e.spec_id === 3) {
              return this.rows3.push({
                networking: e.course_name,
                course_code: e.course_code,
              })
            }
          })
          return result
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
}
</script>
