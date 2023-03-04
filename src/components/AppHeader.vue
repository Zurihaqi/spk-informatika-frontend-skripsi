<template>
  <CHeader position="sticky" class="mb-4">
    <CContainer fluid>
      <CHeaderToggler class="ps-1" @click="$store.commit('toggleSidebar')">
        <CIcon icon="cil-menu" size="lg" />
      </CHeaderToggler>
      <CHeaderBrand v-if="!isMobile()" class="user-select-none mx-auto"
        >SPK Peminatan Informatika</CHeaderBrand
      >
      <CHeaderNav>
        <CNavItem>
          <CNavLink class="btn"> Kritik dan Saran </CNavLink>
        </CNavItem>
        <div class="vr"></div>
        <CNavItem>
          <CNavLink @click="logout()" class="btn"> Keluar </CNavLink>
        </CNavItem>
        <AppHeaderDropdownAccnt />
      </CHeaderNav>
    </CContainer>
    <CHeaderDivider />
    <CContainer fluid>
      <AppBreadcrumb />
    </CContainer>
  </CHeader>
</template>

<script>
import AppBreadcrumb from './AppBreadcrumb'
import AppHeaderDropdownAccnt from './AppHeaderDropdownAccnt'
import axios from 'axios'

export default {
  name: 'AppHeader',
  components: {
    AppBreadcrumb,
    AppHeaderDropdownAccnt,
  },
  methods: {
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
    isMobile() {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        )
      ) {
        return true
      } else {
        return false
      }
    },
  },
}
</script>
