<template>
  <div class="mb-4">
    <vue-good-table
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
      }"
      max-height="350px"
      :fixed-header="true"
    />
  </div>
</template>

<script>
import 'vue-good-table-next/dist/vue-good-table-next.css'
import { VueGoodTable } from 'vue-good-table-next'
import axios from 'axios'

export default {
  name: 'ViewCourse',
  components: {
    VueGoodTable,
  },
  data() {
    return {
      columns: [
        {
          label: 'Kode Mata Kuliah',
          field: 'course_code',
          type: 'number',
        },
        {
          label: 'Nama Mata Kuliah',
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
      ],
      rows: [],
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
          this.rows = result.data.data
          return result
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
}
</script>
