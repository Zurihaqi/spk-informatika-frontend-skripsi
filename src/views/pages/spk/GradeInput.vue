<template>
  <CCard class="mb-3">
    <CCardHeader> <h6>Input Nilai Mata Kuliah</h6> </CCardHeader>
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
                  :disabled="locked"
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
                  :disabled="locked"
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
                  :disabled="locked"
                  :options="options"
                  class="mb-3"
                  v-model="course.grade"
                ></CFormSelect>
              </div>
            </div>
          </CCol>
        </CRow>
      </CForm>
      <hr />
      <div class="user-select-none">
        Catatan: Masukan nilai "E" jika nilai kosong atau belum ada nilai.
      </div>
    </CCardBody>
    <CCardFooter v-if="isLoaded"
      ><div class="d-md-flex justify-content-md-start me-6">
        <SubmitButton
          class="me-3"
          :isSendingForm="isSendingForm"
          title="Simpan"
          color="primary"
          @click="sendData()"
        ></SubmitButton>
        <CButton
          color="warning"
          @click="
            () => {
              locked ? (locked = false) : (locked = true)
            }
          "
          >{{ locked ? 'Buka' : 'Kunci' }}</CButton
        >
      </div>
    </CCardFooter>
  </CCard>
</template>

<script>
import axios from 'axios'
import Alerts from '@/components/Alerts.vue'
import SubmitButton from '@/components/SubmitButton.vue'

export default {
  name: 'GradeInput',
  components: { Alerts, SubmitButton },
  data() {
    return {
      options: [
        { label: 'Pilih', value: undefined },
        { label: 'A', value: 'A' },
        { label: 'A-', value: 'A-' },
        { label: 'B+', value: 'B+' },
        { label: 'B', value: 'B' },
        { label: 'B-', value: 'B-' },
        { label: 'C+', value: 'C+' },
        { label: 'C', value: 'C' },
        { label: 'C-', value: 'C-' },
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
      locked: true,
      isSendingForm: false,
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
                Authorization: `Bearer ${this.$cookies.get('token')}`,
              },
            }),
          ),
        ).then((results) => {
          if (results[0].status === 201 && results[1].status === 201) {
            const courses = results[0].data.data
            const grades = results[1].data.data

            courses.filter((e) => {
              if (e.spec_id === 1) this.softDevCourses.push(e)
              if (e.spec_id === 2) this.dataSciCourses.push(e)
              if (e.spec_id === 3) this.networkingCourses.push(e)
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
        this.toTop()
        this.showError = true
        this.errorMsg =
          error.response !== undefined ? error.response.data.message : error
      }
    },
    async sendData() {
      try {
        this.locked = true
        this.isSendingForm = true
        for (const item of this.softDevCourses) {
          if (item.grade !== 'Pilih') {
            this.gradesToAdd.push({
              lettered_grade: item.grade,
              course_id: item.id,
              grade_id: item.grade_id,
            })
          }
        }

        for (const item of this.dataSciCourses) {
          if (item.grade !== 'Pilih') {
            this.gradesToAdd.push({
              lettered_grade: item.grade,
              course_id: item.id,
              grade_id: item.grade_id,
            })
          }
        }

        for (const item of this.networkingCourses) {
          if (item.grade !== 'Pilih') {
            this.gradesToAdd.push({
              lettered_grade: item.grade,
              course_id: item.id,
              grade_id: item.grade_id,
            })
          }
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

        let add
        let patch

        if (this.gradesToAdd !== undefined) {
          add = await Promise.all(
            this.gradesToAdd.map(async (item) => {
              if (item.lettered_grade !== undefined) {
                await axios.post(this.$store.state.backendUrl + 'grade', item, {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.$cookies.get('token')}`,
                  },
                })
              }
            }),
          )
        }
        if (this.gradesToPatch !== undefined) {
          patch = await Promise.all(
            this.gradesToPatch.map(async (item) => {
              if (item.lettered_grade !== undefined) {
                await axios.patch(
                  this.$store.state.backendUrl + 'grade/' + item.grade_id,
                  {
                    lettered_grade: item.lettered_grade,
                  },
                  {
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${this.$cookies.get('token')}`,
                    },
                  },
                )
              }
            }),
          )
        }
        if (add || patch) {
          this.isSendingForm = false
          this.showSuccess = true
          this.successMsg = 'Berhasil meyimpan nilai!'
          this.toTop()
          this.reloadPage()
        }
      } catch (error) {
        this.isSendingForm = false
        this.toTop()
        this.showError = true
        this.errorMsg =
          error.response !== undefined ? error.response.data.message : error
        this.reloadPage()
      }
    },
    updateError(value) {
      this.showError = value
    },
    updateSuccess(value) {
      this.showSuccess = value
    },
    handleScroll: function () {
      if (this.scTimer) return
      this.scTimer = setTimeout(() => {
        this.scY = window.scrollY
        clearTimeout(this.scTimer)
        this.scTimer = 0
      }, 100)
    },
    toTop: function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
    reloadPage() {
      setTimeout(() => {
        this.$router.go()
      }, 1000)
    },
  },
}
</script>
