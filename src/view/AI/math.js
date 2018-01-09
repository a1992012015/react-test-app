let threshold = 1.1;

/*module.exports = {
    greatThan: function(a, b) {
        return a >= b * threshold;
    },
    greatOrEqualThan: function(a, b) {
        return a * threshold >= b;
    },
    littleThan: function(a, b) {
        return a * threshold <= b;
    },
    littleOrEqualThan: function(a, b) {
        return a <= b * threshold;
    },
    equal: function(a, b) {
        return(a * threshold >= b) && (a <= b * threshold);
    }
};*/
export default {
    greatThan: function(a, b) {
        return a >= b * threshold;
    },
    greatOrEqualThan: function(a, b) {
        return a * threshold >= b;
    },
    littleThan: function(a, b) {
        return a * threshold <= b;
    },
    littleOrEqualThan: function(a, b) {
        return a <= b * threshold;
    },
    equal: function(a, b) {
        return(a * threshold >= b) && (a <= b * threshold);
    }
}