<!-- eslint-disable vue/valid-v-for -->
<template>
  <CModal
    :visible="confirmLogout"
    @close="
      () => {
        confirmLogout = false
      }
    "
  >
    <CModalHeader>Konfirmasi Keluar</CModalHeader>
    <CModalBody>Apakah anda yakin ingin keluar?</CModalBody
    ><CModalFooter>
      <CButton
        color="secondary"
        @click="
          () => {
            confirmLogout = false
          }
        "
        >Batal</CButton
      ><CButton color="primary" @click="logout()">Keluar</CButton>
    </CModalFooter></CModal
  >
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
      <CDropdownItem
        @click="
          () => {
            confirmLogout = true
          }
        "
        class="btn"
      >
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
      avatar: this.$cookies.get('profile_pic'),
      confirmLogout: false,
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
