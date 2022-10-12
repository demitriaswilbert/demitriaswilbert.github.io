let textbox = document.getElementById('input_textbox');
let i = 0
let guesses = 20;
textbox.value = ""

let costs = new Array(10000);

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

textbox.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.key == "Enter")
    {
        let a = document.getElementById('content');
        while(a.hasChildNodes())
        {
            a.childNodes[0].remove();
        }
        textbox.value = "";
    }
    if (event.key !== "Enter" || event.key !== "Delete") {

        let a = document.getElementById('content');
        while(a.hasChildNodes())
        {
            a.childNodes[0].remove();
        }
        if(textbox.value == "") return;
        let tmp = tenclosest(textbox.value);
        for (let j = 0; j < guesses; j++)
        {
            let s = document.createElement('div');
            s.id = j.toString(10);
            s.innerHTML = `<h3><span>${j+1}. </span><span>${tmp[j].string} (${tmp[j].dist})</span></h3>`
            a.appendChild(s);
        }
        return;
    }
});

function uiLevenshteinDistance(s1, s2)
{
    if (s1.length == 0)
        return s2.length;
    if (s2.length == 0)
        return s1.length;

    // let costs = new Array(s2.length + 1);/

    for (let k = 0; k <= s2.length; k++)
        costs[k] = k;

    let i = 0;
    for (let a = 0; a < s1.length; a++)
    {
        const c1 = s1[a];
        costs[0] = i + 1;
        let corner = i, j = 0;
        for (let b = 0; b < s2.length; b++)
        {
            const c2 = s2[b];
            let upper = costs[j + 1];
            if (c1 == c2)
                costs[j + 1] = corner;
            else
            {
                let t = upper < corner ? upper : corner;
                costs[j + 1] = (costs[j] < t ? costs[j] : t) + 1;
            }

            corner = upper;
            j++;
        }
        i++;
    }

    return costs[s2.length];
}

function Strdist()
{
    this.dist = 999;
    this.string = "";
}

function tenclosest(s1)
{
    let b = [];
    for (let i = 0; i < guesses; i++)
    {
        let tmp = new Strdist;
        b.push(tmp);
    }
    let maxdist = 999;
    let maxdist_index = 0;
    for (let i = 0; i < words.length; i++)
    {
        let tmpdist = uiLevenshteinDistance(s1, words[i]);
        if (tmpdist < b[maxdist_index].dist)
        {
            b[maxdist_index].dist = tmpdist;
            b[maxdist_index].string = words[i];
            maxdist = 0;
            for(let j = 0; j < guesses; j++)
            {
                if(b[j].dist > maxdist)
                {
                    maxdist_index = j;
                    maxdist = b[j].dist;
                }
            }
        }
    }
    for(let j = 0; j < guesses; j++)
    {
        for(let k = 0; k < guesses - 1; k++)
        {
            if(b[k].dist > b[k+1].dist)
            {
                let tmp = b[k];
                b[k] = b[k + 1];
                b[k + 1] = tmp;
            }
        }
    }
    return b;
}

function getclosest(s1)
{
    if(s1 == "") return "";
    let dist = 999;
    tmpword = s1;
    for(let i = 0; i < words.length; i++)
    {
        let tmpdist = uiLevenshteinDistance(s1, words[i]);
        if(tmpdist < dist)
        {
            tmpword = words[i];
            dist = tmpdist;
        }
    }
    return tmpword;
}
