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
                  this.gradesToPatch.push({
                    id: grade.id,
                    course_id: grade.course_id,
                    lettered_grade: grade.lettered_grade,
                  })
                }
              }
              for (const course of this.dataSciCourses) {
                if (grade.course_id === course.id) {
                  course.grade = grade.lettered_grade
                  this.gradesToPatch.push({
                    id: grade.id,
                    course_id: grade.course_id,
                    lettered_grade: grade.lettered_grade,
                  })
                }
              }
              for (const course of this.networkingCourses) {
                if (grade.course_id === course.id) {
                  course.grade = grade.lettered_grade
                  this.gradesToPatch.push({
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
          if (item.grade !== undefined) {
            this.gradesToAdd.push({
              lettered_grade: item.grade,
              course_id: item.id,
            })
          }
        }
        for (const item of this.dataSciCourses) {
          if (item.grade !== undefined) {
            this.gradesToAdd.push({
              lettered_grade: item.grade,
              course_id: item.id,
            })
          }
        }
        for (const item of this.networkingCourses) {
          if (item.grade !== undefined) {
            this.gradesToAdd.push({
              lettered_grade: item.grade,
              course_id: item.id,
            })
          }
        }
        let cleanAddData = this.gradesToAdd.filter(
          (elem, index, arr) =>
            arr.findIndex((e) => e.course_id === elem.course_id) === index,
        )

        const gradesToPatchkeys = Object.keys(this.gradesToPatch)
        gradesToPatchkeys.forEach((key) => {
          if (Object.prototype.hasOwnProperty.call(cleanAddData, key)) {
            delete cleanAddData[key]
          }
        })

        cleanAddData = JSON.parse(JSON.stringify(cleanAddData)).filter((el) => {
          return el !== null
        })

        if (cleanAddData !== undefined) {
          for (const item of cleanAddData) {
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
            if (post) {
              this.showSuccess = true
              this.successMsg = 'Berhasil meyimpan nilai!'
            }
          }
        }

        if (this.gradesToPatch !== undefined) {
          for (const item of this.gradesToPatch) {
            console.log(item)
            const patch = await axios.patch(
              this.$store.state.backendUrl + 'grade/' + item.id,
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
            if (patch) {
              this.showSuccess = true
              this.successMsg = 'Berhasil meyimpan nilai!'
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
