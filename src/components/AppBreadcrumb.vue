<template>
  <CBreadcrumb
    class="d-md-down-none me-auto mb-0"
    style="--cui-breadcrumb-divider: '>'"
  >
    <CBreadcrumbItem
      v-for="item in breadcrumbs"
      :key="item"
      :href="item.active ? '' : item.path"
      :active="item.active"
    >
      {{ item.name }}
    </CBreadcrumbItem>
  </CBreadcrumb>
</template>

<script>
import { onMounted, ref } from 'vue'
import router from '@/router'

export default {
  name: 'AppBreadcrumb',
  setup() {
    const breadcrumbs = ref()

    const getBreadcrumbs = () =>
      router.currentRoute.value.matched.map((route) => ({
        active: route.path === router.currentRoute.value.fullPath,
        name: route.name,
        path: `${router.options.history.base}${route.path}`,
      }))

    router.afterEach(() => {
      breadcrumbs.value = getBreadcrumbs()
    })

    onMounted(() => {
      breadcrumbs.value = getBreadcrumbs()
    })

    return {
      breadcrumbs,
    }
  },
}
</script>
