const parseBody = (data) => {
    let match = /^@[a-zA-Z0-9_]{3,20}$/;
    let matchUri = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/;
    let matchNew = /[a-zA-Z0-9]\.[a-zA-Z0-9](\/[a-zA-Z0-9])?/
    data = data.split(' ');
    let secCheck = data.map(x => {
        x = x.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return x;
    });
    let newData = secCheck.map(x => {
        if(match.test(x)){
            let y = x.split('@');
            y = `<a class="test-feature" href="/user/${y[1]}" target="_blank"><span class="match">${x}</span></a>`
            return y;    
        }
        else if(matchUri.test(x)){
            let parse = x.split('.');
            if( parse[0] === 'www'){
            let z = `<a class="test-feature" href="http://${x}" target="_blank"><span class="match">${x}</span></a>`
            return z;
            }
            let z = `<a class="test-feature" href="${x}" target="_blank"><span class="match">${x}</span></a>`
            return z;
        }
        else if(matchNew.test(x)){
            let m = `<a class="test-feature" href="http://${x}" target="_blank"><span class="match">${x}</span></a>`;
            return m;
        }
        else{
            return x;
        }
    });
    data = newData.join(' ');
    return data;
}
export default parseBody;
