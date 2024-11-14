
import axios from "axios"; 
import formatter from "./formatter.js";

export default function locations() {
    const getLocations = (v = '', country = '') => {
        return new Promise((resolve, reject) => {
            if (v) {
                axios.get(
                    'https://api.timetable.eurail.com/v2/locations?input=' + v + '&results=15'
                ).then(r => {
                    const regExp = /\(([^)]+)\)/;
                    let arr = country ? r.data.filter(x => regExp.exec(x.station)[1].toLowerCase() == country.toLowerCase()) : r.data
    
                    const { formatStopName } = formatter();
                    
                    resolve(arr.map(x => 
                        x = {
                            ...x, 
                            station: formatStopName(x.station.split('(')[0].trim())
                        }
                    ))
                })
                .catch(e => {
                    reject(e)
                })
            } else {
                resolve([])
            }
        })
    }

    return {
        getLocations
    }
}

