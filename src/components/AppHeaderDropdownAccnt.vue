<!-- eslint-disable vue/valid-v-for -->
<template>
  <CToaster placement="top-end">
    <CToast v-for="toast in toasts">
      <CToastHeader closeButton>
        <span class="me-auto fw-bold">{{ toast.title }}</span>
      </CToastHeader>
      <CToastBody>
        {{ toast.content }}
      </CToastBody>
    </CToast>
  </CToaster>
  <CDropdown variant="nav-item">
    <CDropdownToggle placement="bottom-end" class="py-0" :caret="false">
      <CAvatar :src="avatar" size="md" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownHeader component="h6" class="bg-light fw-semibold py-2">
        Pengaturan
      </CDropdownHeader>
      <CDropdownItem @click="viewProfile" class="btn">
        <CIcon icon="cil-user" /> Biodata
      </CDropdownItem>
      <CDropdownItem @click="editProfile" class="btn">
        <CIcon icon="cil-settings" />
        Ubah Biodata
      </CDropdownItem>
      <CDropdownDivider />
      <CDropdownItem @click="logout()" class="btn">
        <CIcon icon="cil-lock-locked" />
        Keluar
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>

<script>
import axios from 'axios'
import placeholder from '@/assets/images/avatars/placeholder.png'

export default {
  name: 'AppHeaderDropdownAccnt',
  data() {
    return {
      toasts: [],
      avatar: placeholder,
      errorMgs: '',
      ShowError: false,
    }
  },
  beforeMount() {
    this.getAva()
  },
  methods: {
    getAva() {
      axios
        .get(this.$store.state.backendUrl + 'user', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((result) => {
          if (result.data.data.profile_pic) {
            this.avatar = result.data.data.profile_pic
          }
        })
        .catch((error) => {
          this.toasts.push({
            title: error.response.data.status,
            content: error.response.data.message,
          })
          this.$store.commit('Logout')
          this.$router.push('/login')
        })
    },
    viewProfile() {
      this.$router.push('/profile/view')
    },
    editProfile() {
      this.$router.push('/profile/edit')
    },
    logout() {
      axios
        .post(
          this.$store.state.backendUrl + 'logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          },
        )
        .then((result) => {
          if (result) {
            this.$store.commit('Logout')
            this.$router.push('/login')
          }
        })
        .catch((error) => {
          this.toasts.push({
            title: error.response.data.status,
            content: error.response.data.message,
          })
          this.$store.commit('Logout')
          this.$router.push('/login')
        })
    },
  },
}
</script>
