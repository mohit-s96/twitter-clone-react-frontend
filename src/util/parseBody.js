const parseBody = (data) => {
    let match = /^@[a-zA-Z0-9_]{3,20}$/;
    data = data.split(' ');
    let secCheck = data.map(x => {
        x = x.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return x;
    });
    let newData = secCheck.map(x => {
        if(match.test(x)){
            let y = x.split('@');
            x = `<a class="test-feature" href="/user/${y[1]}" target="_blank"><span class="match">${x}</span></a>`
            return x;    
        }
        else{
            return x;
        }
    });
    data = newData.join(' ');
    return data;
}
export default parseBody;
