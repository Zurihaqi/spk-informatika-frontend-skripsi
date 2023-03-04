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
      <Alerts
        :showError="showError"
        :showSuccess="showSuccess"
        :errorMsg="errorMsg"
        :successMsg="successMsg"
        @update:showError="updateError"
        @update:showSuccess="updateSuccess"
      />
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
        <CButton color="primary" @click="sendData()">Simpan</CButton>
      </div>
    </CCardFooter>
  </CCard>
</template>

<script>
import axios from 'axios'
import Alerts from '../../../components/Alerts.vue'

export default {
  name: 'GradeInput',
  components: { Alerts },
  data() {
    return {
      options: [
        { label: 'Pilih', value: undefined },
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
      softDevCourses: [],
      dataSciCourses: [],
      networkingCourses: [],
      allGrades: [],
      gradesToPatch: [],
      gradesToAdd: [],
      isLoaded: false,
      showError: false,
      showSuccess: false,
      successMsg: '',
      errorMsg: '',
    }
  },
  async beforeMount() {
    await this.getData()
    this.isLoaded = true
  },
  methods: {
    async getData() {
      try {
        const endpoints = [
          this.$store.state.backendUrl + 'course',
          this.$store.state.backendUrl + 'grade',
        ]
        await Promise.all(
          endpoints.map((endpoint) =>
            axios.get(endpoint, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }),
          ),
        ).then((results) => {
          if (results[0].status === 201 && results[1].status === 201) {
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
                  course.grade_id = grade.id
                  this.allGrades.push({
                    id: grade.id,
                    course_id: grade.course_id,
                    lettered_grade: grade.lettered_grade,
                  })
                }
              }
              for (const course of this.dataSciCourses) {
                if (grade.course_id === course.id) {
                  course.grade = grade.lettered_grade
                  course.grade_id = grade.id
                  this.allGrades.push({
                    id: grade.id,
                    course_id: grade.course_id,
                    lettered_grade: grade.lettered_grade,
                  })
                }
              }
              for (const course of this.networkingCourses) {
                if (grade.course_id === course.id) {
                  course.grade = grade.lettered_grade
                  course.grade_id = grade.id
                  this.allGrades.push({
                    id: grade.id,
                    course_id: grade.course_id,
                    lettered_grade: grade.lettered_grade,
                  })
                }
              }
            }
          }
        })
      } catch (error) {
        this.showError = true
        this.errorMsg = error.data.message
      }
    },
    async sendData() {
      try {
        for (const item of this.softDevCourses) {
          this.gradesToAdd.push({
            lettered_grade: item.grade,
            course_id: item.id,
            grade_id: item.grade_id,
          })
        }

        for (const item of this.dataSciCourses) {
          this.gradesToAdd.push({
            lettered_grade: item.grade,
            course_id: item.id,
            grade_id: item.grade_id,
          })
        }

        for (const item of this.networkingCourses) {
          this.gradesToAdd.push({
            lettered_grade: item.grade,
            course_id: item.id,
            grade_id: item.grade_id,
          })
        }

        this.gradesToAdd = this.gradesToAdd.filter((obj1) => {
          const isExcluded = this.allGrades.some((obj2) => {
            return obj1.course_id === obj2.course_id
          })
          if (isExcluded) {
            this.gradesToPatch.push(obj1)
          }
          return !isExcluded
        })

        this.gradesToPatch = this.gradesToPatch.filter((obj1) => {
          return !this.allGrades.some((obj2) => {
            return obj1.lettered_grade === obj2.lettered_grade
          })
        })

        this.gradesToAdd = this.gradesToAdd.filter((obj, index, self) => {
          return (
            index ===
            self.findIndex(
              (t) =>
                t.course_id === obj.course_id &&
                t.lettered_grade === obj.lettered_grade,
            )
          )
        })

        this.gradesToPatch = this.gradesToPatch.filter((obj, index, self) => {
          return (
            index ===
            self.findIndex(
              (t) =>
                t.course_id === obj.course_id &&
                t.lettered_grade === obj.lettered_grade,
            )
          )
        })

        if (this.gradesToAdd !== undefined) {
          for (const item of this.gradesToAdd) {
            if (item.lettered_grade !== undefined) {
              const post = await axios.post(
                this.$store.state.backendUrl + 'grade',
                item,
                {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                },
              )
              if (post.status === 201) {
                this.showSuccess = true
                this.successMsg = 'Berhasil meyimpan nilai!'
              }
            }
            if (this.gradesToPatch !== undefined) {
              for (const item of this.gradesToPatch) {
                const patch = await axios.patch(
                  this.$store.state.backendUrl + 'grade/' + item.grade_id,
                  {
                    lettered_grade: item.lettered_grade,
                  },
                  {
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                  },
                )
                if (patch.status === 201) {
                  this.showSuccess = true
                  this.successMsg = 'Berhasil meyimpan nilai!'
                }
                return false
              }
            }
          }
        }
      } catch (error) {
        this.showError = true
        this.errorMsg = error.response.data.message
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
