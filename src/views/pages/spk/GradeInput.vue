<template>
  <CCard class="mb-3">
    <CCardHeader> Input Nilai Mata Kuliah </CCardHeader>
    <CCardBody
      disabled
      v-if="!isLoaded"
      class="justify-content-center text-center"
    >
      <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
      Loading...
    </CCardBody>
    <CCardBody v-if="isLoaded">
      <CForm>
        <CRow>
          <CCol sm="6">
            <div
              v-for="(course, index) in softDevCourses"
              :key="index"
              class="row"
            >
              <div class="col">
                <p class="user-select-none h6">
                  {{ course.course_name }}
                </p>
              </div>
              <div class="col-md-3">
                <CFormSelect
                  :options="options"
                  class="mb-3"
                  v-model="course.grade"
                ></CFormSelect>
              </div>
            </div>
          </CCol>
          <CCol sm="6">
            <div
              v-for="(course, index) in dataSciCourses"
              :key="index"
              class="row"
            >
              <div class="col">
                <p class="user-select-none h6">
                  {{ course.course_name }}
                </p>
              </div>
              <div class="col-md-3">
                <CFormSelect
                  :options="options"
                  class="mb-3"
                  v-model="course.grade"
                ></CFormSelect>
              </div>
            </div>
          </CCol>
          <CCol sm="6">
            <div
              v-for="(course, index) in networkingCourses"
              :key="index"
              class="row"
            >
              <div class="col">
                <p class="user-select-none h6">
                  {{ course.course_name }}
                </p>
              </div>
              <div class="col-md-3">
                <CFormSelect
                  :options="options"
                  class="mb-3"
                  v-model="course.grade"
                ></CFormSelect>
              </div>
            </div>
          </CCol>
        </CRow>
      </CForm>
    </CCardBody>
    <CCardFooter
      ><div class="d-md-flex justify-content-md-start me-6">
        <CButton color="primary">Simpan</CButton>
      </div>
    </CCardFooter>
  </CCard>
</template>

<script>
import axios from 'axios'

export default {
  name: 'GradeInput',
  data() {
    return {
      options: [
        { label: 'Pilih', value: '' },
        { label: 'A', value: 'A' },
        { label: 'B+', value: 'B+' },
        { label: 'B', value: 'B' },
        { label: 'B-', value: 'B-' },
        { label: 'C+', value: 'C+' },
        { label: 'C', value: 'C' },
        { label: 'C-', value: 'C-' },
        { label: 'C', value: 'C' },
        { label: 'D', value: 'D' },
        { label: 'E', value: 'E' },
      ],
      endpoints: [
        this.$store.state.backendUrl + 'course',
        this.$store.state.backendUrl + 'grade',
      ],
      softDevCourses: [],
      dataSciCourses: [],
      networkingCourses: [],
      gradesToPatch: {},
      isLoaded: false,
    }
  },
  async beforeMount() {
    await this.getData()
    this.isLoaded = true
  },
  methods: {
    async getData() {
      try {
        await Promise.all(
          this.endpoints.map((endpoint) =>
            axios.get(endpoint, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }),
          ),
        ).then((results) => {
          const courses = results[0].data.data
          const grades = results[1].data.data

          this.softDevCourses = courses.filter((e) => {
            return e.spec_id === 1
          })
          this.dataSciCourses = courses.filter((e) => {
            return e.spec_id === 2
          })
          this.networkingCourses = courses.filter((e) => {
            return e.spec_id === 3
          })

          for (const grade of grades) {
            for (const course of this.softDevCourses) {
              if (grade.course_id === course.id) {
                course.grade = grade.lettered_grade
              }
            }
            for (const course of this.dataSciCourses) {
              if (grade.course_id === course.id) {
                course.grade = grade.lettered_grade
              }
            }
            for (const course of this.networkingCourses) {
              if (grade.course_id === course.id) {
                course.grade = grade.lettered_grade
              }
            }
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>
