function getMedian(input, odd){
	var middle = Math.floor(input.length/2);
    var median = odd ? input[middle] : ((input[middle-1] + input[middle]) / 2.0);
    return median;
}

function getBoxplot(input){
	var min = d3.min(input);
	var max = d3.max(input);

    var sortedInput = input.sort(function(a, b){return a-b});
    var odd = (input.length % 2);

    var median = getMedian(sortedInput, odd);
    var halfIndex = Math.floor(odd ? sortedInput.indexOf(median) : (sortedInput.length/2));

    var firstHalf = sortedInput.slice(0, odd ? halfIndex+1 : halfIndex);
    var secondHalf = sortedInput.slice(halfIndex, sortedInput.length);

    var quartile1 = getMedian(firstHalf);
    var quartile2 = getMedian(secondHalf);

    var boxplot = [min, quartile1, median, quartile2, max];

    return boxplot;
}
