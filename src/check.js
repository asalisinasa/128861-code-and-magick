function getMessage(a, b) {

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
    var distance = a.reduce(function(sum, current) {
      return sum + current;
    });
    return 'Я прошёл ' + distance + ' шагов';
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    var distanceA = a.reduce(function(sum, current) {
      return sum + current;
    });
    var distanceB = b.reduce(function(sum, current) {
      return sum + current;
    });
    distanceAB = distanceA + distanceB;
    return 'Я прошёл ' + distanceAB + ' метров';
  }

}
