const getWords = (keyword) => {
    if (keyword.trim() === ''){
        alert('Please enter a non-empty string!');
        document.getElementById('search').value = '';
        document.getElementById('search').focus();
        return;
    }
    let major = document.querySelector('.content-major');
    let detail = document.querySelector('.content-meanings');
    let more = document.getElementById('more');

    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${keyword}`
    major.innerHTML = '';
    detail.innerHTML = '';

    fetch(url)
        .then(res => res.json())
        .then(data => {
            var index = 0;
            /* if have data */
            if (data.length) {
                console.log(data);

                /* major content */
                major.innerHTML = `
                <div class="flex flex-middle mb-20">
                    <h1>${data[0].word}</h1>
                    <span class="text-gray">${data[0].phonetic}</span>
                </div>
                ${getAudio(data[0].phonetics)}`

                /* primary definition */
                for (const meaning of data[index].meanings) {
                    detail.innerHTML += `
                    <div class='mb-40'>
                        <div class="pb-10">
                            <h3 class='italic-txt'>${meaning.partOfSpeech}</h3>
                            <p class='text-red synonyms'>
                                ${meaning.synonyms.length ? `Synonyms:  ${meaning.synonyms.join(', ')}` : ''}
                            </p>
                        </div>
                        <ol class='pl-20'>${getMeanings(meaning.definitions)}</ol>
                    </div>`
                }

                index++;
                index < data.length ? more.style.display = 'block' : 'none';
                /* if have any definitions, render them */
                more.onclick = () => {
                    if (index >= data.length) return;
                    for (const meaning of data[index].meanings) {
                        detail.innerHTML += `
                        <div class='mb-40'>
                            <h3 class='pb-10 italic-txt'>${meaning.partOfSpeech}</h3>
                            <ol class='pl-20'>${getMeanings(meaning.definitions)}</ol>
                        </div>`
                    }
                    index++;
                    if (index >= data.length) {
                        more.style.display = 'none';
                    }
                }
            }
            /* else render an error message */
            else {
                major.innerHTML = `
                <div class="flex flex-middle mb-20">
                    <h1>${data.title}</h1>
                </div>
                <p>${data.message} ${data.resolution}</p>
                `
            }

        })
}

const getMeanings = (definitions) => {
    var res = '';
    for (const d of definitions)
        res += `
        <li class="ml-20 mb-20">
            <p class='text-justify'>${d.definition}</p>
            <div class="ml-20">
                <p class='text-red synonyms'>${d.synonyms.length ? `Synonyms:  ${d.synonyms.join(', ')}` : ''}</p>
                <p class='text-red synonyms'>${d.antonyms.length ? `Antonyms:  ${d.antonyms.join(', ')}` : ''}</p>
            </div>
            <span class="example text-gray">
                ${d.example ? `Example: ${d.example}` : ''}
            </span>
        </li>`

    return res;
}

const getAudio = (phonetics) => {
    var audio = ''
    for (const p of phonetics) if (p.audio.length) audio = p.audio;

    return `<audio src="${audio}" controls style="height: 32px"></audio>`
}

document.getElementById('search').onkeyup = (event) => {
    if (event.keyCode === 13)
        getWords(event.target.value);
}

document.getElementById('submit').onclick = () => {
    getWords(document.getElementById('search').value);
}