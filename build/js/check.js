function getMessage(a, b) {
  var i1 = 0;
  var i2 = 0;
  var sum = 0;
  var length = 0;

  if (typeof a === 'boolean') {
    if (a === true) {
      return 'Я попал в ' + b;
    }
    else {
      return 'Я никуда не попал';
    }
  }

  if (typeof a === 'number') {
    return 'Я прыгнул на ' + a * 100 + ' сантиметров';
  }

  if (Array.isArray(a) && !Array.isArray(b)) {
    for (i1; i1 < a.length; i1++) {
      sum += a[i1];
    }
    return 'Я прошёл ' + sum + ' шагов';
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    for (i2; i2 < a.length; i2++) {
      length += (a[i2] * b[i2]);
    }
    return 'Я прошёл ' + length + ' метров';
  }
}
