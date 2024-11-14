export default function formatter() {

    //function to validate string
    const formatStopName = (str = '') => {
        const delimiter = ' ';
        const spl = str.split(delimiter);
        let a = ''
        for (let i = 0; i < spl.length; i++) {
            a = a + delimiter + spl[i][0].toUpperCase() + '' + spl[i].slice(1, spl[i].length).toLowerCase()
        }

        return a
    }

    return {
        formatStopName
    }
}