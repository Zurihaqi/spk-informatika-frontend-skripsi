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
export default {
  name: 'AppHeaderDropdownAccnt',
  data() {
    return {
      toasts: [],
      avatar: localStorage.getItem('profile_pic'),
      errorMgs: '',
      ShowError: false,
    }
  },
  methods: {
    viewProfile() {
      this.$router.push('/profile/view')
    },
    editProfile() {
      this.$router.push('/profile/edit')
    },
    logout() {
      this.$store.commit('Logout')
      this.$router.push('/login')
    },
  },
}
</script>
