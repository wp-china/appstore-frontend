<template>
Hello
</template>
<script>
export default {
  data() {
    const gutters = {};
    const colCounts = {};
    const vgutters = {};
    [8, 16, 24, 32, 40, 48].forEach((value, i) => {
      gutters[i] = value;
    });
    [8, 16, 24, 32, 40, 48].forEach((value, i) => {
      vgutters[i] = value;
    });
    [2, 3, 4, 6, 8, 12].forEach((value, i) => {
      colCounts[i] = value;
    });
    return {
      gutterKey: 1,
      vgutterKey: 1,
      colCountKey: 2,
      colCounts,
      gutters,
      vgutters,
    };
  },
  computed: {
    rowColHtml() {
      const colCount = this.colCounts[this.colCountKey];
      const getter = [this.gutters[this.gutterKey], this.vgutters[this.vgutterKey]];
      let colCode = '<a-row :gutter="[' + getter + ']">\n';
      for (let i = 0; i < colCount; i++) {
        const spanNum = 24 / colCount;
        colCode += '  <a-col :span="' + spanNum + '"/>\n';
      }
      colCode += '</a-row>';
      return colCode;
    },
  },
};
</script>
<style scoped>
#components-grid-demo-playground [class~='ant-col'] {
  background: transparent;
  border: 0;
}
#components-grid-demo-playground [class~='ant-col'] > div {
  background: #00a0e9;
  height: 120px;
  line-height: 120px;
  font-size: 13px;
}
#components-grid-demo-playground pre {
  background: #f9f9f9;
  border-radius: 6px;
  font-size: 13px;
  padding: 8px 16px;
}
</style>