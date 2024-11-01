function getRandomInt(min, max) {
    return (Math.floor(Math.random() * (max - min) + min));
}

async function isNumber(data) {
    for (let i = 0; i < data.length; i++) {
        if (
            data[i] !== "0" &&
            data[i] !== "1" &&
            data[i] !== "2" &&
            data[i] !== "3" &&
            data[i] !== "4" &&
            data[i] !== "5" &&
            data[i] !== "6" &&
            data[i] !== "7" &&
            data[i] !== "8" &&
            data[i] !== "9"
        ) return (false);
    }
    return (true);
}

module.exports = {
    getRandomInt, isNumber
}