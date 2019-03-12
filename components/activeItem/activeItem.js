// components/activeItem/activeItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    beautyServiceInfoTableList: {
      type: Array,
      value: ''
    }
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goSeckill(e) {
      let beautyServiceId = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../seckill/seckill?beautyServiceId=' + beautyServiceId
      })
    }
  }
})