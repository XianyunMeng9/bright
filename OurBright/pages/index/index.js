// index.js
Page({
  data: {
    result: '点击按钮拍照'
  },

  // 拍照并处理
  takePhoto() {
    const ctx = wx.createCameraContext();
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        const tempImagePath = res.tempImagePath;
        console.log('拍照成功，临时路径：', tempImagePath);
        
        // 显示临时路径，实际开发中应上传到后端
        this.setData({
          result: `已拍照，等待识别...`
        });

        // 调用上传图片到后端的方法（后续对接百度AI）
        this.uploadImage(tempImagePath);
      },
      fail: (err) => {
        console.error('拍照失败', err);
        wx.showToast({
          title: '拍照失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  // 上传图片到后端识别（目前仅演示，需替换真实后端地址）
  uploadImage(filePath) {
    // TODO: 替换为你的后端服务器地址
    const serverUrl = 'http://127.0.0.1:5000/recognize'; // 示例地址

    wx.uploadFile({
      url: serverUrl,
      filePath: filePath,
      name: 'image',
      success: (res) => {
        console.log('上传成功', res);
        try {
          const data = JSON.parse(res.data);
          if (data.text) {
            this.setData({ result: data.text });
            // 可选：调用语音播报
            this.speak(data.text);
          } else {
            this.setData({ result: '识别失败，请重试' });
          }
        } catch (e) {
          console.error('解析返回数据失败', e);
          this.setData({ result: '服务器返回错误' });
        }
      },
      fail: (err) => {
        console.error('上传失败', err);
        this.setData({ result: '网络错误，请稍后重试' });
      }
    });
  },

  // 简单语音播报（使用小程序内置语音合成，仅支持部分机型）
  speak(text) {
    // 这里使用 wx.createInnerAudioContext 播放预先合成的语音或使用同声传译
    // 简易版：调用系统语音（仅支持iOS/Android部分接口）
    // 建议后续接入百度语音合成或微信同声传译插件
    wx.showToast({
      title: '即将播报：' + text,
      icon: 'none',
      duration: 2000
    });
    // 真正的语音播报可集成百度TTS或微信插件
  },

  // 可选：摄像头错误处理
  error(e) {
    console.error('摄像头错误', e.detail);
    wx.showToast({
      title: '摄像头初始化失败',
      icon: 'none'
    });
  }
});