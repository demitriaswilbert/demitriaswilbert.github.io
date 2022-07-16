let updatePeriod = 100;

let counters = new Array(20), current = 0;

for(let i = 0; i < counters.length; i++)
    counters[i] = 0;

let updatecps = setInterval(() => {
    current = (current + 1) % counters.length;
    counters[current] = 0;
}, updatePeriod);

let incr = () => {counters[current]++;};

let updateavg = setInterval(() => {
    let sum = 0;
    for (let i = 0; i < counters.length; i++)
        sum += counters[i];
    // sum is the amount of clicks in the last updatePeriod * counters.length milliseconds
    let cps = sum * 1000 / (updatePeriod * counters.length)
    document.getElementById("speed").innerText = `${cps} CPS`;
}, updatePeriod)


document.body.addEventListener('keydown', (event) => {
    incr();
})