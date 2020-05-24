const length = 10
let array = []
for (let i = 0; i < length; i++) {
  array.push(Math.floor(Math.random() * 1000))
}

// 冒泡排序 时间复杂度O(n2) 空间复杂度O(1) 优化：设置flag，当一遍排序已经没有变化的时候，后续不用再进行遍历
function bubbleSort(array) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        const temp = array[j]
        array[j] = array[j + 1]
        array[j + 1] = temp
      }
    }
  }
}

// 选择排序 时间复杂度O(n2) 空间复杂度O(1)
function selectionSort(array) {
  for (let i = 0; i < array.length; i++) {
    var min = array[i]
    var index = i
    for (var j = i + 1; j < array.length; j++) {
      if (array[j] < min) {
        min = array[j]
        index = j
      }
    }
    if (min !== array[i]) {
      var temp = array[i]
      array[i] = min
      array[index] = temp
    }
  }
}

// 插入排序 时间复杂度O(n2) 空间复杂度O(1) 优化：拆半插入
function insertionSort(array) {
  for (var i = 1; i < array.length; i++) {
    var pre = i - 1
    var current = array[i]
    while (pre >= 0 && array[pre] > current) {
      array[pre + 1] = array[pre]
      pre--
    }
    array[pre + 1] = current
  }
}

// 快速排序 时间复杂度
function quickSort(array, leftIndex, rightIndex) {
  leftIndex = typeof leftIndex === 'number' ? leftIndex : 0
  rightIndex = typeof rightIndex === 'number' ? rightIndex : array.length - 1
  if (array.length > 1 && leftIndex < rightIndex) {
    var base = array[leftIndex] 
    var baseIndex = leftIndex
    for (var i = leftIndex + 1; i <= rightIndex; i++) {
      if (array[i] < base) {
        var temp = array[i] 
        var nowIndex = i
        while (nowIndex > leftIndex) {
          array[nowIndex] = array[nowIndex - 1]
          nowIndex--
        }
        array[leftIndex] = temp
        baseIndex++
      }
    }
    // console.log(array, leftIndex, baseIndex, rightIndex)
    quickSort(array, leftIndex, baseIndex - 1)
    quickSort(array, baseIndex + 1, rightIndex)
  }
}
console.log(array)
setTimeout(() => {
  quickSort(array)
  console.log(array)
}, 50)
