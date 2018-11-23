<!--{}-->
<script>
export default {
  data() {
    const hours = new Date().getHours();
    return {
      imgUrl: hours > 21 && hours < 6 ? 'night.png' :
        'day.png',
    };
  },
}
</script>
