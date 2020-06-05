const {log} = console
let a = { name:123 }

a.age = 18

log(a)



// 从组件加载后就执行、销毁时停止的计时器

export default {
  mounted () {
    this.createTimeout()
    // 还可以创建多个
    // this.createTimeout()
    // this.createTimeout()
    
  },
  methods: {
    createTimeout() {
      var timeout = setTimeout(() => {
        console.log(new Date());
      }, 1000)
      this.$once('hook:beforeDestroy', () => {
        timeout = null
      })
    }
  }
}
