import axios from 'axios'
import locations from './locations.js'

export default function connections() {

    const addLeg = (arr = [], leg) => {
        if (leg.type != 'PLATFORM_CHANGE') {
            arr.push(leg)
        }
    }

    const checkThatJourneysAreComplete = (v = [], filters = {}) => {
        return new Promise((resolve, reject) => {
            const { getLocations } = locations();
            let tmp = []
            let indices = []
            if (filters.start && filters.end) {
                //let journeyIds = []
                
                for (let i = 0; i < v.length; i++) {
                    const journeyEndId = v[i].legs[v[i].legs.length - 1].end.id
                    if (journeyEndId && journeyEndId != filters.end) {

                        const e = '00' + journeyEndId
                        //if (!journeyIds.includes(e)) {
                            
                        //journeyIds.push(e)
                        tmp.push(Promise.resolve(e))
                        indices.push(i)
                        //}
                    } else if (!journeyEndId) {
                        indices.push(i)
                        tmp.push(getLocations(v[i].legs[v[i].legs.length - 1].end.station).then(r => {
                            return r[0].id
                        }))
                    }
                }
            }
            Promise.all(tmp).then(r => {
                let idsAndTimeStamps = []
                for (let i = 0; i < v.length; i++) {

                    const journeyEndId = v[i].legs[v[i].legs.length - 1].end.id

                    //define start date
                    const startDate = v[i].legs[v[i].legs.length - 1].end.dateTimeInISO.split('T')
                    let d = new Date(startDate);
                    d.setUTCDate(d.getUTCDate() + 1);
                    const timeStamp = d.toISOString().split('T')[0] + 'T' + filters.startTime.replaceAll(':', '%3A') + '%3A00.000Z'

                    const strippedEndStationId = filters.end.slice(2)

                    if (!journeyEndId || (journeyEndId && journeyEndId != filters.end && journeyEndId != strippedEndStationId)) {
                        idsAndTimeStamps.push({id: r[i], timeStamp, index: indices.pop()})
                    }
                }
                resolve(idsAndTimeStamps)
            })
            .catch(e => {
                reject(e)
            })
        })
    }

    const loadJourneyStops = (journey = {}, legs = [], filters = {}) => {
        return new Promise((resolve, reject) => {
            let p = []
            for (let i = 0; i < legs.length; i++) {
                if (legs[i].type == "TRAIN_TRAVEL") {
                    const id = legs[i].id.replaceAll('|', '%7C')
                    p.push(axios.get('https://api.timetable.eurail.com/v2/stops?leg=' + id + '&start=' + legs[i].start.id + '&end=' + legs[i].end.id).then(r => {
                        return r.data
                    }))
                }
            }

            Promise.all(p).then(r => {
                if (filters.endTime && filters.startTime) {
                    const endHours = Number(filters.endTime.split(':')[0])
                    const startHours = Number(filters.startTime.split(':')[0])
                }
                

                let index = 0
            
                for (let i = 0; i < legs.length; i++) {
                 
                    if (legs[i].type == "TRAIN_TRAVEL") {
                        legs[i].stops = r[index] ? r[index].stops ? r[index].stops : [] : []
                        index = index + 1
                    }
                }
                journey.legs = legs
                resolve(journey)
            })
            .catch(e => {
                reject(e)
            })
        })
    }

    //limit: max 6!!
    const loadSimpleConnection = (startId, endId, timeStamp = new Date().toISOString().replaceAll(':', '%3A'), limit = 1, via) => {
        return new Promise((resolve, reject) => {
            if (startId && endId) {
                /*
                params: minChangeTime (number)
                        timeStamp (ISO DateTime) 2023-07-16T14%3A00%3A00.000Z
                        via
                */

                let url = 'https://api.timetable.eurail.com/v2/timetable?' +
                'origin=' + startId + 
                '&destination=' + endId + 
                '&timestamp=' + timeStamp + 
                '&tripsNumber=' + limit;

                if (via) {
                    url += '&via=' + via
                }

                url += '&arrival=false&currency=EUR&travellers=1'

                axios.get(url).then(r => {
                    if (limit == 1) {
                        resolve([r.data[0]])
                    } else {
                        resolve(r.data)
                    }
                })
                .catch(e => {
                    console.log(e)
                    reject(e)
                })
            }
        })
    } 
    
    const getConnections = (startId = '', endId = '', timeStamp = new Date('2024-05-10').toISOString(), limit = 1, filters = {}) => {
        return new Promise((resolve, reject) => {
            if (startId && endId) {

                timeStamp = timeStamp.replaceAll(':', '%3A')

                console.log(timeStamp)
                /*
                params: minChangeTime (number)
                        timeStamp (ISO DateTime) 2023-07-16T14%3A00%3A00.000Z

                */

                console.log(startId, endId, timeStamp)

                loadSimpleConnection(startId, endId, timeStamp, limit, filters.via).then(r => {
                    let p = []
                    for (let i = 0; i < r.length; i++) {
                        p.push(loadJourneyStops(r[i], r[i].legs, filters))
                    }

                    Promise.all(p).then(r => {

                        //create the journeys so that they include only legs valid for traveling options
                        const updatedJourneys = getMatchingJourneys(r, filters.option, filters)

                        //check which journeys are complete
                        checkThatJourneysAreComplete(updatedJourneys, filters).then(unfinishedJourneys => {

                            //if there are no unfinished journeys, stop processing
                            if (unfinishedJourneys.length == 0) {
                                resolve(updatedJourneys)
                            } else {

                                //else, start ir from the latest stop
                                let p = []
                                for (let i = 0; i < unfinishedJourneys.length; i++) {
                                    p.push(getConnections(unfinishedJourneys[i].id, endId, unfinishedJourneys[i].timeStamp, 1, filters))
                                }

                                Promise.all(p).then(transfers => {
                                    for (let i = 0; i < updatedJourneys.length; i++) {
                                        const j = unfinishedJourneys.findIndex(x => x.index == i)
                                        if (j > -1 && transfers[j].length > 0) {
                                            updatedJourneys[j].legs = updatedJourneys[j].legs.concat(transfers[j][0].legs)
                                        }
                                    }

                                    if (updatedJourneys.length > 0) {
                                        const checkedJourneys = updatedJourneys.filter(x => x.legs.length > 0 && x.legs[0].start.id == startId && x.legs[x.legs.length - 1].end.id == endId)
                                        resolve(checkedJourneys)
                                    } else {
                                        resolve(updatedJourneys)
                                    }
                                    
                                })
                                .catch(e => {
                                    reject(e)
                                })
                            }
                        })
                        .catch(e => {
                            reject(e)
                        })
                    })
                    .catch(e => {
                        reject(e)
                    })
                })
                .catch(e => {
                    reject(e)
                })

            //Göteborg C: 740000002
            //Haparanda: 740000372
            //Halmstad C: 740000080
            //Malmö C: 740000003
            //Nynäshamn: 740000727
            //Stockholm C: 740000001
            //Trelleborg: 740000088
            //Umeå: 740020461

            //ruotsi-apikey: e276bfc7-eaeb-4bc0-82d2-ec8fd2553630
            //get stop by name: https://api.resrobot.se/v2.1/location.name?input=G%C3%B6teborg&format=json&accessId=API_KEY
            //get route: https://api.resrobot.se/v2.1/trip?format=json&originId=stop.extId&destId=stop.extId&passlist=true&showPassingPoints=true&accessId=API_KEY

            //Yhteydet
            //1. Haetaan Interrail-apista suora yhteys Suomi-kohde - Ulkomaan kohde (säilytä tämä)
            //2. Haetaan tiedostosta laiva-yhteys Nynäshamn ja Uumajaan (vain alussa)
            //3. Haetaan Resrobot-apista myös yhteys Tukholma/Nynäshamn - Göteborg/Karlskrona/Trelleborg
            //4. Haetaan Interrail-apista jatkoyhteydet alk. Kiel, Gdynia, Rostock (kun tiedetään päivä)
            //-----
            //Katsotaan mihin asti matkustus ehtii -->
            //jos ei rajoitusta, käytetään kohdassa 1 haettua yhteyttä (jos löytynyt, jos ei, hae uudestaan jo saavutetusta kohdasta)
            //jos rajoitus (ei), katkaise matkanteko viimeisimpään paikkaan joka täyttää aikarajan
            //jos rajoitus (yksi yhteys), hae yhteys joka lähtee/saapuu min. vaihtoajan puitteissa tai jatkuu aikarajan yli.
            //Toista kunnes määränpää saavutettu.      
            
            //Esim. Tampere - Hampuri
            //hae Interrail - Tampere-Hampuri
            //Hae myös 

            //FRGO - Fredrikshavn (DEN) - Göteborg (SWE)
            //GDKA - Gdynia (PL) - Karlskrona (SWE)
            //GOKI - Göteborg (SWE) - Kiel (DE)
            //GRHA - Grenå (DEN) - Halmstad (SWE)
            //HFNY - Hanko (FIN) - Nynäshamn (SWE)
            //RSTB - Rostock (DE) - Trelleborg (SWE)
            //url: https://www.stenaline.fi/reittimme/_jcr_content.timetable.[ROUTE_CODE].[YYYY-MM-DD].json
        } else {
            reject('start id or end id not given!')
        }

        })
    } 

    const getMatchingJourneys = (j = [], option, filters = {}) => {
        const startMinutes = filters.startTime ? Number(filters.startTime.split(':')[0]) * 60 + Number(filters.startTime.split(':')[1]) : ''
        const endMinutes = filters.endTime ? Number(filters.endTime.split(':')[0]) * 60 + Number(filters.endTime.split(':')[1]) : ''

        let tmp = []
        for (let i = 0; i < j.length; i++) {
            const journey = JSON.parse(JSON.stringify(j[i]))
            let updatedLegs = []
            for (let j = 0; j < journey.legs.length; j++) {
                const leg = journey.legs[j]

                const legStartTime = new Date(leg.start.dateTimeInISO).toLocaleTimeString('fi-FI', { hour: "2-digit", minute: "2-digit" })
                const legEndTime = new Date(leg.end.dateTimeInISO).toLocaleTimeString('fi-FI', { hour: "2-digit", minute: "2-digit" })
                const legStartMinutes = Number(legStartTime.split('.')[0]) * 60 + Number(legStartTime.split('.')[1])
                const legEndMinutes = Number(legEndTime.split('.')[0]) * 60 + Number(legEndTime.split('.')[1])

                //leg is in the given time period
                //e.g. 9-14 is in time period 8-22
                if (option == 3) {
                    addLeg(updatedLegs, leg)
                } else {

                    //case e.g
                    //start time: 6.00, end time: 22.00
                    //leg start: 7.00, leg end: 11.00
                    if (legStartMinutes >= startMinutes && legEndMinutes <= endMinutes && legEndMinutes >= startMinutes) {
                        if (legStartMinutes > legEndMinutes) {
                            if (option == 2) {
                                addLeg(updatedLegs, leg)
                            } else {
                                break;
                            }
                        } else {
                            addLeg(updatedLegs, leg)
                        }
                    } else if (option != 1 || (option == 1 && legStartMinutes >= startMinutes && legEndMinutes <= endMinutes)) {
                        if (legStartMinutes < endMinutes) {
                            let remainingStops = []
                            if (leg.stops) {
                                for (let k = 0; k < leg.stops.length; k++) {
                                    if (leg.stops[k].time) {
                                        const stopMinutes = (leg.stops[k].time.hours * 60) + leg.stops[k].time.minutes
                                        if (stopMinutes <= endMinutes) {
                                            remainingStops.push(leg.stops[k])
                                        } else {
                                            break;
                                        }
                                    }                                 
                                }
                            }

                            //update leg stops.
                            if (remainingStops.length > 0) {
                                if (option != 3) {
                                    if (legEndMinutes < startMinutes) {
                                        leg.end = {
                                            country: remainingStops[remainingStops.length - 1].country,
                                            dateTimeInISO: leg.start.dateTimeInISO.split('T')[0] + 'T' + remainingStops[remainingStops.length - 1].time.hours + ':' + remainingStops[remainingStops.length - 1].time.minutes + ':00',
                                            station: remainingStops[remainingStops.length - 1].station,
                                            time: remainingStops[remainingStops.length - 1].time
                                        }
                                        remainingStops.pop()
                                    }
                                }
                                leg.stops = remainingStops
                                
                                addLeg(updatedLegs, leg)
                            }
                        }
                        break;
                    } else {
                        break;
                    }
                }
            }

            for (let j = updatedLegs.length - 1; j >= 0; j--) {
                if (updatedLegs[j].type != 'TRAIN_TRAVEL') {
                    updatedLegs.splice(j, 1)
                } else {
                    break;
                }
            }

            journey.legs = updatedLegs
            if (journey.legs && journey.legs.length > 0) {
                tmp.push(journey)
            }
            
        }

        return tmp
    }

    return {
        getConnections,
        loadSimpleConnection
    }
}