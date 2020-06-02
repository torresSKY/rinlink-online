<script>
    export default {
      name: 'authredirect2',
      created() {
        const hash = window.location.search.slice(1)
        window.opener.location.href = window.location.origin + '/login#' + hash
        window.close()
  }
    }
</script>
