const lines = document.querySelectorAll('span.pl-c');

if (lines) {
    const data = {};
    for (let line of lines) {
        const dataCodeText = line.getAttribute('data-code-text');
        const parent = line.parentElement;
        const parentId = parent ? parent.getAttribute('id') : null;
        data[`${parentId}`] = `${dataCodeText}`
    }
    console.log(data);
}